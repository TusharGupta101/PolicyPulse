from typing import List, Optional, Dict, Any
from pydantic import BaseModel

class AIExplainRequest(BaseModel):
    scheme_id: int
    result_id: Optional[int] = None

class AIExplainResponse(BaseModel):
    scheme_id: int
    scheme_name: str
    status: str
    explanation: str
    citations: List[str]
    suggested_actions: List[str]

class AIRuleRecommendRequest(BaseModel):
    category: Optional[str] = None
    target_users: Optional[str] = None

class AIRuleRecommendResponse(BaseModel):
    recommended_schemes: List[Dict[str, Any]]
    confidence_rationale: str
