from fastapi import APIRouter
from app.utils.firebase import db

router = APIRouter()

@router.get("/{user_id}")
async def get_user_stats(user_id: str):
    user_ref = db.collection("users").document(user_id)
    doc = user_ref.get()

    if doc.exists:
        return {
            "user_id": user_id,
            "score": doc.to_dict().get("score", 0)
        }

    return {"message": "User not found"}