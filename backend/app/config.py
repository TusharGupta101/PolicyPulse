import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "PolicyPulse - Financial Policy Discovery & Eligibility Assistant"
    API_V1_STR: str = "/api"
    SECRET_KEY: str = os.getenv("JWT_SECRET", "super-secret-development-key-policy-assistant-2026-32chars")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # SQLite fallback by default, MySQL when specified
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./financial_policy.db")
    
    # AI & Vector DB configurations
    LLM_API_KEY: str = os.getenv("LLM_API_KEY", "")
    VECTOR_DATABASE_URL: str = os.getenv("VECTOR_DATABASE_URL", "")
    AI_MODE: str = os.getenv("AI_MODE", "deterministic_mock")
    
    UPLOAD_DIR: str = os.getenv("UPLOAD_DIR", "uploads")
    MAX_FILE_SIZE_MB: int = 10
    ALLOWED_EXTENSIONS: List[str] = [".pdf", ".png", ".jpg", ".jpeg"]
    
    # Frontend Deployment URL(s) - e.g. "https://your-app.netlify.app" or comma-separated
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "")

    # Base list of known origins (no wildcard * when credentials are true)
    CORS_ORIGINS: List[str] = [
        "https://teambroskis.netlify.app",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:4173",
        "http://127.0.0.1:4173",
    ]

    model_config = SettingsConfigDict(
        case_sensitive=True,
        extra="ignore",
        env_file=".env"
    )

    @property
    def allowed_origins(self) -> List[str]:
        origins = set(self.CORS_ORIGINS)
        if self.FRONTEND_URL:
            for item in self.FRONTEND_URL.split(","):
                clean = item.strip().rstrip("/")
                if clean:
                    origins.add(clean)
        # Ensure wildcard * is never present when allow_credentials=True
        origins.discard("*")
        return list(origins)

settings = Settings()
