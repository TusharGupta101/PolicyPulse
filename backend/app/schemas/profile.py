from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel

class ProfileBase(BaseModel):
    age: Optional[int] = None
    gender: Optional[str] = None
    annual_income: Optional[float] = None
    state: Optional[str] = None
    occupation: Optional[str] = None
    caste_category: Optional[str] = None
    disability_status: Optional[bool] = False
    marital_status: Optional[str] = None
    land_ownership_acres: Optional[float] = 0.0
    has_ration_card: Optional[bool] = False
    has_bpl_card: Optional[bool] = False
    is_student: Optional[bool] = False
    is_senior_citizen: Optional[bool] = False
    is_minority: Optional[bool] = False
    extra_attributes: Optional[Dict[str, Any]] = None

class ProfileUpdate(ProfileBase):
    pass

class ProfileResponse(ProfileBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
