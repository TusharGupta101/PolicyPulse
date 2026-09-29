import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.config import settings
from app.database import engine, Base, get_db
import app.models  # Ensure all SQLAlchemy models are registered
from app.api import auth, profile, schemes, eligibility, documents, applications, ai

# Safe initial metadata creation (ensures sync test runners without lifespan get schemas)
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"Deferred table initialization: {e}")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Ensure database tables exist
    try:
        Base.metadata.create_all(bind=engine)
    except Exception as e:
        print(f"Startup table creation warning: {e}")

    # Ensure seed data exists
    try:
        from seed.seed_data import run_seed
        run_seed()
    except Exception as e:
        print(f"Seed initialization notice: {e}")

    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="""
    API for the Financial Policy Discovery & Eligibility Assistant.
    Provides deterministic rule evaluation, document processing, RAG explainability, 
    and citizen scheme tracking.
    """,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_origin_regex=r"https://.*\.netlify\.app",
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
)

# API Routers
app.include_router(auth.router, prefix=settings.API_V1_STR)
app.include_router(profile.router, prefix=settings.API_V1_STR)
app.include_router(schemes.router, prefix=settings.API_V1_STR)
app.include_router(eligibility.router, prefix=settings.API_V1_STR)
app.include_router(documents.router, prefix=settings.API_V1_STR)
app.include_router(applications.router, prefix=settings.API_V1_STR)
app.include_router(ai.router, prefix=settings.API_V1_STR)

@app.get("/health", tags=["System"])
@app.get("/api/health", tags=["System"])
def health_check(db: Session = Depends(get_db)):
    db_status = "connected"
    try:
        db.execute(text("SELECT 1"))
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"

    return {
        "status": "healthy" if db_status == "connected" else "degraded",
        "project": settings.PROJECT_NAME,
        "ai_mode": settings.AI_MODE,
        "database": db_status
    }

@app.get("/", tags=["System"])
def root():
    return {
        "message": "Welcome to PolicyPulse API",
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=False)
