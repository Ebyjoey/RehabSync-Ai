from fastapi import APIRouter, Request
from app.services.strava_service import fetch_strava_activities
import requests
import os

router = APIRouter()

STRAVA_CLIENT_ID = os.getenv("STRAVA_CLIENT_ID")
STRAVA_CLIENT_SECRET = os.getenv("STRAVA_CLIENT_SECRET")

# =============================
# STRAVA OAUTH CALLBACK
# Final path becomes: /strava/callback
# =============================
@router.get("/callback")
async def strava_callback(request: Request):
    code = request.query_params.get("code")

    token_response = requests.post(
        "https://www.strava.com/oauth/token",
        data={
            "client_id": STRAVA_CLIENT_ID,
            "client_secret": STRAVA_CLIENT_SECRET,
            "code": code,
            "grant_type": "authorization_code",
        },
    )

    return token_response.json()


# =============================
# SYNC STRAVA ACTIVITIES
# Final path becomes: /strava/sync/{user_id}
# =============================
@router.get("/sync/{user_id}")
async def sync_strava(user_id: str):
    activities = fetch_strava_activities(user_id)

    return {
        "message": "Strava activities synced",
        "count": len(activities) if isinstance(activities, list) else 0,
        "activities": activities
    }