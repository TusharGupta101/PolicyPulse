import os
import uuid
import shutil
from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from app.config import settings
from app.database import get_db
from app.models.user import User
from app.models.document import Document
from app.schemas.document import DocumentResponse
from app.ai.document_extractor import DocumentExtractor
from app.api.deps import get_current_user

router = APIRouter(prefix="/documents", tags=["Documents"])

@router.post("/upload", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
async def upload_document(
    file: UploadFile = File(...),
    document_type: str = Form("Other"),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Validate extension
    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file format '{ext}'. Allowed extensions: {', '.join(settings.ALLOWED_EXTENSIONS)}"
        )

    # Ensure uploads directory exists (supports relative paths and absolute persistent disk paths)
    if os.path.isabs(settings.UPLOAD_DIR):
        upload_folder = settings.UPLOAD_DIR
    else:
        current_dir = os.path.dirname(os.path.abspath(__file__))
        root_dir = os.path.abspath(os.path.join(current_dir, "..", "..", ".."))
        upload_folder = os.path.join(root_dir, settings.UPLOAD_DIR)
    os.makedirs(upload_folder, exist_ok=True)

    # Generate unique stored filename
    unique_name = f"{current_user.id}_{uuid.uuid4().hex[:10]}{ext}"
    saved_path = os.path.join(upload_folder, unique_name)

    # Save to disk and calculate size
    try:
        with open(saved_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    finally:
        file.file.close()

    file_size = os.path.getsize(saved_path)
    if file_size > settings.MAX_FILE_SIZE_MB * 1024 * 1024:
        os.remove(saved_path)
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"File exceeds maximum allowed size of {settings.MAX_FILE_SIZE_MB}MB."
        )

    # Extract text and metadata via modular AI extractor
    extracted_text, metadata = DocumentExtractor.extract(saved_path, file.content_type or ext)

    doc_record = Document(
        user_id=current_user.id,
        original_filename=file.filename,
        stored_filename=unique_name,
        file_path=saved_path,
        file_type=file.content_type or ext,
        document_type=document_type,
        file_size=file_size,
        processing_status="PROCESSED",
        extracted_text=extracted_text,
        extracted_metadata=metadata
    )
    db.add(doc_record)
    db.commit()
    db.refresh(doc_record)
    return doc_record

@router.get("", response_model=List[DocumentResponse])
def get_user_documents(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    docs = db.query(Document).filter(Document.user_id == current_user.id).order_by(Document.upload_time.desc()).all()
    return docs

@router.delete("/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_document(
    document_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    doc = db.query(Document).filter(
        Document.id == document_id,
        Document.user_id == current_user.id
    ).first()
    if not doc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Document not found")

    # Remove file on disk if exists
    if os.path.exists(doc.file_path):
        try:
            os.remove(doc.file_path)
        except Exception:
            pass

    db.delete(doc)
    db.commit()
    return None
