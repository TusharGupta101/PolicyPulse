import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, joinedload
from app.database import get_db
from app.models.user import User
from app.models.scheme import Scheme
from app.models.application import Application
from app.schemas.application import ApplicationCreate, ApplicationResponse
from app.api.deps import get_current_user

router = APIRouter(prefix="/applications", tags=["Applications"])

@router.get("", response_model=List[ApplicationResponse])
def get_applications(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    apps = db.query(Application).options(joinedload(Application.scheme)).filter(
        Application.user_id == current_user.id
    ).order_by(Application.submitted_at.desc()).all()
    return apps

@router.post("", response_model=ApplicationResponse, status_code=status.HTTP_201_CREATED)
def submit_application(
    app_in: ApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    scheme = db.query(Scheme).filter(Scheme.id == app_in.scheme_id).first()
    if not scheme:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Scheme does not exist")

    # Generate reference tracking code
    ref_code = f"{scheme.code}-{uuid.uuid4().hex[:8].upper()}"

    app_record = Application(
        user_id=current_user.id,
        scheme_id=scheme.id,
        application_reference_number=ref_code,
        status="SUBMITTED",
        notes=app_in.notes
    )
    db.add(app_record)
    db.commit()
    db.refresh(app_record)
    app_record.scheme = scheme
    return app_record
