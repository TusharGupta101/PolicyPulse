from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database import Base

class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    
    age = Column(Integer, nullable=True)
    gender = Column(String(50), nullable=True)  # Male, Female, Other
    annual_income = Column(Float, nullable=True)
    state = Column(String(100), nullable=True)
    occupation = Column(String(100), nullable=True)  # Farmer, Student, Self-Employed, Salaried, Unemployed, Business, Artisan
    caste_category = Column(String(50), nullable=True)  # General, OBC, SC, ST, EWS
    disability_status = Column(Boolean, default=False)
    marital_status = Column(String(50), nullable=True)  # Single, Married, Widowed, Divorced
    land_ownership_acres = Column(Float, default=0.0)
    has_ration_card = Column(Boolean, default=False)
    has_bpl_card = Column(Boolean, default=False)
    is_student = Column(Boolean, default=False)
    is_senior_citizen = Column(Boolean, default=False)
    is_minority = Column(Boolean, default=False)
    extra_attributes = Column(JSON, default=dict)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="profile")
