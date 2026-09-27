from datetime import datetime
from typing import Optional
from pydantic import BaseModel
from app.schemas.scheme import SchemeResponse

class ApplicationCreate(BaseModel):
    scheme_id: int
    notes: Optional[str] = None

class ApplicationResponse(BaseModel):
    id: int
    user_id: int
    scheme_id: int
    application_reference_number: str
    status: str
    notes: Optional[str] = None
    submitted_at: datetime
    updated_at: datetime
    scheme: Optional[SchemeResponse] = None

    class Config:
        from_attributes = True
