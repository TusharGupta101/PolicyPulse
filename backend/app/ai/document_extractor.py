import os
import re
from typing import Dict, Any, Tuple
from pypdf import PdfReader

class DocumentExtractor:
    """
    Modular document text extractor supporting PDF files and modular OCR hooks.
    """
    
    @staticmethod
    def extract_text_from_pdf(file_path: str) -> str:
        text_content = []
        try:
            reader = PdfReader(file_path)
            for page_num, page in enumerate(reader.pages):
                page_text = page.extract_text()
                if page_text:
                    text_content.append(page_text.strip())
            return "\n\n".join(text_content)
        except Exception as e:
            return f"[Error extracting PDF text: {str(e)}]"

    @staticmethod
    def extract_text_from_image(file_path: str) -> str:
        """
        Modular OCR interface. In production, this integrates pytesseract or AWS Textract / Cloud Vision.
        For prototype demonstration, returns a structured simulated OCR response.
        """
        base_name = os.path.basename(file_path).lower()
        if "income" in base_name:
            return "GOVERNMENT OF INDIA / STATE REVENUE DEPARTMENT\nINCOME CERTIFICATE\nAnnual Household Income: Rs. 1,80,000\nIssued to: Demo Citizen\nCategory: Low Income Group"
        elif "aadhaar" in base_name:
            return "GOVERNMENT OF INDIA\nUNIQUE IDENTIFICATION AUTHORITY OF INDIA\nAadhaar Card\nName: Demo Citizen\nDOB: 15/08/1990\nGender: Male\nAddress: State of Uttar Pradesh, India"
        elif "land" in base_name:
            return "LAND RECORD & KHASRA EXTRACT\nTotal Agricultural Land Holding: 1.50 Hectares / 3.7 Acres\nCultivator: Demo Citizen"
        else:
            return f"Simulated OCR extract for image: {os.path.basename(file_path)}. Validated document format."

    @classmethod
    def extract(cls, file_path: str, file_type: str) -> Tuple[str, Dict[str, Any]]:
        extracted_text = ""
        metadata = {}
        
        if "pdf" in file_type.lower() or file_path.lower().endswith(".pdf"):
            extracted_text = cls.extract_text_from_pdf(file_path)
        else:
            extracted_text = cls.extract_text_from_image(file_path)
            
        # Extract heuristic metadata using regex patterns
        income_match = re.search(r"(?:annual\s+income|income|rs\.?)\s*[:=-]?\s*([0-9,]+)", extracted_text, re.IGNORECASE)
        if income_match:
            try:
                clean_num = income_match.group(1).replace(",", "")
                metadata["detected_income"] = float(clean_num)
            except Exception:
                pass

        if "aadhaar" in extracted_text.lower():
            metadata["document_type_detected"] = "Aadhaar Card"
        elif "income" in extracted_text.lower():
            metadata["document_type_detected"] = "Income Certificate"
        elif "land" in extracted_text.lower():
            metadata["document_type_detected"] = "Land Records"

        return extracted_text, metadata
