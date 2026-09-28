import json
from typing import Dict, Any, List, Tuple
from app.models.profile import Profile
from app.models.scheme import Scheme
from app.models.eligibility_rule import EligibilityRule
from app.models.document import Document

class EligibilityStatus:
    ELIGIBLE = "ELIGIBLE"
    INELIGIBLE = "INELIGIBLE"
    POTENTIALLY_ELIGIBLE = "POTENTIALLY_ELIGIBLE"
    INSUFFICIENT_INFORMATION = "INSUFFICIENT_INFORMATION"


def coerce_value(raw_val: Any, target_type: str = "string") -> Any:
    if raw_val is None:
        return None
    try:
        if target_type == "number":
            return float(raw_val)
        elif target_type == "boolean":
            if isinstance(raw_val, bool):
                return raw_val
            return str(raw_val).strip().lower() in ("true", "1", "yes")
        elif target_type == "list":
            if isinstance(raw_val, list):
                return [str(x).strip().lower() for x in raw_val]
            if isinstance(raw_val, str):
                try:
                    parsed = json.loads(raw_val)
                    if isinstance(parsed, list):
                        return [str(x).strip().lower() for x in parsed]
                except Exception:
                    pass
                return [x.strip().lower() for x in raw_val.split(",") if x.strip()]
            return [str(raw_val).lower()]
        else:
            return str(raw_val).strip().lower()
    except Exception:
        return raw_val


def evaluate_operator(operator: str, actual: Any, expected: Any, value_type: str = "string") -> bool:
    op = operator.upper().strip()
    
    if op == "==":
        return actual == expected
    elif op == "!=":
        return actual != expected
    elif op == ">":
        return actual > expected
    elif op == "<":
        return actual < expected
    elif op == ">=":
        return actual >= expected
    elif op == "<=":
        return actual <= expected
    elif op == "IN":
        # expected is a list of acceptable values, or actual is contained in expected
        if isinstance(expected, list):
            return actual in expected
        if isinstance(expected, str):
            return actual in [x.strip().lower() for x in expected.split(",")]
        return False
    elif op == "NOT_IN":
        if isinstance(expected, list):
            return actual not in expected
        if isinstance(expected, str):
            return actual not in [x.strip().lower() for x in expected.split(",")]
        return True
    else:
        raise ValueError(f"Unsupported rule operator: {operator}")


def evaluate_rule(rule: EligibilityRule, profile_data: Dict[str, Any]) -> Dict[str, Any]:
    field_name = rule.field.strip()
    target_type = (rule.value_type or "string").lower()
    
    expected_value = coerce_value(rule.value, target_type)
    actual_raw = profile_data.get(field_name)
    
    detail = {
        "field": field_name,
        "operator": rule.operator,
        "expected_value": rule.value,
        "actual_value": actual_raw,
        "description": rule.description,
        "source_section": rule.source_section,
        "passed": False,
        "missing": False,
        "reason": ""
    }
    
    # Missing information check
    if actual_raw is None or (isinstance(actual_raw, str) and actual_raw.strip() == ""):
        detail["missing"] = True
        detail["reason"] = f"Missing required information for '{rule.description}' ({field_name})."
        return detail
    
    actual_value = coerce_value(actual_raw, target_type)
    
    try:
        passed = evaluate_operator(rule.operator, actual_value, expected_value, target_type)
        detail["passed"] = passed
        if passed:
            detail["reason"] = f"Satisfies requirement: {actual_raw} matches {rule.operator} {rule.value}."
        else:
            detail["reason"] = f"Does not meet requirement: {actual_raw} violates {rule.operator} {rule.value}."
    except Exception as ex:
        detail["missing"] = True
        detail["reason"] = f"Evaluation error for {field_name}: {str(ex)}"
        
    return detail


def evaluate_scheme_eligibility(
    scheme: Scheme,
    profile: Profile,
    user_documents: List[Document]
) -> Dict[str, Any]:
    # Extract profile fields into a dictionary
    profile_dict = {
        "age": profile.age,
        "gender": profile.gender,
        "annual_income": profile.annual_income,
        "state": profile.state,
        "occupation": profile.occupation,
        "caste_category": profile.caste_category,
        "disability_status": profile.disability_status,
        "marital_status": profile.marital_status,
        "land_ownership_acres": profile.land_ownership_acres,
        "has_ration_card": profile.has_ration_card,
        "has_bpl_card": profile.has_bpl_card,
        "is_student": profile.is_student,
        "is_senior_citizen": profile.is_senior_citizen,
        "is_minority": profile.is_minority,
    }
    
    if profile.extra_attributes and isinstance(profile.extra_attributes, dict):
        profile_dict.update(profile.extra_attributes)

    # Document type mapping
    uploaded_doc_types = {d.document_type.lower() for d in user_documents}
    required_docs = scheme.required_documents or []
    missing_docs = [doc for doc in required_docs if doc.lower() not in uploaded_doc_types]

    passed_criteria: List[Dict[str, Any]] = []
    failed_criteria: List[Dict[str, Any]] = []
    missing_info: List[Dict[str, Any]] = []

    # Evaluate all defined rules
    for rule in scheme.rules:
        eval_result = evaluate_rule(rule, profile_dict)
        if eval_result["missing"]:
            missing_info.append(eval_result)
        elif eval_result["passed"]:
            passed_criteria.append(eval_result)
        else:
            failed_criteria.append(eval_result)

    # If any required documents are missing, note them
    for m_doc in missing_docs:
        missing_info.append({
            "field": "document",
            "operator": "EXISTS",
            "expected_value": m_doc,
            "actual_value": "Not Uploaded",
            "description": f"Mandatory document verification: {m_doc}",
            "source_section": "Document Checklist",
            "passed": False,
            "missing": True,
            "reason": f"Required document '{m_doc}' has not been uploaded or verified."
        })

    # Decision Logic:
    # 1. Any failed criteria -> INELIGIBLE
    # 2. No failed criteria, but missing info:
    #    - If income/state/core attribute is missing -> INSUFFICIENT_INFORMATION
    #    - If only docs or minor fields missing -> POTENTIALLY_ELIGIBLE
    # 3. All passed, zero missing -> ELIGIBLE
    if len(failed_criteria) > 0:
        status = EligibilityStatus.INELIGIBLE
        explanation = (
            f"You do not currently qualify for {scheme.name}. "
            f"{len(failed_criteria)} criteria were not satisfied. "
            f"Primary constraint: {failed_criteria[0]['description']} ({failed_criteria[0]['reason']})."
        )
    elif len(missing_info) > 0:
        # Check if missing info includes core profile fields or just documents
        has_core_profile_missing = any(item.get("field") != "document" for item in missing_info)
        if has_core_profile_missing:
            status = EligibilityStatus.INSUFFICIENT_INFORMATION
            explanation = (
                f"Eligibility for {scheme.name} cannot be verified. "
                f"Essential profile details are missing: "
                + ", ".join([f"{item['description']}" for item in missing_info if item.get('field') != 'document'][:3])
                + ". Please complete your profile to receive a definitive determination."
            )
        else:
            status = EligibilityStatus.POTENTIALLY_ELIGIBLE
            explanation = (
                f"You meet all profile criteria for {scheme.name}, but {len(missing_docs)} required document(s) "
                f"({', '.join(missing_docs)}) must be uploaded before full approval can be granted."
            )
    else:
        status = EligibilityStatus.ELIGIBLE
        explanation = (
            f"Congratulations! You meet all {len(passed_criteria)} eligibility conditions for {scheme.name} "
            f"and your submitted documents are in order."
        )

    estimated_benefit = scheme.benefit_amount if status in (EligibilityStatus.ELIGIBLE, EligibilityStatus.POTENTIALLY_ELIGIBLE) else 0.0

    return {
        "status": status,
        "estimated_benefit": estimated_benefit,
        "passed_criteria": passed_criteria,
        "failed_criteria": failed_criteria,
        "missing_information": missing_info,
        "explanation": explanation,
        "source_reference": scheme.official_source_url or "Official Gazette Policy Guidelines",
        "missing_docs_count": len(missing_docs)
    }
