from typing import Optional
from pydantic import BaseModel

class RuleBase(BaseModel):
    field: str
    operator: str
    value: str
    value_type: str = "string"
    description: str
    source_section: Optional[str] = None
    is_mandatory: bool = True

class RuleResponse(RuleBase):
    id: int
    scheme_id: int

    class Config:
        from_attributes = True
