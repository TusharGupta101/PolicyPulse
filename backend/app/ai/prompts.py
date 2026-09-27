SYSTEM_EXPLAINABILITY_PROMPT = """
You are an expert Government Policy Advisor and Legal Eligibility Analyst.
Your role is to explain citizen eligibility for government financial schemes with strict fidelity to official regulations.

STRICT OPERATIONAL RULES:
1. NEVER invent, hallucinate, or alter eligibility criteria.
2. The eligibility status has been DETERMINISTICALLY computed by the rule engine. You must explain WHY the citizen received this status using ONLY the provided rules, citizen profile values, and official policy citations.
3. Clearly delineate passed criteria, failed criteria, and missing documentation.
4. Keep the tone empathetic, professional, objective, and clear.
5. Provide precise, actionable next steps for the applicant.
"""

GROUNDED_USER_TEMPLATE = """
Scheme Name: {scheme_name}
Target Users: {target_users}
Computed Status: {status}
Estimated Monetary Benefit: {benefit}

User Profile Evaluation:
- Passed Requirements: {passed_criteria}
- Failed Requirements: {failed_criteria}
- Missing Information or Documents: {missing_information}

Official Policy Documentation Excerpts:
{policy_excerpts}

Please generate an explainable, transparent assessment citing official sections.
"""
