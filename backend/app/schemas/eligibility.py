from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, ConfigDict
from app.schemas.scheme import SchemeResponse

class RuleEvaluationDetail(BaseModel):
    field: str
    operator: str
    expected_value: Any
    actual_value: Any
    description: str
    source_section: Optional[str] = None
    passed: bool
    missing: bool = False
    reason: str

class EligibilityCheckRequest(BaseModel):
    scheme_id: Optional[int] = None  # None checks all schemes

class EligibilityResultResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    scheme_id: int
    status: str  # ELIGIBLE, INELIGIBLE, POTENTIALLY_ELIGIBLE, INSUFFICIENT_INFORMATION
    estimated_benefit: float
    passed_criteria: List[RuleEvaluationDetail] = []
    failed_criteria: List[RuleEvaluationDetail] = []
    missing_information: List[RuleEvaluationDetail] = []
    explanation: str
    source_reference: Optional[str] = None
    checked_at: datetime
    scheme: Optional[SchemeResponse] = None
