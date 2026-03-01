import firebase_admin
from firebase_admin import credentials, firestore
import os
from datetime import datetime

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
SERVICE_ACCOUNT = os.path.join(BASE_DIR, "config", "firebase-service-account.json")

if not firebase_admin._apps:
    cred = credentials.Certificate(SERVICE_ACCOUNT)
    firebase_admin.initialize_app(cred)

db = firestore.client()


# Save Strava synced activity
def save_strava_activity(user_id: str, activity: dict):
    activity_id = activity["activity_id"]

    doc_ref = db.collection("strava_activities").document(activity_id)
    doc = doc_ref.get()

    if doc.exists:
        return False  # duplicate

    doc_ref.set({
        "user_id": user_id,
        **activity,
        "timestamp": datetime.utcnow()
    })

    return True 


# Leaderboard
def get_leaderboard():
    docs = db.collection("users") \
        .order_by("score", direction=firestore.Query.DESCENDING) \
        .limit(50) \
        .stream()

    leaderboard = []
    for doc in docs:
        data = doc.to_dict()
        leaderboard.append({
            "user_id": doc.id,
            "score": data.get("score", 0)
        })

    return leaderboard


# Score calculation
def calculate_score(activity: dict):
    steps = activity.get("steps", 0)
    calories = activity.get("calories", 0)

    score = (steps * 0.05) + (calories * 0.1)
    return round(score, 2)


# Update user score (optimized with Firestore increment)
def update_user_score(user_id: str, score: float):
    user_ref = db.collection("users").document(user_id)

    user_ref.set({
        "user_id": user_id,
        "score": firestore.Increment(score)
    }, merge=True)


# Save normal activity
def log_activity(user_id: str, activity: dict):
    steps = activity.get("steps", 0)
    calories = activity.get("calories", 0)

    score = calculate_score(activity)

    db.collection("activities").add({
        "user_id": user_id,
        "steps": steps,
        "calories": calories,
        "score": score,
        "timestamp": datetime.utcnow()
    })

    update_user_score(user_id, score)