from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from models import *
from schemas import *
from auth import get_password_hash
from datetime import datetime, timedelta
from typing import List, Dict, Any
import json

# User CRUD operations
def get_user(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(User).offset(skip).limit(limit).all()

def create_user_db(db: Session, user: UserCreate):
    hashed_password = get_password_hash(user.password)
    db_user = User(
        name=user.name,
        email=user.email,
        hashed_password=hashed_password,
        role=user.role
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user_db(db: Session, user_id: int, user_update: UserUpdate):
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user:
        for field, value in user_update.dict(exclude_unset=True).items():
            setattr(db_user, field, value)
        db_user.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(db_user)
    return db_user

def delete_user_db(db: Session, user_id: int):
    db_user = db.query(User).filter(User.id == user_id).first()
    if db_user:
        db.delete(db_user)
        db.commit()
    return {"message": "User deleted successfully"}

# Ingredient CRUD operations
def get_ingredient(db: Session, ingredient_id: int):
    return db.query(Ingredient).filter(Ingredient.id == ingredient_id).first()

def get_ingredients(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Ingredient).offset(skip).limit(limit).all()

def create_ingredient_db(db: Session, ingredient: IngredientCreate):
    db_ingredient = Ingredient(**ingredient.dict())
    db.add(db_ingredient)
    db.commit()
    db.refresh(db_ingredient)
    return db_ingredient

def update_ingredient_db(db: Session, ingredient_id: int, ingredient_update: IngredientUpdate):
    db_ingredient = db.query(Ingredient).filter(Ingredient.id == ingredient_id).first()
    if db_ingredient:
        for field, value in ingredient_update.dict(exclude_unset=True).items():
            setattr(db_ingredient, field, value)
        db_ingredient.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(db_ingredient)
    return db_ingredient

def delete_ingredient_db(db: Session, ingredient_id: int):
    db_ingredient = db.query(Ingredient).filter(Ingredient.id == ingredient_id).first()
    if db_ingredient:
        db.delete(db_ingredient)
        db.commit()
    return {"message": "Ingredient deleted successfully"}

# Meal CRUD operations
def get_meal(db: Session, meal_id: int):
    return db.query(Meal).filter(Meal.id == meal_id).first()

def get_meals(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Meal).offset(skip).limit(limit).all()

def create_meal_db(db: Session, meal: MealCreate):
    db_meal = Meal(
        name=meal.name,
        description=meal.description,
        category=meal.category,
        servings=meal.servings,
        preparation_time=meal.preparation_time
    )
    db.add(db_meal)
    db.commit()
    db.refresh(db_meal)
    
    # Add ingredients
    for ingredient_data in meal.ingredients:
        db_meal_ingredient = MealIngredient(
            meal_id=db_meal.id,
            ingredient_id=ingredient_data.ingredient_id,
            quantity=ingredient_data.quantity,
            unit=ingredient_data.unit
        )
        db.add(db_meal_ingredient)
    
    db.commit()
    return db_meal

def update_meal_db(db: Session, meal_id: int, meal_update: MealUpdate):
    db_meal = db.query(Meal).filter(Meal.id == meal_id).first()
    if db_meal:
        for field, value in meal_update.dict(exclude_unset=True, exclude={'ingredients'}).items():
            setattr(db_meal, field, value)
        
        # Update ingredients if provided
        if meal_update.ingredients is not None:
            # Delete existing ingredients
            db.query(MealIngredient).filter(MealIngredient.meal_id == meal_id).delete()
            
            # Add new ingredients
            for ingredient_data in meal_update.ingredients:
                db_meal_ingredient = MealIngredient(
                    meal_id=meal_id,
                    ingredient_id=ingredient_data.ingredient_id,
                    quantity=ingredient_data.quantity,
                    unit=ingredient_data.unit
                )
                db.add(db_meal_ingredient)
        
        db_meal.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(db_meal)
    return db_meal

def delete_meal_db(db: Session, meal_id: int):
    db_meal = db.query(Meal).filter(Meal.id == meal_id).first()
    if db_meal:
        # Delete associated meal ingredients
        db.query(MealIngredient).filter(MealIngredient.meal_id == meal_id).delete()
        db.delete(db_meal)
        db.commit()
    return {"message": "Meal deleted successfully"}

def calculate_max_portions(db: Session, meal_id: int):
    meal = db.query(Meal).filter(Meal.id == meal_id).first()
    if not meal:
        return {"max_portions": 0, "limiting_ingredient": None}
    
    min_portions = float('inf')
    limiting_ingredient = None
    
    for meal_ingredient in meal.ingredients:
        ingredient = meal_ingredient.ingredient
        available_quantity = ingredient.quantity
        needed_per_serving = meal_ingredient.quantity
        
        possible_portions = available_quantity // needed_per_serving
        
        if possible_portions < min_portions:
            min_portions = possible_portions
            limiting_ingredient = ingredient.name
    
    return {
        "max_portions": int(min_portions) if min_portions != float('inf') else 0,
        "limiting_ingredient": limiting_ingredient
    }

# Serving operations
def serve_meal_db(db: Session, serving: ServingCreate, user_id: int):
    meal = db.query(Meal).filter(Meal.id == serving.meal_id).first()
    user = db.query(User).filter(User.id == user_id).first()
    
    if not meal or not user:
        raise HTTPException(status_code=404, detail="Meal or user not found")
    
    # Check if we have enough ingredients
    insufficient_ingredients = []
    
    for meal_ingredient in meal.ingredients:
        ingredient = meal_ingredient.ingredient
        needed_quantity = meal_ingredient.quantity * serving.portions
        
        if ingredient.quantity < needed_quantity:
            insufficient_ingredients.append({
                "name": ingredient.name,
                "needed": needed_quantity,
                "available": ingredient.quantity
            })
    
    # Create serving log
    if insufficient_ingredients:
        failure_reason = f"Insufficient {insufficient_ingredients[0]['name']} (needed {insufficient_ingredients[0]['needed']}{meal_ingredient.unit}, had {insufficient_ingredients[0]['available']}{meal_ingredient.unit})"
        status = "failed"
    else:
        # Deduct ingredients
        for meal_ingredient in meal.ingredients:
            ingredient = meal_ingredient.ingredient
            needed_quantity = meal_ingredient.quantity * serving.portions
            ingredient.quantity -= needed_quantity
            ingredient.updated_at = datetime.utcnow()
        
        failure_reason = None
        status = "success"
    
    serving_log = ServingLog(
        meal_id=serving.meal_id,
        user_id=user_id,
        portions=serving.portions,
        status=status,
        failure_reason=failure_reason
    )
    
    db.add(serving_log)
    db.commit()
    db.refresh(serving_log)
    
    return serving_log

def get_serving_logs(db: Session, skip: int = 0, limit: int = 100):
    return db.query(ServingLog).order_by(desc(ServingLog.timestamp)).offset(skip).limit(limit).all()

# Analytics functions
def get_dashboard_stats(db: Session):
    total_ingredients = db.query(Ingredient).count()
    low_stock_items = db.query(Ingredient).filter(Ingredient.quantity <= Ingredient.threshold).count()
    
    today = datetime.now().date()
    meals_served_today = db.query(func.sum(ServingLog.portions)).filter(
        func.date(ServingLog.timestamp) == today,
        ServingLog.status == "success"
    ).scalar() or 0
    
    total_students = 120  # This could be a setting
    
    inventory_value = db.query(func.sum(Ingredient.quantity * Ingredient.cost)).scalar() or 0
    
    # Calculate monthly discrepancy (simplified)
    monthly_discrepancy = 8.2  # This would be calculated based on actual vs expected usage
    
    return {
        "total_ingredients": total_ingredients,
        "low_stock_items": low_stock_items,
        "meals_served_today": meals_served_today,
        "total_students": total_students,
        "inventory_value": round(inventory_value, 2),
        "monthly_discrepancy": monthly_discrepancy
    }

def get_ingredient_usage_data(db: Session, days: int = 30):
    # This would be calculated based on serving logs and ingredient consumption
    # For now, returning mock data structure
    return [
        {"name": "Week 1", "beef": 2400, "chicken": 1800, "rice": 3200, "potatoes": 4800},
        {"name": "Week 2", "beef": 1800, "chicken": 2200, "rice": 2800, "potatoes": 4200},
        {"name": "Week 3", "beef": 2200, "chicken": 1600, "rice": 3000, "potatoes": 4600},
        {"name": "Week 4", "beef": 2600, "chicken": 2000, "rice": 3400, "potatoes": 5000},
    ]

def get_meal_popularity_data(db: Session, days: int = 30):
    start_date = datetime.now() - timedelta(days=days)
    
    popularity = db.query(
        Meal.name,
        func.sum(ServingLog.portions).label('total_portions')
    ).join(ServingLog).filter(
        ServingLog.timestamp >= start_date,
        ServingLog.status == "success"
    ).group_by(Meal.name).all()
    
    total_portions = sum([p.total_portions for p in popularity])
    
    return [
        {
            "name": meal.name,
            "value": round((meal.total_portions / total_portions) * 100, 1) if total_portions > 0 else 0,
            "color": ["#8884d8", "#82ca9d", "#ffc658", "#ff7c7c"][i % 4]
        }
        for i, meal in enumerate(popularity[:4])
    ]

def get_waste_analysis_data(db: Session, days: int = 30):
    # This would be calculated based on actual waste tracking
    return [
        {"ingredient": "Carrots", "wasted": 120, "percentage": 8.2},
        {"ingredient": "Potatoes", "wasted": 200, "percentage": 4.1},
        {"ingredient": "Rice", "wasted": 150, "percentage": 3.8},
        {"ingredient": "Beef", "wasted": 80, "percentage": 3.2},
    ]

def get_efficiency_data(db: Session, days: int = 30):
    return {
        "monthly_efficiency": 87.2,
        "waste_reduction": 4.8,
        "average_prep_time": 32,
        "cost_per_portion": 2.45
    }

# Settings operations
def get_system_settings(db: Session):
    settings = db.query(Settings).all()
    settings_dict = {setting.key: setting.value for setting in settings}
    
    # Default settings if not found
    default_settings = {
        "kindergarten_name": "Little Sprouts Kindergarten",
        "address": "123 Learning Lane, Education City",
        "phone": "+1 (555) 123-4567",
        "email": "contact@littlesprouts.edu",
        "low_stock_threshold_days": 7,
        "auto_reorder_enabled": False,
        "notification_email": "admin@littlesprouts.edu",
        "timezone": "UTC",
        "currency": "USD"
    }
    
    for key, default_value in default_settings.items():
        if key not in settings_dict:
            settings_dict[key] = default_value
    
    return settings_dict

def update_system_settings(db: Session, settings: SettingsUpdate):
    for field, value in settings.dict(exclude_unset=True).items():
        db_setting = db.query(Settings).filter(Settings.key == field).first()
        if db_setting:
            db_setting.value = str(value)
            db_setting.updated_at = datetime.utcnow()
        else:
            db_setting = Settings(key=field, value=str(value))
            db.add(db_setting)
    
    db.commit()
    return get_system_settings(db)

# Report generation
def generate_inventory_report_data(db: Session, format: str = "json"):
    ingredients = db.query(Ingredient).all()
    
    report_data = {
        "generated_at": datetime.now().isoformat(),
        "total_items": len(ingredients),
        "total_value": sum([ing.quantity * ing.cost for ing in ingredients]),
        "low_stock_items": len([ing for ing in ingredients if ing.quantity <= ing.threshold]),
        "ingredients": [
            {
                "name": ing.name,
                "quantity": ing.quantity,
                "unit": ing.unit,
                "value": ing.quantity * ing.cost,
                "status": "low" if ing.quantity <= ing.threshold else "good",
                "category": ing.category
            }
            for ing in ingredients
        ]
    }
    
    return report_data

def generate_usage_report_data(db: Session, start_date: str, end_date: str, format: str = "json"):
    start = datetime.fromisoformat(start_date)
    end = datetime.fromisoformat(end_date)
    
    serving_logs = db.query(ServingLog).filter(
        ServingLog.timestamp >= start,
        ServingLog.timestamp <= end,
        ServingLog.status == "success"
    ).all()
    
    report_data = {
        "period": {"start": start_date, "end": end_date},
        "total_meals_served": sum([log.portions for log in serving_logs]),
        "success_rate": len([log for log in serving_logs if log.status == "success"]) / len(serving_logs) if serving_logs else 0,
        "daily_breakdown": {}  # Would be calculated based on actual data
    }
    
    return report_data
