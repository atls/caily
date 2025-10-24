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
#  Meal Drafts & Logs
# ======================================================

class MealMacros(BaseModel):
    protein_g: float
    fat_g: float
    carbohydrates_g: float
    sugar_g: Optional[float] = 0
    fiber_g: Optional[float] = 0
    salt_g: Optional[float] = 0
    water_ml: Optional[float] = 0


class MealDraftCreateRequest(BaseModel):
    image_base64: Optional[str] = None  # картинка от пользователя
    text_description: Optional[str] = None  # текстовое описание еды (если без фото или в дополнение)


class MealDraftResponse(BaseModel):
    status: str = "ok"
    draft_id: int
    suggestion: Dict[str, Any]  # данные от GPT для фронта (фильтрованные)


class MacrosPayload(BaseModel):
    protein_g: Optional[float] = None
    fat_g: Optional[float] = None
    carbohydrates_g: Optional[float] = None
    sugar_g: Optional[float] = None
    fiber_g: Optional[float] = None
    salt_g: Optional[float] = None
    water_ml: Optional[int] = None

class ConfirmMealRequest(BaseModel):
    # В path приходит draft_id; в body — только подтверждённые/изменённые поля
    title: Optional[str] = None
    total_kcal: Optional[float] = None
    portion_weight_grams: Optional[float] = None
    portion_weight_oz: Optional[float] = None
    cooking_method: Optional[str] = None
    macros: Optional[MacrosPayload] = None
    satiety_hours: Optional[float] = None
    ingredients_detected: Optional[List[str]] = None
    time_of_day: Optional[str] = None
    eaten_at: Optional[datetime] = None
    location: Optional[str] = None
    extra_data: Optional[Dict[str, Any]] = None

class ConfirmMealResponse(BaseModel):
    status: str = "ok"
    meal_id: int
    draft_id: int


class MealLogResponse(BaseModel):
    id: int
    name: str
    kcal: float
    macros: MealMacros
    eaten_at: datetime
    time_of_day: Optional[str] = None
    location: Optional[str] = None
    draft_id: Optional[int] = None
    status: str = "ok"


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


class AuthBlock(BaseModel):
    name: str
    password: str
    avatar_id: Optional[str] = None


class OnboardingSubmitRequest(BaseModel):
    """Запрос от фронта при отправке онбординга (регистрация + профиль + цели)"""
    auth: AuthBlock  # логин, пароль, аватар
    profile: OnboardingProfile
    goal: OnboardingGoal
    experience: OnboardingExperience
    meta: Optional[OnboardingMeta] = None
    macros: OnboardingMacros
    data: Optional[Dict[str, Any]] = None  # полный JSON с фронта (если нужен для аналитики)


class OnboardingSubmitResponse(BaseModel):
    """Ответ после онбординга: токен, статус операции и сообщение"""
    status: str = "ok"
    token: Optional[str] = None
    message: Optional[str] = None