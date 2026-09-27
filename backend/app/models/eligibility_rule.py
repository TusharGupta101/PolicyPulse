from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class EligibilityRule(Base):
    __tablename__ = "eligibility_rules"

    id = Column(Integer, primary_key=True, index=True)
    scheme_id = Column(Integer, ForeignKey("schemes.id", ondelete="CASCADE"), nullable=False)
    field = Column(String(100), nullable=False)  # annual_income, age, state, occupation, caste_category, land_ownership_acres
    operator = Column(String(20), nullable=False)  # ==, !=, >, <, >=, <=, IN, NOT_IN
    value = Column(String(255), nullable=False)  # stored as string/JSON-str for comparison
    value_type = Column(String(50), default="string")  # number, boolean, string, list
    description = Column(Text, nullable=False)
    source_section = Column(String(100), nullable=True)  # "Section 4.2", "Paragraph 1b"
    is_mandatory = Column(Boolean, default=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)

    scheme = relationship("Scheme", back_populates="rules")
