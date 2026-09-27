from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    scheme_id = Column(Integer, ForeignKey("schemes.id", ondelete="CASCADE"), nullable=False)
    application_reference_number = Column(String(100), unique=True, index=True, nullable=False)
    status = Column(String(50), default="SUBMITTED")  # DRAFT, SUBMITTED, UNDER_REVIEW, APPROVED, REJECTED
    notes = Column(Text, nullable=True)
    submitted_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="applications")
    scheme = relationship("Scheme", back_populates="applications")
