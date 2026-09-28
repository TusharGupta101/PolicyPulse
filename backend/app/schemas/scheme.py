from datetime import datetime
from typing import List, Optional, Any
from pydantic import BaseModel
from app.schemas.rule import RuleResponse

class SchemeBase(BaseModel):
    code: str
    name: str
    description: str
    category: str
    target_users: str
    state_applicability: str = "All India"
    benefit_type: str
    benefit_amount: float = 0.0
    benefit_description: str
    required_documents: List[str] = []
    application_steps: List[str] = []
    official_source_url: Optional[str] = None
    application_url: Optional[str] = None
    is_active: bool = True

class SchemeResponse(SchemeBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class SchemeDetailResponse(SchemeResponse):
    rules: List[RuleResponse] = []

    class Config:
        from_attributes = True
