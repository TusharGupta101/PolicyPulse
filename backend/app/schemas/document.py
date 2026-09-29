from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel, ConfigDict

class DocumentResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    original_filename: str
    file_type: str
    document_type: str
    file_size: int
    processing_status: str
    extracted_text: Optional[str] = None
    extracted_metadata: Optional[Dict[str, Any]] = None
    upload_time: datetime
