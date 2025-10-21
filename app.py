from datetime import date, datetime, time
from typing import List, Optional, Dict, Any
from enum import Enum
import os

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from sqlmodel import SQLModel, Field as SQLField, Session, create_engine, select


# -----------------------------
# Database models (SQLModel)
# -----------------------------

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


# -----------------------------
# Pydantic response models
# -----------------------------

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


# -----------------------------
# App init
# -----------------------------

app = FastAPI(title="Calorie Tracker Backend", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ensure ./data directory exists
os.makedirs("data", exist_ok=True)

engine = create_engine("sqlite:///./data/calorie_tracker.db", echo=False)


def init_db_with_seed() -> None:
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        user_exists = session.exec(select(User).where(User.id == 1)).first()
        if user_exists:
            return

        # Пользователь
        user = User(id=1, name="Anton", start_weight_kg=78.0)
        session.add(user)

        # Цель
        goal = Goal(
            user_id=1,
            goal_type=GoalType.lose,
            calories_kcal=2200,
            protein_g=150,
            fat_g=70,
            carbs_g=250,
            sugar_g=35,
            fiber_g=30,
        )
        session.add(goal)

        # Сценарий: три дня
        base_date = date.today()
        days = [base_date, base_date.replace(day=base_date.day - 1), base_date.replace(day=base_date.day - 2)]

        # Примерные меню
        menus = {
            "breakfast": ("Овсянка с ягодами", 400, 18, 10, 60, 15, 8),
            "lunch": ("Курица с рисом и овощами", 600, 45, 15, 70, 6, 6),
            "dinner": ("Рыба с картофелем и салатом", 550, 40, 20, 50, 4, 7),
            "snack": ("Йогурт с орехами", 250, 12, 10, 20, 10, 2),
        }

        for i, d in enumerate(days):
            # Приёмы пищи
            session.add(MealLog(
                user_id=1, eaten_at=datetime.combine(d, time(8, 0)),
                name=menus["breakfast"][0],
                kcal=menus["breakfast"][1], protein_g=menus["breakfast"][2],
                fat_g=menus["breakfast"][3], carbs_g=menus["breakfast"][4],
                sugar_g=menus["breakfast"][5], fiber_g=menus["breakfast"][6],
            ))
            session.add(MealLog(
                user_id=1, eaten_at=datetime.combine(d, time(13, 0)),
                name=menus["lunch"][0],
                kcal=menus["lunch"][1], protein_g=menus["lunch"][2],
                fat_g=menus["lunch"][3], carbs_g=menus["lunch"][4],
                sugar_g=menus["lunch"][5], fiber_g=menus["lunch"][6],
            ))
            session.add(MealLog(
                user_id=1, eaten_at=datetime.combine(d, time(19, 0)),
                name=menus["dinner"][0],
                kcal=menus["dinner"][1], protein_g=menus["dinner"][2],
                fat_g=menus["dinner"][3], carbs_g=menus["dinner"][4],
                sugar_g=menus["dinner"][5], fiber_g=menus["dinner"][6],
            ))
            session.add(MealLog(
                user_id=1, eaten_at=datetime.combine(d, time(16, 30)),
                name=menus["snack"][0],
                kcal=menus["snack"][1], protein_g=menus["snack"][2],
                fat_g=menus["snack"][3], carbs_g=menus["snack"][4],
                sugar_g=menus["snack"][5], fiber_g=menus["snack"][6],
            ))

            # Вода (2-3 раза)
            session.add(WaterLog(user_id=1, drank_at=datetime.combine(d, time(9, 30)), ml=400))
            session.add(WaterLog(user_id=1, drank_at=datetime.combine(d, time(14, 0)), ml=500))
            session.add(WaterLog(user_id=1, drank_at=datetime.combine(d, time(20, 0)), ml=300))

            # Вес (чуть меньше каждый день)
            session.add(WeightLog(user_id=1, on_date=d, kg=78.0 - i * 0.4))

        session.commit()

init_db_with_seed()


# -----------------------------
# Helpers
# -----------------------------

def format_hhmm(dt: datetime) -> str:
    return dt.strftime("%H:%M")


def sum_macros(meals: List[MealLog]) -> Dict[str, float]:
    total = {"kcal": 0.0, "protein_g": 0.0, "fat_g": 0.0,
             "carbs_g": 0.0, "sugar_g": 0.0, "fiber_g": 0.0}
    for m in meals:
        total["kcal"] += float(m.kcal)
        total["protein_g"] += float(m.protein_g)
        total["fat_g"] += float(m.fat_g)
        total["carbs_g"] += float(m.carbs_g)
        total["sugar_g"] += float(m.sugar_g)
        total["fiber_g"] += float(m.fiber_g)
    return total


# -----------------------------
# Endpoints
# -----------------------------

@app.get("/healthz")
def healthz() -> Dict[str, Any]:
    return {"status": "ok"}


@app.get("/api/dashboard", response_model=DashboardResponse)
def get_dashboard(date_: Optional[date] = Query(default=None, alias="date")) -> DashboardResponse:
    target_date = date_ or date.today()

    with Session(engine) as session:
        goal_obj = session.exec(
            select(Goal).where(Goal.user_id == 1).order_by(Goal.created_at.desc()).limit(1)
        ).first()

        targets: Optional[Targets] = None
        if goal_obj:
            targets = Targets(
                goal=goal_obj.goal_type,
                calories=goal_obj.calories_kcal,
                protein_g=goal_obj.protein_g,
                fat_g=goal_obj.fat_g,
                carbs_g=goal_obj.carbs_g,
                sugar_g=goal_obj.sugar_g,
                fiber_g=goal_obj.fiber_g,
            )

        meals_rows = list(session.exec(
            select(MealLog)
            .where((MealLog.user_id == 1) &
                   (MealLog.eaten_at >= datetime.combine(target_date, time.min)) &
                   (MealLog.eaten_at <= datetime.combine(target_date, time.max)))
            .order_by(MealLog.eaten_at.asc())
        ))
        meals = [MealItem(
            time=format_hhmm(m.eaten_at),
            name=m.name,
            kcal=m.kcal,
            protein_g=m.protein_g,
            fat_g=m.fat_g,
            carbs_g=m.carbs_g,
            sugar_g=m.sugar_g,
            fiber_g=m.fiber_g,
        ) for m in meals_rows]

        water_rows = list(session.exec(
            select(WaterLog)
            .where((WaterLog.user_id == 1) &
                   (WaterLog.drank_at >= datetime.combine(target_date, time.min)) &
                   (WaterLog.drank_at <= datetime.combine(target_date, time.max)))
            .order_by(WaterLog.drank_at.asc())
        ))
        water = [WaterItem(time=format_hhmm(w.drank_at), ml=w.ml) for w in water_rows]

        user = session.exec(select(User).where(User.id == 1)).first()
        start_weight = user.start_weight_kg if user else 0.0
        w_row = session.exec(select(WeightLog).where(
            (WeightLog.user_id == 1) & (WeightLog.on_date == target_date)
        )).first()
        weight_block = WeightBlock(start_kg=start_weight, today_kg=w_row.kg if w_row else None)

        macros_sum = sum_macros(meals_rows)
        totals = Totals(
            kcal=round(macros_sum["kcal"], 1),
            protein_g=round(macros_sum["protein_g"], 1),
            fat_g=round(macros_sum["fat_g"], 1),
            carbs_g=round(macros_sum["carbs_g"], 1),
            sugar_g=round(macros_sum["sugar_g"], 1),
            fiber_g=round(macros_sum["fiber_g"], 1),
            water_ml=sum(w.ml for w in water_rows),
        )

        return DashboardResponse(
            date=target_date,
            targets=targets,
            meals=meals,
            water=water,
            weight=weight_block,
            totals=totals,
        )