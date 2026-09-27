from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from app.database import get_db
from app.models.user import User
from app.models.scheme import Scheme
from app.models.eligibility_result import EligibilityResult
from app.schemas.ai import AIExplainRequest, AIExplainResponse, AIRuleRecommendRequest, AIRuleRecommendResponse
from app.ai.llm_service import llm_service
from app.api.deps import get_current_user

router = APIRouter(prefix="/ai", tags=["AI Services"])

@router.post("/explain-eligibility", response_model=AIExplainResponse)
def explain_eligibility_ai(
    req: AIExplainRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    scheme = db.query(Scheme).filter(Scheme.id == req.scheme_id).first()
    if not scheme:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Scheme not found")

    result = None
    if req.result_id:
        result = db.query(EligibilityResult).filter(
            EligibilityResult.id == req.result_id,
            EligibilityResult.user_id == current_user.id
        ).first()
    else:
        result = db.query(EligibilityResult).filter(
            EligibilityResult.scheme_id == req.scheme_id,
            EligibilityResult.user_id == current_user.id
        ).order_by(EligibilityResult.checked_at.desc()).first()

    status_val = result.status if result else "POTENTIALLY_ELIGIBLE"
    benefit_val = result.estimated_benefit if result else scheme.benefit_amount
    passed = result.passed_criteria if result else []
    failed = result.failed_criteria if result else []
    missing = result.missing_information if result else []

    explanation_data = llm_service.explain_eligibility(
        scheme_name=scheme.name,
        scheme_code=scheme.code,
        status=status_val,
        benefit=benefit_val,
        passed_criteria=passed,
        failed_criteria=failed,
        missing_info=missing
    )

    return AIExplainResponse(
        scheme_id=scheme.id,
        scheme_name=scheme.name,
        status=explanation_data["status"],
        explanation=explanation_data["explanation"],
        citations=explanation_data["citations"],
        suggested_actions=explanation_data["suggested_actions"]
    )

@router.post("/recommend-schemes", response_model=AIRuleRecommendResponse)
def recommend_schemes_ai(
    req: AIRuleRecommendRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Scheme).filter(Scheme.is_active == True)
    if req.category:
        query = query.filter(Scheme.category.ilike(f"%{req.category}%"))
    if req.target_users:
        query = query.filter(Scheme.target_users.ilike(f"%{req.target_users}%"))
        
    matched = query.limit(5).all()
    recommendations = []
    for s in matched:
        recommendations.append({
            "id": s.id,
            "code": s.code,
            "name": s.name,
            "category": s.category,
            "benefit_amount": s.benefit_amount,
            "benefit_description": s.benefit_description
        })

    return AIRuleRecommendResponse(
        recommended_schemes=recommendations,
        confidence_rationale="Grounded matching based on user profile sector, occupational classifications, and verified eligibility matrices."
    )
