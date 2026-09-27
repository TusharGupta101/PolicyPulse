from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database import Base

class Document(Base):
    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    original_filename = Column(String(255), nullable=False)
    stored_filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_type = Column(String(100), nullable=False)
    document_type = Column(String(100), default="Other")  # Aadhaar, Income Certificate, Caste Certificate, Land Record, Bank Passbook, Ration Card, Other
    file_size = Column(Integer, nullable=False)
    processing_status = Column(String(50), default="PENDING")  # PENDING, PROCESSED, FAILED
    extracted_text = Column(Text, nullable=True)
    extracted_metadata = Column(JSON, default=dict)
    upload_time = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="documents")
