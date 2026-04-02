# **RehabSync AI**

Live Demo: https://rehabtrack.vercel.app/

Cloud-deployed rehabilitation analytics backend built with FastAPI. RehabSync AI tracks user performance, integrates third-party APIs, and supports structured analytics for digital health applications.

---

## 🏗 Architecture Overview

- **Backend Framework:** FastAPI  
- **Authentication & Data Storage:** Firebase  
- **External Integration:** Strava API  
- **Containerization:** Docker  
- **Deployment:** Cloud-hosted (Render / AWS)  

**Modular folder structure:**
```bash
app/
├── routers/ # API endpoints
├── services/ # Business logic
├── models/ # Data models
├── utils/ # External integrations / helpers
└── main.py # Application entry point
```

Separation of concerns ensures maintainable, production-ready code.

---

## 🔍 Core Features

- User management & authentication  
- Activity ingestion via Strava integration  
- Performance scoring system  
- Leaderboard functionality  
- Analytics endpoints  
- RESTful API design

---

## 🛠 Technical Highlights

- Production-ready FastAPI structure  
- Dockerized application for portability  
- Environment variable configuration  
- Modular service-layer design  
- Auto-generated OpenAPI documentation  
- Cloud deployment configuration  

---

## 📦 Local Setup

Clone the repo and install dependencies:

```bash
git clone https://github.com/Ebyjoey/RehabSync-Ai.git
cd RehabSync-Ai
pip install -r requirements.txt
uvicorn app.main:app --reload
```

👤 Author

Aby Joseph
GitHub: https://github.com/Ebyjoey
