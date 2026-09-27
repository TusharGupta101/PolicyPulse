from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, joinedload
from app.database import get_db
from app.models.scheme import Scheme
from app.schemas.scheme import SchemeResponse, SchemeDetailResponse

router = APIRouter(prefix="/schemes", tags=["Schemes"])

@router.get("", response_model=List[SchemeResponse])
def get_schemes(
    category: Optional[str] = Query(None, description="Filter by category"),
    state: Optional[str] = Query(None, description="Filter by state applicability"),
    search: Optional[str] = Query(None, description="Search term in name or description"),
    db: Session = Depends(get_db)
):
    query = db.query(Scheme).filter(Scheme.is_active == True)
    
    if category and category.lower() != "all":
        query = query.filter(Scheme.category.ilike(f"%{category}%"))
    if state and state.lower() != "all":
        query = query.filter((Scheme.state_applicability == "All India") | (Scheme.state_applicability.ilike(f"%{state}%")))
    if search:
        s = f"%{search}%"
        query = query.filter((Scheme.name.ilike(s)) | (Scheme.description.ilike(s)) | (Scheme.target_users.ilike(s)))
        
    schemes = query.all()
    return schemes

@router.get("/{scheme_id}", response_model=SchemeDetailResponse)
def get_scheme(scheme_id: int, db: Session = Depends(get_db)):
    scheme = db.query(Scheme).options(joinedload(Scheme.rules)).filter(Scheme.id == scheme_id).first()
    if not scheme:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Scheme not found")
    return scheme
