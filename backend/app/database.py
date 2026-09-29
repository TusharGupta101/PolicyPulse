import os
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import settings

def normalize_database_url(url: str) -> str:
    """
    Ensure the connection string uses a supported driver.
    Hosted MySQL services frequently provide `mysql://...` which defaults
    to MySQLdb. Since PyMySQL is installed, rewrite to `mysql+pymysql://`.
    """
    if not url:
        return "sqlite:///./financial_policy.db"
    clean_url = url.strip()
    if clean_url.startswith("mysql://"):
        return clean_url.replace("mysql://", "mysql+pymysql://", 1)
    if clean_url.startswith("mysql2://"):
        return clean_url.replace("mysql2://", "mysql+pymysql://", 1)
    if clean_url.startswith("postgres://"):
        return clean_url.replace("postgres://", "postgresql+psycopg2://", 1)
    return clean_url

db_url = normalize_database_url(settings.DATABASE_URL)
engine_kwargs = {}

if db_url.startswith("sqlite"):
    engine_kwargs["connect_args"] = {"check_same_thread": False}
elif "mysql" in db_url:
    # Production settings for hosted MySQL (Aiven, PlanetScale, AWS RDS, Render)
    engine_kwargs["pool_pre_ping"] = True
    engine_kwargs["pool_recycle"] = 300
    engine_kwargs["pool_size"] = 10
    engine_kwargs["max_overflow"] = 20
    engine_kwargs["pool_timeout"] = 30

engine = create_engine(db_url, **engine_kwargs)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
