from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database import Base

class EligibilityResult(Base):
    __tablename__ = "eligibility_results"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    scheme_id = Column(Integer, ForeignKey("schemes.id", ondelete="CASCADE"), nullable=False)
    status = Column(String(50), nullable=False)  # ELIGIBLE, INELIGIBLE, POTENTIALLY_ELIGIBLE, INSUFFICIENT_INFORMATION
    estimated_benefit = Column(Float, default=0.0)
    passed_criteria = Column(JSON, default=list)
    failed_criteria = Column(JSON, default=list)
    missing_information = Column(JSON, default=list)
    explanation = Column(Text, nullable=False)
    source_reference = Column(String(255), nullable=True)
    checked_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="eligibility_results")
    scheme = relationship("Scheme", back_populates="eligibility_results")
