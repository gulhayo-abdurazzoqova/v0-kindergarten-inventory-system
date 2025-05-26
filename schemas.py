from pydantic import BaseModel, EmailStr
from typing import List, Optional
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    admin = "admin"
    manager = "manager"
    cook = "cook"

class Token(BaseModel):
    access_token: str
    token_type: str
    user: 'UserResponse'

class TokenData(BaseModel):
    email: Optional[str] = None

class UserBase(BaseModel):
    name: str
    email: EmailStr
    role: UserRole = UserRole.cook

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[UserRole] = None
    status: Optional[str] = None

class UserResponse(UserBase):
    id: int
    status: str
    last_login: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True

class IngredientBase(BaseModel):
    name: str
    quantity: float
    unit: str
    threshold: float
    category: str
    cost: float

class IngredientCreate(IngredientBase):
    delivery_date: datetime

class IngredientUpdate(BaseModel):
    name: Optional[str] = None
    quantity: Optional[float] = None
    unit: Optional[str] = None
    threshold: Optional[float] = None
    category: Optional[str] = None
    cost: Optional[float] = None
    delivery_date: Optional[datetime] = None

class IngredientResponse(IngredientBase):
    id: int
    delivery_date: datetime
    created_at: datetime

    class Config:
        from_attributes = True

class MealIngredientBase(BaseModel):
    ingredient_id: int
    quantity: float
    unit: str

class MealIngredientResponse(MealIngredientBase):
    id: int
    ingredient_name: str

    class Config:
        from_attributes = True

class MealBase(BaseModel):
    name: str
    description: str
    category: str
    servings: int
    preparation_time: int

class MealCreate(MealBase):
    ingredients: List[MealIngredientBase]

class MealUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    servings: Optional[int] = None
    preparation_time: Optional[int] = None
    ingredients: Optional[List[MealIngredientBase]] = None

class MealResponse(MealBase):
    id: int
    ingredients: List[MealIngredientResponse]
    created_at: datetime

    class Config:
        from_attributes = True

class ServingCreate(BaseModel):
    meal_id: int
    portions: int

class ServingLogResponse(BaseModel):
    id: int
    meal_id: int
    meal_name: str
    user_id: int
    user_name: str
    portions: int
    status: str
    failure_reason: Optional[str]
    timestamp: datetime

    class Config:
        from_attributes = True

class SettingsBase(BaseModel):
    kindergarten_name: str
    address: str
    phone: str
    email: str
    low_stock_threshold_days: int
    auto_reorder_enabled: bool
    notification_email: str
    timezone: str
    currency: str

class SettingsUpdate(BaseModel):
    kindergarten_name: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    low_stock_threshold_days: Optional[int] = None
    auto_reorder_enabled: Optional[bool] = None
    notification_email: Optional[str] = None
    timezone: Optional[str] = None
    currency: Optional[str] = None

class SettingsResponse(SettingsBase):
    class Config:
        from_attributes = True
