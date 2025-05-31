# crud.py
from __future__ import annotations
from typing import Any, Union, Dict
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from models import *
from schemas import *
from auth import get_password_hash
from datetime import datetime, timedelta, timezone
from fastapi import HTTPException


# User CRUD operations
def get_user(db_session: Session, user_id: int) -> User | None:
    """Get a user by their ID."""
    # noinspection PyTypeChecker
    return db_session.query(User).filter(User.id == user_id).first()


def get_user_by_email(db_session: Session, email: str) -> User | None:
    """Get a user by their email address."""
    # noinspection PyTypeChecker
    return db_session.query(User).filter(User.email == email).first()


def get_users(db_session: Session, skip: int = 0, limit: int = 100) -> list[type[User]]:
    """Get a list of users with pagination."""
    return db_session.query(User).offset(skip).limit(limit).all()


def create_user_db(db_session: Session, user: UserCreate) -> User:
    """Create a new user in the database."""
    hashed_password = get_password_hash(user.password)
    db_user = User(
        name=user.name,
        email=user.email,
        hashed_password=hashed_password,
        role=user.role
    )
    db_session.add(db_user)
    db_session.commit()
    db_session.refresh(db_user)
    return db_user


def update_user_db(db_session: Session, user_id: int, user_update: UserUpdate) -> User | None:
    """Update an existing user."""
    # noinspection PyTypeChecker
    db_user = db_session.query(User).filter(User.id == user_id).first()
    if db_user:
        update_data = user_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_user, field, value)
        db_user.updated_at = datetime.now(timezone.utc)
        db_session.commit()
        db_session.refresh(db_user)
    return db_user


def delete_user_db(db_session: Session, user_id: int) -> Dict[str, str]:
    """Delete a user from the database."""
    # noinspection PyTypeChecker
    db_user = db_session.query(User).filter(User.id == user_id).first()
    if db_user:
        db_session.delete(db_user)
        db_session.commit()
    return {"message": "User deleted successfully"}


# Ingredient CRUD operations
def get_ingredient(db_session: Session, ingredient_id: int) -> Ingredient | None:
    """Get an ingredient by its ID."""
    # noinspection PyTypeChecker
    return db_session.query(Ingredient).filter(Ingredient.id == ingredient_id).first()


def get_ingredients(db_session: Session, skip: int = 0, limit: int = 100) -> list[type[Ingredient]]:
    """Get a list of ingredients with pagination."""
    return db_session.query(Ingredient).offset(skip).limit(limit).all()


def create_ingredient_db(db_session: Session, ingredient: IngredientCreate) -> Ingredient:
    """Create a new ingredient in the database."""
    db_ingredient = Ingredient(**ingredient.model_dump())
    db_session.add(db_ingredient)
    db_session.commit()
    db_session.refresh(db_ingredient)
    return db_ingredient


def update_ingredient_db(db_session: Session, ingredient_id: int,
                         ingredient_update: IngredientUpdate) -> Ingredient | None:
    """Update an existing ingredient."""
    # noinspection PyTypeChecker
    db_ingredient = db_session.query(Ingredient).filter(Ingredient.id == ingredient_id).first()
    if db_ingredient:
        update_data = ingredient_update.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_ingredient, field, value)
        db_ingredient.updated_at = datetime.now(timezone.utc)
        db_session.commit()
        db_session.refresh(db_ingredient)
    return db_ingredient


def delete_ingredient_db(db_session: Session, ingredient_id: int) -> Dict[str, str]:
    """Delete an ingredient from the database."""
    # noinspection PyTypeChecker
    db_ingredient = db_session.query(Ingredient).filter(Ingredient.id == ingredient_id).first()
    if db_ingredient:
        db_session.delete(db_ingredient)
        db_session.commit()
    return {"message": "Ingredient deleted successfully"}


# Meal CRUD operations
def get_meal(db_session: Session, meal_id: int) -> Meal | None:
    """Get a meal by its ID."""
    # noinspection PyTypeChecker
    return db_session.query(Meal).filter(Meal.id == meal_id).first()


def get_meals(db_session: Session, skip: int = 0, limit: int = 100) -> list[type[Meal]]:
    """Get a list of meals with pagination."""
    return db_session.query(Meal).offset(skip).limit(limit).all()


def create_meal_db(db_session: Session, meal: MealCreate) -> Meal:
    """Create a new meal in the database."""
    db_meal = Meal(
        name=meal.name,
        description=meal.description,
        category=meal.category,
        servings=meal.servings,
        preparation_time=meal.preparation_time
    )
    db_session.add(db_meal)
    db_session.commit()
    db_session.refresh(db_meal)

    for ingredient_data in meal.ingredients:
        db_meal_ingredient = MealIngredient(
            meal_id=db_meal.id,
            ingredient_id=ingredient_data.ingredient_id,
            quantity=ingredient_data.quantity,
            unit=ingredient_data.unit
        )
        db_session.add(db_meal_ingredient)

    db_session.commit()
    return db_meal


def update_meal_db(db_session: Session, meal_id: int, meal_update: MealUpdate) -> Meal | None:
    """Update an existing meal."""
    # noinspection PyTypeChecker
    db_meal = db_session.query(Meal).filter(Meal.id == meal_id).first()
    if db_meal:
        update_data = meal_update.model_dump(exclude_unset=True, exclude={'ingredients'})
        for field, value in update_data.items():
            setattr(db_meal, field, value)

        if meal_update.ingredients is not None:
            # noinspection PyTypeChecker
            db_session.query(MealIngredient).filter(MealIngredient.meal_id == meal_id).delete()
            for ingredient_data in meal_update.ingredients:
                db_meal_ingredient = MealIngredient(
                    meal_id=meal_id,
                    ingredient_id=ingredient_data.ingredient_id,
                    quantity=ingredient_data.quantity,
                    unit=ingredient_data.unit
                )
                db_session.add(db_meal_ingredient)

        db_meal.updated_at = datetime.now(timezone.utc)
        db_session.commit()
        db_session.refresh(db_meal)
    return db_meal


def delete_meal_db(db_session: Session, meal_id: int) -> Dict[str, str]:
    """Delete a meal from the database."""
    # noinspection PyTypeChecker
    db_meal = db_session.query(Meal).filter(Meal.id == meal_id).first()
    if db_meal:
        # noinspection PyTypeChecker
        db_session.query(MealIngredient).filter(MealIngredient.meal_id == meal_id).delete()
        db_session.delete(db_meal)
        db_session.commit()
    return {"message": "Meal deleted successfully"}


def calculate_max_portions(db_session: Session, meal_id: int) -> Dict[str, Union[int, None | str]]:
    """Calculate the maximum number of portions available for a meal."""
    # noinspection PyTypeChecker
    meal = db_session.query(Meal).filter(Meal.id == meal_id).first()
    if not meal:
        return {"max_portions": 0, "limiting_ingredient": None}

    min_portions = float('inf')
    limiting_ingredient = None

    for meal_ingredient in meal.ingredients:
        ingredient = meal_ingredient.ingredient
        possible_portions = ingredient.quantity // meal_ingredient.quantity

        if possible_portions < min_portions:
            min_portions = possible_portions
            limiting_ingredient = ingredient.name

    return {
        "max_portions": int(min_portions) if min_portions != float('inf') else 0,
        "limiting_ingredient": limiting_ingredient
    }


# Serving operations
def serve_meal_db(db_session: Session, serving: ServingCreate, user_id: int) -> ServingLog:
    """Record a meal serving and update inventory."""
    # noinspection PyTypeChecker
    meal = db_session.query(Meal).filter(Meal.id == serving.meal_id).first()
    # noinspection PyTypeChecker
    user = db_session.query(User).filter(User.id == user_id).first()

    if not meal or not user:
        raise HTTPException(status_code=404, detail="Meal or user not found")

    insufficient_ingredients = []
    for meal_ingredient in meal.ingredients:
        ingredient = meal_ingredient.ingredient
        needed_quantity = meal_ingredient.quantity * serving.portions

        if ingredient.quantity < needed_quantity:
            insufficient_ingredients.append({
                "name": ingredient.name,
                "needed": needed_quantity,
                "available": ingredient.quantity,
                "unit": meal_ingredient.unit
            })

    if insufficient_ingredients:
        first_issue = insufficient_ingredients[0]
        failure_reason = (f"Insufficient {first_issue['name']} "
                          f"(needed {first_issue['needed']}{first_issue['unit']}, "
                          f"had {first_issue['available']}{first_issue['unit']})")
        status = "failed"
    else:
        for meal_ingredient in meal.ingredients:
            ingredient = meal_ingredient.ingredient
            needed_quantity = meal_ingredient.quantity * serving.portions
            ingredient.quantity -= needed_quantity
            ingredient.updated_at = datetime.now(timezone.utc)
        failure_reason = None
        status = "success"

    serving_log = ServingLog(
        meal_id=serving.meal_id,
        user_id=user_id,
        portions=serving.portions,
        status=status,
        failure_reason=failure_reason
    )

    db_session.add(serving_log)
    db_session.commit()
    db_session.refresh(serving_log)
    return serving_log


def get_serving_logs(db_session: Session, skip: int = 0, limit: int = 100) -> list[type[ServingLog]]:
    """Get a paginated list of serving logs."""
    return db_session.query(ServingLog).order_by(desc(ServingLog.timestamp)).offset(skip).limit(limit).all()


# Analytics functions
def get_dashboard_stats(db_session: Session) -> Dict[str, Any]:
    """Get statistics for the dashboard."""
    total_ingredients = db_session.query(Ingredient).count()
    # noinspection PyTypeChecker
    low_stock_items = db_session.query(Ingredient).filter(Ingredient.quantity <= Ingredient.threshold).count()

    today = datetime.now(timezone.utc).date()
    # noinspection PyTypeChecker
    meals_served_today = db_session.query(func.sum(ServingLog.portions)).filter(
        func.date(ServingLog.timestamp) == today,
        ServingLog.status == "success"
    ).scalar() or 0

    inventory_value = db_session.query(func.sum(Ingredient.quantity * Ingredient.cost)).scalar() or 0

    return {
        "total_ingredients": total_ingredients,
        "low_stock_items": low_stock_items,
        "meals_served_today": meals_served_today,
        "inventory_value": round(inventory_value, 2)
    }


def get_ingredient_usage_data(db_session: Session, days: int = 30) -> list[dict[str, Any]]:
    """Get ingredient usage data for visualization."""
    usage_start_date = datetime.now(timezone.utc) - timedelta(days=days)

    # noinspection PyTypeChecker
    usage_data = db_session.query(
        Ingredient.name,
        func.sum(MealIngredient.quantity * ServingLog.portions).label('total_used')
    ).join(MealIngredient, MealIngredient.ingredient_id == Ingredient.id) \
        .join(ServingLog, ServingLog.meal_id == MealIngredient.meal_id) \
        .filter(
        ServingLog.timestamp >= usage_start_date,
        ServingLog.status == "success"
    ).group_by(Ingredient.name).all()

    return [{"name": item.name, "total_used": item.total_used} for item in usage_data]


def get_meal_popularity_data(db_session: Session, days: int = 30) -> list[dict[str, Any]]:
    """Get meal popularity data for visualization."""
    popularity_start_date = datetime.now(timezone.utc) - timedelta(days=days)

    # noinspection PyTypeChecker
    popularity = db_session.query(
        Meal.name,
        func.sum(ServingLog.portions).label('total_portions')
    ).join(ServingLog).filter(
        ServingLog.timestamp >= popularity_start_date,
        ServingLog.status == "success"
    ).group_by(Meal.name).all()

    total_portions = sum([p.total_portions for p in popularity]) or 1

    return [
        {
            "name": meal.name,
            "value": round((meal.total_portions / total_portions) * 100, 1),
            "color": ["#8884d8", "#82ca9d", "#ffc658", "#ff7c7c"][i % 4]
        }
        for i, meal in enumerate(popularity[:4])
    ]


# noinspection PyTypeChecker
def get_waste_analysis_data(db_session: Session, days: int = 30) -> list[dict[str, Any]]:
    """Get waste analysis data for visualization."""
    waste_start_date = datetime.now(timezone.utc) - timedelta(days=days)

    waste_data = db_session.query(
        Ingredient.name,
        func.sum(Ingredient.quantity - Ingredient.threshold).label('wasted')
    ).filter(
        Ingredient.quantity > Ingredient.threshold,
        Ingredient.updated_at >= waste_start_date
    ).group_by(Ingredient.name).all()

    total_wasted = sum([i.wasted for i in waste_data]) if waste_data else 1

    return [
        {
            "ingredient": item.name,
            "wasted": item.wasted,
            "percentage": round((item.wasted / total_wasted) * 100) if waste_data else 0
        }
        for item in waste_data[:4]
    ]


# Settings operations
def get_system_settings(db_session: Session) -> Dict[str, Any]:
    """Get all system settings."""
    settings = db_session.query(Settings).all()
    return {setting.key: setting.value for setting in settings}


def update_system_settings(db_session: Session, settings: SettingsUpdate) -> Dict[str, Any]:
    """Update system settings."""
    for field, value in settings.model_dump(exclude_unset=True).items():
        # noinspection PyTypeChecker
        db_setting = db_session.query(Settings).filter(Settings.key == field).first()
        if db_setting:
            db_setting.value = str(value)
            db_setting.updated_at = datetime.now(timezone.utc)
        else:
            db_setting = Settings(key=field, value=str(value))
            db_session.add(db_setting)

    db_session.commit()
    return get_system_settings(db_session)


# Report generation
def generate_inventory_report_data(db_session: Session) -> Dict[str, Any]:
    """Generate inventory report data."""
    ingredients = db_session.query(Ingredient).all()

    return {
        "generated_at": datetime.now(timezone.utc).isoformat(),
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


def generate_usage_report_data(db_session: Session, report_start_date: str, report_end_date: str) -> Dict[str, Any]:
    """Generate usage report data."""
    start = datetime.fromisoformat(report_start_date)
    end = datetime.fromisoformat(report_end_date)

    # noinspection PyTypeChecker
    serving_logs = db_session.query(ServingLog).filter(
        ServingLog.timestamp >= start,
        ServingLog.timestamp <= end,
        ServingLog.status == "success"
    ).all()

    return {
        "period": {"start": report_start_date, "end": report_end_date},
        "total_meals_served": sum([log.portions for log in serving_logs]),
        "success_rate": len([log for log in serving_logs if log.status == "success"]) / len(
            serving_logs) if serving_logs else 0
    }