from typing import Optional
from pydantic import BaseModel, ConfigDict

class RuleBase(BaseModel):
    field: str
    operator: str
    value: str
    value_type: str = "string"
    description: str
    source_section: Optional[str] = None
    is_mandatory: bool = True

class RuleResponse(RuleBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    scheme_id: int
