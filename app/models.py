from datetime import date, datetime
from enum import Enum
from typing import Optional

from sqlmodel import SQLModel, Field as SQLField


class User(SQLModel, table=True):
    id: Optional[int] = SQLField(default=None, primary_key=True)
    name: str
    start_weight_kg: float = 0.0


class GoalType(str, Enum):
    maintain = "maintain"
    lose = "lose"
    gain = "gain"


class Goal(SQLModel, table=True):
    id: Optional[int] = SQLField(default=None, primary_key=True)
    user_id: int = SQLField(index=True)
    created_at: datetime = SQLField(default_factory=datetime.utcnow, index=True)
    goal_type: GoalType
    calories_kcal: int
    protein_g: int
    fat_g: int
    carbs_g: int
    sugar_g: int
    fiber_g: int


class MealLog(SQLModel, table=True):
    id: Optional[int] = SQLField(default=None, primary_key=True)
    user_id: int = SQLField(index=True)
    eaten_at: datetime = SQLField(index=True)
    name: str
    kcal: float
    protein_g: float
    fat_g: float
    carbs_g: float
    sugar_g: float
    fiber_g: float


class WaterLog(SQLModel, table=True):
    id: Optional[int] = SQLField(default=None, primary_key=True)
    user_id: int = SQLField(index=True)
    drank_at: datetime = SQLField(index=True)
    ml: int


class WeightLog(SQLModel, table=True):
    id: Optional[int] = SQLField(default=None, primary_key=True)
    user_id: int = SQLField(index=True)
    on_date: date = SQLField(index=True)
    kg: float