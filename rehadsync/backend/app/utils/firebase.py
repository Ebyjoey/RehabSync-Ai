import os
import json
from datetime import datetime
from typing import Any, Dict, List

import firebase_admin
from firebase_admin import credentials, firestore

from google.cloud.firestore_v1.client import Client
from google.cloud.firestore_v1.base_document import (
    BaseDocumentReference,
    DocumentSnapshot,
)
from google.cloud.firestore_v1.stream_generator import StreamGenerator


# Load Firebase credentials from Railway environment variable
firebase_key: str | None = os.getenv("FIREBASE_KEY")

if not firebase_key:
    raise ValueError("FIREBASE_KEY environment variable not set")

if not firebase_admin._apps:
    cred = credentials.Certificate(json.loads(firebase_key))
    firebase_admin.initialize_app(cred)

# Firestore client with explicit type for static analysis
db: Client = firestore.client()


# Save Strava-synced activity

def save_strava_activity(user_id: str, activity: Dict[str, Any]) -> bool:
    """Store a Strava activity for a user.

    Returns True if the activity was saved, False if it already existed.
    """
    activity_id = activity["activity_id"]

    doc_ref: BaseDocumentReference = db.collection("strava_activities").document(activity_id)
    doc: DocumentSnapshot = doc_ref.get()

    if doc.exists:
        # avoid duplicates
        return False

    doc_ref.set({
        "user_id": user_id,
        **activity,
        "timestamp": datetime.utcnow(),
    })

    return True


# Leaderboard

def get_leaderboard() -> List[Dict[str, Any]]:
    """Return top 50 users ordered by score."""
    docs: StreamGenerator[DocumentSnapshot] = (
        db.collection("users")
        .order_by("score", direction=firestore.Query.DESCENDING)
        .limit(50)
        .stream()
    )

    leaderboard: List[Dict[str, Any]] = []
    for doc in docs:
        data = doc.to_dict() or {}
        leaderboard.append({
            "user_id": doc.id,
            "score": data.get("score", 0),
        })

    return leaderboard


# Score calculation
def calculate_score(activity: Dict[str, Any]) -> float:
    """Compute score based on steps and calories."""
    steps = activity.get("steps", 0)
    calories = activity.get("calories", 0)

    score = (steps * 0.05) + (calories * 0.1)
    return round(score, 2)


# Update user score (optimized with Firestore increment)
def update_user_score(user_id: str, score: float) -> None:
    """Increment a user's leaderboard score by ``score``."""
    user_ref: BaseDocumentReference = db.collection("users").document(user_id)

    user_ref.set(
        {
            "user_id": user_id,
            "score": firestore.Increment(score),
        },
        merge=True,
    )


# Save normal activity
def log_activity(user_id: str, activity: Dict[str, Any]) -> None:
    """Record a generic activity and update the user's score."""
    steps = activity.get("steps", 0)
    calories = activity.get("calories", 0)

    score = calculate_score(activity)

    db.collection("activities").add(
        {
            "user_id": user_id,
            "steps": steps,
            "calories": calories,
            "score": score,
            "timestamp": datetime.utcnow(),
        }
    )

    update_user_score(user_id, score)