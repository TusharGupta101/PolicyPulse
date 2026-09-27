from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Float, Boolean, DateTime, JSON
from sqlalchemy.orm import relationship
from app.database import Base

class Scheme(Base):
    __tablename__ = "schemes"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(100), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(100), index=True, nullable=False)  # Agriculture, Housing, Healthcare, Business, Education, Social Security
    target_users = Column(String(255), nullable=False)
    state_applicability = Column(String(100), default="All India")
    benefit_type = Column(String(100), nullable=False)  # Direct Cash Transfer, Subsidy, Insurance, Loan, Scholarship
    benefit_amount = Column(Float, default=0.0)
    benefit_description = Column(Text, nullable=False)
    required_documents = Column(JSON, default=list)
    application_steps = Column(JSON, default=list)
    official_source_url = Column(String(500), nullable=True)
    application_url = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    rules = relationship("EligibilityRule", back_populates="scheme", cascade="all, delete-orphan")
    eligibility_results = relationship("EligibilityResult", back_populates="scheme", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="scheme", cascade="all, delete-orphan")
