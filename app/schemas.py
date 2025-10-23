from datetime import date, datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel

from .models import GoalType


# ======================================================
#  Dashboard (unchanged)
# ======================================================

class Targets(BaseModel):
    goal: GoalType
    calories: int
    protein_g: int
    fat_g: int
    carbs_g: int
    sugar_g: int
    fiber_g: int


class MealItem(BaseModel):
    time: str
    name: str
    kcal: float
    protein_g: float
    fat_g: float
    carbs_g: float
    sugar_g: float
    fiber_g: float


class WaterItem(BaseModel):
    time: str
    ml: int


class WeightBlock(BaseModel):
    start_kg: float
    today_kg: Optional[float] = None


class Totals(BaseModel):
    kcal: float
    protein_g: float
    fat_g: float
    carbs_g: float
    sugar_g: float
    fiber_g: float
    water_ml: int


class DashboardResponse(BaseModel):
    date: date
    targets: Optional[Targets] = None
    meals: List[MealItem]
    water: List[WaterItem]
    weight: Optional[WeightBlock] = None
    totals: Totals


# ======================================================
#  Onboarding schemas
# ======================================================

class OnboardingProfile(BaseModel):
    gender: Optional[str]
    age: Optional[int]
    height_cm: Optional[int]
    weight_kg: Optional[float]


class OnboardingGoal(BaseModel):
    goal_type: Optional[GoalType]
    target_weight_kg: Optional[float]


class OnboardingExperience(BaseModel):
    counted_calories_before: Optional[bool]
    training_frequency: Optional[str]
    steps_per_day: Optional[int]
    work_type: Optional[str]


class OnboardingMeta(BaseModel):
    promo_code: Optional[str]
    app_version: Optional[str]
    device_type: Optional[str]
    locale: Optional[str]


class OnboardingMacros(BaseModel):
    target_calories: Optional[int]
    protein_g: Optional[int]
    fat_g: Optional[int]
    carbs_g: Optional[int]
    fiber_g: Optional[int]
    sugar_g: Optional[int]


class OnboardingSubmitRequest(BaseModel):
    """Запрос от фронта при финальном сабмите онбординга"""
    user_id: int
    profile: OnboardingProfile
    goal: OnboardingGoal
    experience: OnboardingExperience
    meta: Optional[OnboardingMeta] = None
    macros: OnboardingMacros
    data: Optional[Dict[str, Any]] = None  # оригинальный payload (если фронт его шлёт целиком)


class OnboardingSubmitResponse(BaseModel):
    """Ответ сервера после сохранения онбординга"""
    status: str
    user_id: int
    goal_id: Optional[int] = None
    created_at: datetime
    message: Optional[str] = None