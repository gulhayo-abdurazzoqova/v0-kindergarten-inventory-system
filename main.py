from fastapi import FastAPI, Depends, HTTPException, status, WebSocket, WebSocketDisconnect
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import List, Optional
import uvicorn
import json

from database import engine, SessionLocal, Base
from models import *
from schemas import *
from auth import authenticate_user, create_access_token, get_current_user, get_password_hash
from crud import *
from websocket_manager import ConnectionManager

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Kindergarten Meal Management System",
    description="Complete meal tracking and inventory management system",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# WebSocket manager
manager = ConnectionManager()

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Authentication endpoints
@app.post("/token", response_model=Token)
async def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer", "user": UserResponse.from_orm(user)}

# User endpoints
@app.post("/users/", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    db_user = get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    return create_user_db(db=db, user=user)

@app.get("/users/", response_model=List[UserResponse])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role not in ["admin", "manager"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    users = get_users(db, skip=skip, limit=limit)
    return users

@app.get("/users/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user

@app.put("/users/{user_id}", response_model=UserResponse)
def update_user(user_id: int, user_update: UserUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "admin" and current_user.id != user_id:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return update_user_db(db=db, user_id=user_id, user_update=user_update)

@app.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return delete_user_db(db=db, user_id=user_id)

# Ingredient endpoints
@app.post("/ingredients/", response_model=IngredientResponse)
def create_ingredient(ingredient: IngredientCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role not in ["admin", "manager"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return create_ingredient_db(db=db, ingredient=ingredient)

@app.get("/ingredients/", response_model=List[IngredientResponse])
def read_ingredients(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    ingredients = get_ingredients(db, skip=skip, limit=limit)
    return ingredients

@app.get("/ingredients/{ingredient_id}", response_model=IngredientResponse)
def read_ingredient(ingredient_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    ingredient = get_ingredient(db, ingredient_id=ingredient_id)
    if ingredient is None:
        raise HTTPException(status_code=404, detail="Ingredient not found")
    return ingredient

@app.put("/ingredients/{ingredient_id}", response_model=IngredientResponse)
def update_ingredient(ingredient_id: int, ingredient_update: IngredientUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role not in ["admin", "manager"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    updated_ingredient = update_ingredient_db(db=db, ingredient_id=ingredient_id, ingredient_update=ingredient_update)
    
    # Send real-time update
    await manager.broadcast(json.dumps({
        "type": "ingredient_updated",
        "data": IngredientResponse.from_orm(updated_ingredient).dict()
    }))
    
    return updated_ingredient

@app.delete("/ingredients/{ingredient_id}")
def delete_ingredient(ingredient_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role not in ["admin", "manager"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return delete_ingredient_db(db=db, ingredient_id=ingredient_id)

# Meal endpoints
@app.post("/meals/", response_model=MealResponse)
def create_meal(meal: MealCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role not in ["admin", "manager"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return create_meal_db(db=db, meal=meal)

@app.get("/meals/", response_model=List[MealResponse])
def read_meals(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    meals = get_meals(db, skip=skip, limit=limit)
    return meals

@app.get("/meals/{meal_id}", response_model=MealResponse)
def read_meal(meal_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    meal = get_meal(db, meal_id=meal_id)
    if meal is None:
        raise HTTPException(status_code=404, detail="Meal not found")
    return meal

@app.put("/meals/{meal_id}", response_model=MealResponse)
def update_meal(meal_id: int, meal_update: MealUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role not in ["admin", "manager"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return update_meal_db(db=db, meal_id=meal_id, meal_update=meal_update)

@app.delete("/meals/{meal_id}")
def delete_meal(meal_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role not in ["admin", "manager"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return delete_meal_db(db=db, meal_id=meal_id)

@app.get("/meals/{meal_id}/max-portions")
def get_meal_max_portions(meal_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return calculate_max_portions(db=db, meal_id=meal_id)

# Serving endpoints
@app.post("/servings/", response_model=ServingLogResponse)
def serve_meal(serving: ServingCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    serving_log = serve_meal_db(db=db, serving=serving, user_id=current_user.id)
    
    # Send real-time update
    await manager.broadcast(json.dumps({
        "type": "meal_served",
        "data": ServingLogResponse.from_orm(serving_log).dict()
    }))
    
    return serving_log

@app.get("/servings/", response_model=List[ServingLogResponse])
def read_serving_logs(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    logs = get_serving_logs(db, skip=skip, limit=limit)
    return logs

# Analytics endpoints
@app.get("/analytics/dashboard")
def get_dashboard_analytics(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_dashboard_stats(db)

@app.get("/analytics/ingredient-usage")
def get_ingredient_usage_analytics(days: int = 30, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_ingredient_usage_data(db, days=days)

@app.get("/analytics/meal-popularity")
def get_meal_popularity_analytics(days: int = 30, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_meal_popularity_data(db, days=days)

@app.get("/analytics/waste-analysis")
def get_waste_analysis(days: int = 30, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_waste_analysis_data(db, days=days)

@app.get("/analytics/efficiency")
def get_efficiency_metrics(days: int = 30, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_efficiency_data(db, days=days)

# Settings endpoints
@app.get("/settings/", response_model=SettingsResponse)
def get_settings(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role not in ["admin", "manager"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return get_system_settings(db)

@app.put("/settings/", response_model=SettingsResponse)
def update_settings(settings: SettingsUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return update_system_settings(db=db, settings=settings)

# Reports endpoints
@app.get("/reports/inventory")
def generate_inventory_report(format: str = "json", db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role not in ["admin", "manager"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return generate_inventory_report_data(db, format=format)

@app.get("/reports/usage")
def generate_usage_report(start_date: str, end_date: str, format: str = "json", db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role not in ["admin", "manager"]:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    return generate_usage_report_data(db, start_date=start_date, end_date=end_date, format=format)

# WebSocket endpoint
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.broadcast(data)
    except WebSocketDisconnect:
        manager.disconnect(websocket)

# Health check
@app.get("/health")
def health_check():
    return {"status": "healthy", "timestamp": datetime.now()}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
