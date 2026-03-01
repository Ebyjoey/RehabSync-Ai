import os
import json
from datetime import datetime
from typing import Any, Dict, List

import firebase_admin
from firebase_admin import credentials, firestore
from google.cloud.firestore_v1.client import Client


# -----------------------------
# Initialize Firebase
# -----------------------------

firebase_key = os.getenv("FIREBASE_KEY")

if not firebase_key:
    raise RuntimeError("FIREBASE_KEY environment variable is not set")

try:
    firebase_dict = json.loads(firebase_key)
except json.JSONDecodeError:
    raise RuntimeError("FIREBASE_KEY is not valid JSON")

if not firebase_admin._apps:
    cred = credentials.Certificate(firebase_dict)
    firebase_admin.initialize_app(cred)

db: Client = firestore.client()


# -----------------------------
# Strava Activity
# -----------------------------

def save_strava_activity(user_id: str, activity: Dict[str, Any]) -> bool:
    activity_id = activity.get("activity_id")

    if not activity_id:
        raise ValueError("Activity must contain activity_id")

    doc_ref = db.collection("strava_activities").document(activity_id)
    doc = doc_ref.get()

    if doc.exists:
        return False  # duplicate

    doc_ref.set({
        "user_id": user_id,
        **activity,
        "timestamp": datetime.utcnow(),
    })

    return True


# -----------------------------
# Leaderboard
# -----------------------------

def get_leaderboard() -> List[Dict[str, Any]]:
    docs = (
        db.collection("users")
        .order_by("score", direction=firestore.Query.DESCENDING)
        .limit(50)
        .stream()
    )

    leaderboard = []

    for doc in docs:
        data = doc.to_dict() or {}
        leaderboard.append({
            "user_id": doc.id,
            "score": data.get("score", 0),
        })

    return leaderboard


# -----------------------------
# Score Calculation
# -----------------------------

def calculate_score(activity: Dict[str, Any]) -> float:
    steps = activity.get("steps", 0)
    calories = activity.get("calories", 0)

    score = (steps * 0.05) + (calories * 0.1)
    return round(score, 2)


# -----------------------------
# Update User Score
# -----------------------------

def update_user_score(user_id: str, score: float) -> None:
    user_ref = db.collection("users").document(user_id)

    user_ref.set(
        {
            "user_id": user_id,
            "score": firestore.Increment(score),
        },
        merge=True,
    )


# -----------------------------
# Log Activity
# -----------------------------

def log_activity(user_id: str, activity: Dict[str, Any]) -> None:
    score = calculate_score(activity)

    db.collection("activities").add(
        {
            "user_id": user_id,
            "steps": activity.get("steps", 0),
            "calories": activity.get("calories", 0),
            "score": score,
            "timestamp": datetime.utcnow(),
        }
    )

    update_user_score(user_id, score)