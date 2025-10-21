from datetime import date
from typing import List, Optional
from pydantic import BaseModel

from .models import GoalType


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