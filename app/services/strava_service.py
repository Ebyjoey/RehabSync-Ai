import os
import requests
from fastapi import HTTPException
from app.utils.firebase import (
    save_strava_activity,
    calculate_score,
    update_user_score
)

STRAVA_API_URL = "https://www.strava.com/api/v3/athlete/activities"

STRAVA_CLIENT_ID = os.getenv("STRAVA_CLIENT_ID")
STRAVA_CLIENT_SECRET = os.getenv("STRAVA_CLIENT_SECRET")
STRAVA_REFRESH_TOKEN = os.getenv("STRAVA_REFRESH_TOKEN")


# ==========================
# GET ACCESS TOKEN
# ==========================
def get_access_token():
    response = requests.post(
        "https://www.strava.com/oauth/token",
        data={
            "client_id": STRAVA_CLIENT_ID,
            "client_secret": STRAVA_CLIENT_SECRET,
            "grant_type": "refresh_token",
            "refresh_token": STRAVA_REFRESH_TOKEN,
        },
    )

    if response.status_code != 200:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to fetch Strava access token: {response.text}"
        )

    return response.json()["access_token"]


# ==========================
# FETCH AND SYNC ACTIVITIES
# ==========================
def fetch_strava_activities(user_id: str):
    access_token = get_access_token()

    headers = {
        "Authorization": f"Bearer {access_token}"
    }

    response = requests.get(STRAVA_API_URL, headers=headers)

    if response.status_code != 200:
        raise HTTPException(
            status_code=400,
            detail=f"Failed to fetch activities: {response.text}"
        )

    activities = response.json()

    if not activities:
        return []

    saved_activities = []

    for activity in activities[:10]:
        distance = activity.get("distance", 0)
        moving_time = activity.get("moving_time", 0)

        distance_km = distance / 1000
        steps = int(distance_km * 1300)
        calories = int(moving_time * 0.1)

        activity_id = str(activity.get("id"))

        data = {
            "activity_id": activity_id,
            "type": activity.get("type"),
            "distance_km": distance_km,
            "moving_time": moving_time,
            "steps": steps,
            "calories": calories
        }

        # Save activity (returns True if new, False if duplicate)
        is_new = save_strava_activity(user_id, data)

        # Only update score if activity is new
        if is_new:
            score = calculate_score(data)
            update_user_score(user_id, score)

        saved_activities.append(data)

    return saved_activities