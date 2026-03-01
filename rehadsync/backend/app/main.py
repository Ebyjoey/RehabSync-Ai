import os
from dotenv import load_dotenv
from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")

# Import routers
from app.routes import users, activities, strava, scoring, leaderboard, analytics

# Create FastAPI app
app = FastAPI(title="RehadSync API", version="1.0.0")

# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(users.router)
app.include_router(strava.router)
app.include_router(scoring.router)
app.include_router(activities.router)
app.include_router(leaderboard.router)
app.include_router(analytics.router)

@app.get("/")
async def root():
    return {"message": "RehadSync Backend Running"}
