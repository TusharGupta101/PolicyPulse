import pytest
from app.rule_engine.engine import evaluate_operator, evaluate_rule, coerce_value
from app.models.eligibility_rule import EligibilityRule

def test_evaluate_operators():
    assert evaluate_operator("==", 100, 100, "number") is True
    assert evaluate_operator("==", 100, 200, "number") is False
    assert evaluate_operator("!=", 100, 200, "number") is True
    assert evaluate_operator("<=", 500000, 500000, "number") is True
    assert evaluate_operator("<=", 400000, 500000, "number") is True
    assert evaluate_operator("<=", 600000, 500000, "number") is False
    assert evaluate_operator(">=", 21, 18, "number") is True
    assert evaluate_operator("IN", "farmer", ["farmer", "artisan"], "list") is True
    assert evaluate_operator("IN", "student", ["farmer", "artisan"], "list") is False
    assert evaluate_operator("NOT_IN", "student", ["farmer", "artisan"], "list") is True

def test_rule_missing_information():
    rule = EligibilityRule(
        field="annual_income",
        operator="<=",
        value="300000",
        value_type="number",
        description="Income under 3 Lakh",
        is_mandatory=True
    )
    result = evaluate_rule(rule, {})
    assert result["missing"] is True
    assert result["passed"] is False

def test_rule_passed_and_failed():
    rule = EligibilityRule(
        field="age",
        operator=">=",
        value="18",
        value_type="number",
        description="Must be at least 18",
        is_mandatory=True
    )
    passed_result = evaluate_rule(rule, {"age": 25})
    assert passed_result["passed"] is True
    assert passed_result["missing"] is False

    failed_result = evaluate_rule(rule, {"age": 16})
    assert failed_result["passed"] is False
    assert failed_result["missing"] is False
