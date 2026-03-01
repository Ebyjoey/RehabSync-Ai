from fastapi import APIRouter, HTTPException
from app.utils.firebase import db

router = APIRouter()

@router.get("/{user_id}")
def get_user_analytics(user_id: str):
    try:
        activities_ref = db.collection("strava_activities") \
            .where("user_id", "==", user_id) \
            .stream()

        total_distance = 0
        total_calories = 0
        total_steps = 0
        total_workouts = 0

        for doc in activities_ref:
            data = doc.to_dict()
            total_distance += data.get("distance_km", 0)
            total_calories += data.get("calories", 0)
            total_steps += data.get("steps", 0)
            total_workouts += 1

        if total_workouts == 0:
            return {
                "message": "No activity data found",
                "user_id": user_id
            }

        return {
            "user_id": user_id,
            "total_workouts": total_workouts,
            "total_distance_km": round(total_distance, 2),
            "total_calories": total_calories,
            "total_steps": total_steps,
            "average_calories_per_workout": round(total_calories / total_workouts, 2)
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))