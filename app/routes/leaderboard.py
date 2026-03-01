from fastapi import APIRouter
from app.utils.firebase import db

router = APIRouter(prefix="/leaderboard", tags=["Leaderboard"])

@router.get("/")
async def get_leaderboard():
    docs = db.collection("scores").stream()

    leaderboard = []
    for doc in docs:
        data = doc.to_dict()
        leaderboard.append({
            "user_id": data.get("user_id"),
            "score": data.get("score")
        })

    return {"leaderboard": leaderboard}