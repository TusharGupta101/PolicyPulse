from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from app.database import get_db
from app.models.user import User
from app.models.profile import Profile
from app.models.scheme import Scheme
from app.models.document import Document
from app.models.eligibility_result import EligibilityResult
from app.schemas.eligibility import EligibilityCheckRequest, EligibilityResultResponse
from app.rule_engine.engine import evaluate_scheme_eligibility
from app.api.deps import get_current_user

router = APIRouter(prefix="/eligibility", tags=["Eligibility Engine"])

@router.post("/check", response_model=List[EligibilityResultResponse])
def check_eligibility(
    req: EligibilityCheckRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    profile = db.query(Profile).filter(Profile.user_id == current_user.id).first()
    if not profile:
        profile = Profile(user_id=current_user.id)
        db.add(profile)
        db.commit()
        db.refresh(profile)

    user_docs = db.query(Document).filter(Document.user_id == current_user.id).all()
    
    if req.scheme_id:
        schemes = db.query(Scheme).options(joinedload(Scheme.rules)).filter(Scheme.id == req.scheme_id, Scheme.is_active == True).all()
    else:
        schemes = db.query(Scheme).options(joinedload(Scheme.rules)).filter(Scheme.is_active == True).all()

    if not schemes:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No active schemes found.")

    saved_results = []
    for s in schemes:
        eval_outcome = evaluate_scheme_eligibility(scheme=s, profile=profile, user_documents=user_docs)
        
        # Check if existing result exists to update or insert
        res_record = db.query(EligibilityResult).filter(
            EligibilityResult.user_id == current_user.id,
            EligibilityResult.scheme_id == s.id
        ).first()
        
        if not res_record:
            res_record = EligibilityResult(
                user_id=current_user.id,
                scheme_id=s.id
            )
            db.add(res_record)
            
        res_record.status = eval_outcome["status"]
        res_record.estimated_benefit = eval_outcome["estimated_benefit"]
        res_record.passed_criteria = eval_outcome["passed_criteria"]
        res_record.failed_criteria = eval_outcome["failed_criteria"]
        res_record.missing_information = eval_outcome["missing_information"]
        res_record.explanation = eval_outcome["explanation"]
        res_record.source_reference = eval_outcome["source_reference"]
        
        db.commit()
        db.refresh(res_record)
        res_record.scheme = s
        saved_results.append(res_record)

    return saved_results

@router.get("/results", response_model=List[EligibilityResultResponse])
def get_user_eligibility_results(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    results = db.query(EligibilityResult).options(joinedload(EligibilityResult.scheme)).filter(
        EligibilityResult.user_id == current_user.id
    ).order_by(EligibilityResult.checked_at.desc()).all()
    return results

@router.get("/{result_id}", response_model=EligibilityResultResponse)
def get_result_by_id(
    result_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = db.query(EligibilityResult).options(joinedload(EligibilityResult.scheme)).filter(
        EligibilityResult.id == result_id,
        EligibilityResult.user_id == current_user.id
    ).first()
    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Eligibility result record not found")
    return result
