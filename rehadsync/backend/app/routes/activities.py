from fastapi import APIRouter, Body
from app.utils.firebase import log_activity, db

router = APIRouter()

# Log activity
@router.post("/log/{user_id}")
async def log_user_activity(user_id: str, activity: dict = Body(...)):
    log_activity(user_id, activity)
    return {"status": "saved"}

# Get activity history
@router.get("/history/{user_id}")
async def get_user_activities(user_id: str):
    docs = db.collection("activities") \
        .where("user_id", "==", user_id) \
        .stream()

    activities = [doc.to_dict() for doc in docs]

    return {
        "user_id": user_id,
        "activities": activities
    }