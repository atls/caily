from datetime import date, datetime, time
from typing import Optional, Dict, Any, List
import os

from fastapi import APIRouter, Query
from sqlmodel import Session, select, create_engine

from .models import (
    User, Goal, GoalType, MealLog, WaterLog, WeightLog, OnboardingSubmission, SQLModel
)
from .schemas import (
    DashboardResponse, Targets, MealItem, WaterItem, WeightBlock, Totals,
    OnboardingSubmitRequest, OnboardingSubmitResponse
)

router = APIRouter()

# ensure ./data exists
os.makedirs("data", exist_ok=True)
engine = create_engine("sqlite:///./data/calorie_tracker.db", echo=False)


# ======================================================
#  DB seed
# ======================================================

def init_db_with_seed() -> None:
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        if session.exec(select(User).where(User.id == 1)).first():
            return

        user = User(id=1, name="Anton", start_weight_kg=78.0, gender="male", height_cm=182, age=34)
        session.add(user)

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

        base_date = date.today()
        days = [base_date, base_date.replace(day=base_date.day - 1), base_date.replace(day=base_date.day - 2)]

        menus = {
            "breakfast": ("Овсянка с ягодами", 400, 18, 10, 60, 15, 8),
            "lunch": ("Курица с рисом и овощами", 600, 45, 15, 70, 6, 6),
            "dinner": ("Рыба с картофелем и салатом", 550, 40, 20, 50, 4, 7),
            "snack": ("Йогурт с орехами", 250, 12, 10, 20, 10, 2),
        }

        for i, d in enumerate(days):
            session.add(MealLog(user_id=1, eaten_at=datetime.combine(d, time(8, 0)), name=menus["breakfast"][0],
                                kcal=menus["breakfast"][1], protein_g=menus["breakfast"][2],
                                fat_g=menus["breakfast"][3], carbs_g=menus["breakfast"][4],
                                sugar_g=menus["breakfast"][5], fiber_g=menus["breakfast"][6]))
            session.add(MealLog(user_id=1, eaten_at=datetime.combine(d, time(13, 0)), name=menus["lunch"][0],
                                kcal=menus["lunch"][1], protein_g=menus["lunch"][2],
                                fat_g=menus["lunch"][3], carbs_g=menus["lunch"][4],
                                sugar_g=menus["lunch"][5], fiber_g=menus["lunch"][6]))
            session.add(MealLog(user_id=1, eaten_at=datetime.combine(d, time(19, 0)), name=menus["dinner"][0],
                                kcal=menus["dinner"][1], protein_g=menus["dinner"][2],
                                fat_g=menus["dinner"][3], carbs_g=menus["dinner"][4],
                                sugar_g=menus["dinner"][5], fiber_g=menus["dinner"][6]))
            session.add(MealLog(user_id=1, eaten_at=datetime.combine(d, time(16, 30)), name=menus["snack"][0],
                                kcal=menus["snack"][1], protein_g=menus["snack"][2],
                                fat_g=menus["snack"][3], carbs_g=menus["snack"][4],
                                sugar_g=menus["snack"][5], fiber_g=menus["snack"][6]))

            session.add(WaterLog(user_id=1, drank_at=datetime.combine(d, time(9, 30)), ml=400))
            session.add(WaterLog(user_id=1, drank_at=datetime.combine(d, time(14, 0)), ml=500))
            session.add(WaterLog(user_id=1, drank_at=datetime.combine(d, time(20, 0)), ml=300))
            session.add(WeightLog(user_id=1, on_date=d, kg=78.0 - i * 0.4))

        session.commit()


# ======================================================
#  Helpers
# ======================================================

def format_hhmm(dt: datetime) -> str:
    return dt.strftime("%H:%M")


def sum_macros(meals: List[MealLog]) -> Dict[str, float]:
    total = {"kcal": 0.0, "protein_g": 0.0, "fat_g": 0.0, "carbs_g": 0.0, "sugar_g": 0.0, "fiber_g": 0.0}
    for m in meals:
        total["kcal"] += float(m.kcal)
        total["protein_g"] += float(m.protein_g)
        total["fat_g"] += float(m.fat_g)
        total["carbs_g"] += float(m.carbs_g)
        total["sugar_g"] += float(m.sugar_g)
        total["fiber_g"] += float(m.fiber_g)
    return total


# ======================================================
#  Healthcheck
# ======================================================

@router.get("/healthz")
def healthz() -> Dict[str, Any]:
    """Simple health check endpoint."""
    return {"status": "ok"}


# ======================================================
#  Dashboard
# ======================================================

@router.get("/api/dashboard", response_model=DashboardResponse)
def get_dashboard(date_: Optional[date] = Query(default=None, alias="date")) -> DashboardResponse:
    """Get nutrition dashboard for a specific date."""
    target_date = date_ or date.today()
    with Session(engine) as session:
        goal_obj = session.exec(select(Goal).where(Goal.user_id == 1).order_by(Goal.created_at.desc()).limit(1)).first()
        targets = None
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
        meals = [MealItem(time=format_hhmm(m.eaten_at), name=m.name, kcal=m.kcal, protein_g=m.protein_g,
                          fat_g=m.fat_g, carbs_g=m.carbs_g, sugar_g=m.sugar_g, fiber_g=m.fiber_g) for m in meals_rows]

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


# ======================================================
#  Onboarding
# ======================================================

@router.post("/api/onboarding/submit", response_model=OnboardingSubmitResponse)
def submit_onboarding(payload: OnboardingSubmitRequest) -> OnboardingSubmitResponse:
    """
    Submit onboarding data (from front-end form).

    ### Example JSON body:
    ```json
    {
      "user_id": 1,
      "profile": {
        "gender": "male",
        "age": 34,
        "height_cm": 182,
        "weight_kg": 78
      },
      "goal": {
        "goal_type": "lose",
        "target_weight_kg": 72
      },
      "experience": {
        "counted_calories_before": true,
        "training_frequency": "3-5_per_week",
        "steps_per_day": 8000,
        "work_type": "sedentary"
      },
      "meta": {
        "promo_code": "FIT2025",
        "app_version": "1.0.0",
        "device_type": "ios",
        "locale": "ru"
      },
      "macros": {
        "target_calories": 2200,
        "protein_g": 150,
        "fat_g": 70,
        "carbs_g": 250,
        "fiber_g": 30,
        "sugar_g": 35
      }
    }
    ```

    ### Example cURL:
    ```bash
    curl -X POST http://127.0.0.1:8000/api/onboarding/submit \
      -H "Content-Type: application/json" \
      -d @onboarding.json
    ```
    """
    with Session(engine) as session:
        onboarding = OnboardingSubmission(
            user_id=payload.user_id,
            submitted_at=datetime.utcnow(),
            data=payload.dict(),
            gender=payload.profile.gender,
            age=payload.profile.age,
            height_cm=payload.profile.height_cm,
            weight_kg=payload.profile.weight_kg,
            goal_type=payload.goal.goal_type,
            target_weight_kg=payload.goal.target_weight_kg,
            counted_calories_before=payload.experience.counted_calories_before,
            training_frequency=payload.experience.training_frequency,
            steps_per_day=payload.experience.steps_per_day,
            work_type=payload.experience.work_type,
            promo_code=payload.meta.promo_code if payload.meta else None,
            app_version=payload.meta.app_version if payload.meta else None,
            device_type=payload.meta.device_type if payload.meta else None,
            locale=payload.meta.locale if payload.meta else None,
            target_calories=payload.macros.target_calories,
            protein_g=payload.macros.protein_g,
            fat_g=payload.macros.fat_g,
            carbs_g=payload.macros.carbs_g,
            fiber_g=payload.macros.fiber_g,
            sugar_g=payload.macros.sugar_g,
        )
        session.add(onboarding)
        session.commit()
        session.refresh(onboarding)

        goal = Goal(
            user_id=payload.user_id,
            goal_type=payload.goal.goal_type or GoalType.maintain,
            calories_kcal=payload.macros.target_calories or 0,
            protein_g=payload.macros.protein_g or 0,
            fat_g=payload.macros.fat_g or 0,
            carbs_g=payload.macros.carbs_g or 0,
            fiber_g=payload.macros.fiber_g or 0,
            sugar_g=payload.macros.sugar_g or 0,
        )
        session.add(goal)
        session.commit()
        session.refresh(goal)

        user = session.exec(select(User).where(User.id == payload.user_id)).first()
        if user:
            user.gender = payload.profile.gender
            user.age = payload.profile.age
            user.height_cm = payload.profile.height_cm
            user.current_weight_kg = payload.profile.weight_kg
            user.current_goal_id = goal.id
            user.updated_at = datetime.utcnow()
            session.add(user)
            session.commit()

        return OnboardingSubmitResponse(
            status="ok",
            user_id=payload.user_id,
            goal_id=goal.id,
            created_at=onboarding.submitted_at,
            message="Onboarding data saved successfully"
        )


# init DB on import
init_db_with_seed()