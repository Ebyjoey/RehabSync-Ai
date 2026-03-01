from fastapi import APIRouter
from app.utils.firebase import db

router = APIRouter(prefix="/scoring", tags=["Scoring"])

def calculate_score(activity):
    steps = activity.get("steps", 0)
    calories = activity.get("calories", 0)

    score = (steps * 0.01) + (calories * 0.1)
    return round(score, 2)


@router.post("/calculate/{user_id}")
async def calculate_user_score(user_id: str):
    docs = db.collection("activities") \
        .where("user_id", "==", user_id) \
        .stream()

    total_score = 0

    for doc in docs:
        activity = doc.to_dict()
        total_score += calculate_score(activity)

    db.collection("users").document(user_id).set(
        {"score": total_score},
        merge=True
    )

    return {
        "user_id": user_id,
        "score": total_score
    }