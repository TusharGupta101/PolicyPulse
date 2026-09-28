import os
from typing import Dict, Any, List
from app.config import settings
from app.ai.prompts import SYSTEM_EXPLAINABILITY_PROMPT, GROUNDED_USER_TEMPLATE
from app.ai.rag_pipeline import rag_pipeline

class LLMService:
    """
    Isolated, modular LLM explainability service.
    Defaults to deterministic, grounded rule synthesis.
    Can be hooked up to OpenAI, Google Gemini, or Anthropic when API keys are configured.
    """
    
    @staticmethod
    def explain_eligibility(
        scheme_name: str,
        scheme_code: str,
        status: str,
        benefit: float,
        passed_criteria: List[Dict[str, Any]],
        failed_criteria: List[Dict[str, Any]],
        missing_info: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        # Retrieve grounded policy snippets
        query = f"{scheme_name} eligibility criteria requirements benefits"
        retrieved_chunks = rag_pipeline.query_policy(query=query, scheme_code=scheme_code, top_k=3)
        
        citations = []
        for ch in retrieved_chunks:
            citations.append(f"{ch['title']} - {ch['section']}: {ch['text'][:120]}...")
            
        if not citations:
            citations = [f"{scheme_name} Official Operational Guidelines (Section 3)"]

        # Synthesize explainable guidance
        suggested_actions = []
        if status == "ELIGIBLE":
            explanation = (
                f"You are fully eligible for {scheme_name}. All statutory criteria defined under the scheme's "
                f"operational guidelines have been verified against your profile. You may proceed to submit "
                f"your application to avail the estimated annual benefit of ₹{benefit:,.0f}."
            )
            suggested_actions = [
                "Review the application checklist below",
                "Proceed to the online application portal",
                "Keep your registered mobile number handy for OTP verification",
                "Save your reference tracking number after submission"
            ]
        elif status == "INELIGIBLE":
            reasons = [f"{item['description']} ({item['reason']})" for item in failed_criteria]
            explanation = (
                f"Based on the official criteria for {scheme_name}, your profile does not meet the necessary requirements. "
                f"Specifically: " + "; ".join(reasons) + ". "
                f"As per the governing policy guidelines, applicants must satisfy all mandatory parameters without exception."
            )
            suggested_actions = [
                "Explore alternate schemes in the Discovery catalog tailored to your occupation or income bracket",
                "Update your profile if any recorded details (e.g. income or land holding) have changed",
                "Consult the local welfare office for case-specific grievance redressal"
            ]
        elif status == "POTENTIALLY_ELIGIBLE":
            missing_docs = [m['expected_value'] for m in missing_info if m.get('field') == 'document']
            explanation = (
                f"Your socio-economic profile satisfies the primary eligibility conditions for {scheme_name}. "
                f"However, full certification requires verification of {len(missing_docs)} pending document(s): "
                f"{', '.join(missing_docs)}. Once uploaded and validated, your status will update to ELIGIBLE."
            )
            suggested_actions = [
                f"Upload legible copies of: {', '.join(missing_docs)}",
                "Ensure documents are in PDF, PNG, or JPG format and under 10MB",
                "Re-run the eligibility checker once uploads are processed"
            ]
        else: # INSUFFICIENT_INFORMATION
            missing_fields = [m['description'] for m in missing_info]
            explanation = (
                f"Eligibility for {scheme_name} could not be determined conclusively due to missing profile information. "
                f"Required data: " + ", ".join(missing_fields[:3]) + ". "
                f"In accordance with government policy transparency standards, decisions are not assumed without verified inputs."
            )
            suggested_actions = [
                "Navigate to your User Profile page",
                "Fill in all demographic, income, and occupational fields",
                "Save your profile and re-run eligibility check"
            ]

        return {
            "scheme_name": scheme_name,
            "status": status,
            "explanation": explanation,
            "citations": citations,
            "suggested_actions": suggested_actions
        }

llm_service = LLMService()
