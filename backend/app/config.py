import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "PolicyPulse - Financial Policy Discovery & Eligibility Assistant"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = os.getenv("JWT_SECRET", "super-secret-development-key-policy-assistant-2026-32chars")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # SQLite fallback by default, PostgreSQL when specified
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./financial_policy.db")
    
    # AI & Vector DB configurations
    LLM_API_KEY: str = os.getenv("LLM_API_KEY", "")
    VECTOR_DATABASE_URL: str = os.getenv("VECTOR_DATABASE_URL", "")
    AI_MODE: str = os.getenv("AI_MODE", "deterministic_mock")
    
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "uploads")
    MAX_FILE_SIZE_MB: int = 10
    ALLOWED_EXTENSIONS: List[str] = [".pdf", ".png", ".jpg", ".jpeg"]
    
    CORS_ORIGINS: List[str] = [
        "*",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]

    class Config:
        case_sensitive = True
        extra = "ignore"
        env_file = ".env"

settings = Settings()
