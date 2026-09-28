import os
from typing import List
from pydantic_settings import BaseSettings

# Absolute path to backend directory
BACKEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEFAULT_DB_FILE = os.path.join(BACKEND_DIR, "financial_policy.db")


def resolve_database_url() -> str:
    url = os.getenv("DATABASE_URL")
    if not url:
        return f"sqlite:///{DEFAULT_DB_FILE.replace(os.sep, '/')}"
    if url.startswith("sqlite:///") and not url.startswith("sqlite:////") and not (len(url) > 11 and url[10] == ":"):
        rel_path = url.replace("sqlite:///", "")
        if rel_path.startswith("./") or rel_path.startswith(".\\"):
            rel_path = rel_path[2:]
        abs_path = os.path.abspath(os.path.join(BACKEND_DIR, rel_path))
        return f"sqlite:///{abs_path.replace(os.sep, '/')}"
    return url


def resolve_cors_origins() -> List[str]:
    default_origins = [
        "https://teambroskis.netlify.app",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ]
    env_origins = os.getenv("CORS_ORIGINS")
    if env_origins:
        parsed = [o.strip() for o in env_origins.split(",") if o.strip()]
        for o in default_origins:
            if o not in parsed:
                parsed.append(o)
        return parsed
    return default_origins


class Settings(BaseSettings):
    PROJECT_NAME: str = "PolicyPulse - Financial Policy Discovery & Eligibility Assistant"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = os.getenv("JWT_SECRET", "super-secret-development-key-policy-assistant-2026-32chars")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # SQLite fallback by default, MySQL when specified
    DATABASE_URL: str = resolve_database_url()
    
    # AI & Vector DB configurations
    LLM_API_KEY: str = os.getenv("LLM_API_KEY", "")
    VECTOR_DATABASE_URL: str = os.getenv("VECTOR_DATABASE_URL", "")
    AI_MODE: str = os.getenv("AI_MODE", "deterministic_mock")
    
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "uploads")
    MAX_FILE_SIZE_MB: int = 10
    ALLOWED_EXTENSIONS: List[str] = [".pdf", ".png", ".jpg", ".jpeg"]
    
    CORS_ORIGINS: List[str] = resolve_cors_origins()

    class Config:
        case_sensitive = True
        extra = "ignore"
        env_file = ".env"

settings = Settings()

