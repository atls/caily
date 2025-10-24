from datetime import date, datetime
from enum import Enum
from typing import Optional, Any
from sqlalchemy import Column, JSON as SA_JSON
from sqlmodel import SQLModel, Field as SQLField


# ======================================================
#  User
# ======================================================

class User(SQLModel, table=True):
    """Базовый профиль пользователя + текущее состояние"""
    id: Optional[int] = SQLField(default=None, primary_key=True)
    name: str

    # --- аутентификация ---
    password_hash: str
    avatar_id: Optional[str] = None

    # --- профиль ---
    gender: Optional[str] = None              # male / female / other
    age: Optional[int] = None
    height_cm: Optional[int] = None
    current_weight_kg: Optional[float] = None

    # --- системное ---
    start_weight_kg: float = 0.0
    created_at: datetime = SQLField(default_factory=datetime.utcnow)
    updated_at: datetime = SQLField(default_factory=datetime.utcnow)
    current_goal_id: Optional[int] = SQLField(default=None, index=True)  # ссылка на активную цель


# ======================================================
#  Goal
# ======================================================

class GoalType(str, Enum):
    maintain = "maintain"
    lose = "lose"
    gain = "gain"
    eat_healthy = "eat_healthy"


class Goal(SQLModel, table=True):
    """История целей пользователя с макросами"""
    id: Optional[int] = SQLField(default=None, primary_key=True)
    user_id: int = SQLField(index=True)
    created_at: datetime = SQLField(default_factory=datetime.utcnow, index=True)

    goal_type: GoalType
    target_weight_kg: Optional[float] = None

    calories_kcal: int
    protein_g: int
    fat_g: int
    carbs_g: int
    sugar_g: Optional[int] = 0
    fiber_g: Optional[int] = 0

    is_active: bool = True  # удобно, если потом добавишь архив целей


# ======================================================
#  Meal / Water / Weight Logs
# ======================================================

class MealLog(SQLModel, table=True):
    """Подтверждённый приём пищи (из драфта или вручную)"""
    id: Optional[int] = SQLField(default=None, primary_key=True)
    user_id: int = SQLField(index=True)
    draft_id: Optional[int] = SQLField(default=None, index=True)  # связь с MealDraft

    eaten_at: datetime = SQLField(default_factory=datetime.utcnow, index=True)
    name: str

    # --- основные питательные данные ---
    kcal: float
    protein_g: float
    fat_g: float
    carbs_g: float
    sugar_g: Optional[float] = 0
    fiber_g: Optional[float] = 0
    salt_g: Optional[float] = 0
    water_ml: Optional[float] = 0

    # --- состав и контекст ---
    ingredients: Optional[list[str]] = SQLField(default=None, sa_column=Column(SA_JSON))
    cooking_method: Optional[str] = None
    portion_weight_grams: Optional[float] = None
    portion_weight_oz: Optional[float] = None
    satiety_hours: Optional[float] = None
    time_of_day: Optional[str] = None      # morning / lunch / evening / snack
    location: Optional[str] = None

    # --- дополнительные данные ---
    extra_data: Optional[dict] = SQLField(default=None, sa_column=Column(SA_JSON))
    created_at: datetime = SQLField(default_factory=datetime.utcnow, index=True)


class WaterLog(SQLModel, table=True):
    """Лог потребления воды"""
    id: Optional[int] = SQLField(default=None, primary_key=True)
    user_id: int = SQLField(index=True)
    drank_at: datetime = SQLField(index=True)
    ml: int


class WeightLog(SQLModel, table=True):
    """Измерение веса"""
    id: Optional[int] = SQLField(default=None, primary_key=True)
    user_id: int = SQLField(index=True)
    on_date: date = SQLField(index=True)
    kg: float


# ======================================================
#  Onboarding
# ======================================================

class OnboardingSubmission(SQLModel, table=True):
    """Хранит анкету онбординга (все поля с фронта) + рассчитанные макросы"""
    id: Optional[int] = SQLField(default=None, primary_key=True)
    user_id: int = SQLField(index=True)
    submitted_at: datetime = SQLField(default_factory=datetime.utcnow, index=True)

    # --- базовые анкетные поля ---
    gender: Optional[str] = None
    age: Optional[int] = None
    height_cm: Optional[int] = None
    weight_kg: Optional[float] = None

    goal_type: Optional[GoalType] = None
    target_weight_kg: Optional[float] = None

    counted_calories_before: Optional[bool] = None
    training_frequency: Optional[str] = None      # "none" | "1-2_per_week" | etc.
    steps_per_day: Optional[int] = None
    work_type: Optional[str] = None               # "sedentary" | "mixed" | "active"

    # --- промо / мета ---
    promo_code: Optional[str] = None
    app_version: Optional[str] = None
    device_type: Optional[str] = None
    locale: Optional[str] = None

    # --- макросы (из фронта) ---
    target_calories: Optional[int] = None
    protein_g: Optional[int] = None
    fat_g: Optional[int] = None
    carbs_g: Optional[int] = None
    fiber_g: Optional[int] = None
    sugar_g: Optional[int] = None

    # --- оригинальный payload ---
    data: dict = SQLField(sa_column=Column(SA_JSON))


# ======================================================
#  Meal Drafts (GPT suggestions)
# ======================================================

class MealDraft(SQLModel, table=True):
    """Черновик распознавания блюда (полный ответ GPT + видимые поля)

    Поле `gpt_result` хранит исходный JSON, возвращённый моделью (ожидаемый формат):
    {
      "meals": [
        {
          "title": "Dish name or product (if known)",
          "total_kcal": 0,
          "portion_weight_grams": 0,
          "portion_weight_oz": 0,
          "cooking_method": "steamed",
          "macros": {
            "protein_g": 0,
            "fat_g": 0,
            "carbohydrates_g": 0,
            "sugar_g": 0,
            "fiber_g": 0,
            "salt_g": 0,
            "water_ml": 0
          },
          "satiety_hours": 0,
          "ingredients_detected": [],
          "time_of_day": "morning",
          "date": "YYYY-MM-DD",
          "time": "HH:MM",
          "location": "home"
        }
      ],
      "total": {
        "total_kcal": 0,
        "portion_weight_grams": 0,
        "portion_weight_oz": 0,
        "satiety_hours": 0,
        "macros": {
          "protein_g": 0,
          "fat_g": 0,
          "carbohydrates_g": 0,
          "sugar_g": 0,
          "fiber_g": 0,
          "salt_g": 0,
          "water_ml": 0
        },
        "macro_distribution_percent_weight": {
          "protein_percent": 0,
          "fat_percent": 0,
          "carbohydrates_percent": 0
        },
        "macro_distribution_percent_kcal": {
          "protein_percent": 0,
          "fat_percent": 0,
          "carbohydrates_percent": 0
        }
      }
    }
    """
    id: Optional[int] = SQLField(default=None, primary_key=True)
    user_id: int = SQLField(index=True)
    created_at: datetime = SQLField(default_factory=datetime.utcnow, index=True)

    # Полный ответ от GPT (как есть)
    gpt_result: dict = SQLField(sa_column=Column(SA_JSON))

    # Короткая сводка для UI (например, name/kcal/БЖУ)
    visible_data: Optional[dict] = SQLField(default=None, sa_column=Column(SA_JSON))

    # Статус жизненного цикла драфта
    status: str = SQLField(default="pending", index=True)  # pending | confirmed | discarded