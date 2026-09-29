import io
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    res = client.get("/api/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"
    assert data["database"] == "connected"
    assert "project" in data

    # Test root /health endpoint used by Render
    render_health = client.get("/health")
    assert render_health.status_code == 200
    assert render_health.json()["status"] == "healthy"

def test_database_url_normalization():
    from app.database import normalize_database_url
    assert normalize_database_url("mysql://root:pass@host:3306/db") == "mysql+pymysql://root:pass@host:3306/db"
    assert normalize_database_url("mysql2://root:pass@host:3306/db") == "mysql+pymysql://root:pass@host:3306/db"
    assert normalize_database_url("mysql+pymysql://root:pass@host:3306/db") == "mysql+pymysql://root:pass@host:3306/db"
    assert normalize_database_url("sqlite:///./test.db") == "sqlite:///./test.db"

def test_cors_configuration():
    from app.config import settings
    origins = settings.allowed_origins
    assert "*" not in origins
    assert "https://teambroskis.netlify.app" in origins
    assert "http://localhost:5173" in origins


def test_root():
    res = client.get("/")
    assert res.status_code == 200
    assert "docs" in res.json()

def test_auth_and_user_flows():
    # 1. Login with seeded demo user
    login_res = client.post("/api/auth/login", json={
        "email": "demo@example.com",
        "password": "DemoPassword123!"
    })
    assert login_res.status_code == 200
    token_data = login_res.json()
    token = token_data["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Get Me
    me_res = client.get("/api/auth/me", headers=headers)
    assert me_res.status_code == 200
    assert me_res.json()["email"] == "demo@example.com"

    # 3. Get Profile
    prof_res = client.get("/api/users/profile", headers=headers)
    assert prof_res.status_code == 200
    prof = prof_res.json()
    assert prof["occupation"] == "Farmer"

    # 4. Update Profile
    update_res = client.put("/api/users/profile", json={
        "age": 35,
        "annual_income": 190000.0,
        "occupation": "Farmer",
        "state": "Uttar Pradesh",
        "land_ownership_acres": 2.8,
        "has_ration_card": True
    }, headers=headers)
    assert update_res.status_code == 200
    assert update_res.json()["age"] == 35

    # 5. List Schemes
    schemes_res = client.get("/api/schemes")
    assert schemes_res.status_code == 200
    schemes = schemes_res.json()
    assert len(schemes) >= 8

    # 6. Get Scheme by ID
    pm_kisan = next(s for s in schemes if s["code"] == "PM_KISAN")
    scheme_res = client.get(f"/api/schemes/{pm_kisan['id']}")
    assert scheme_res.status_code == 200
    assert len(scheme_res.json()["rules"]) >= 3

    # 7. Check Eligibility for all schemes
    check_res = client.post("/api/eligibility/check", json={}, headers=headers)
    assert check_res.status_code == 200
    results = check_res.json()
    assert len(results) >= 8

    # Verify PM_KISAN is POTENTIALLY_ELIGIBLE or ELIGIBLE based on farmer + land 2.8 <= 5
    pm_kisan_result = next(r for r in results if r["scheme_id"] == pm_kisan["id"])
    assert pm_kisan_result["status"] in ("ELIGIBLE", "POTENTIALLY_ELIGIBLE")
    assert pm_kisan_result["estimated_benefit"] == 6000.0

    # 8. Upload Document
    file_bytes = b"%PDF-1.4 test document content for citizen verification"
    upload_res = client.post(
        "/api/documents/upload",
        files={"file": ("Income_Certificate.pdf", io.BytesIO(file_bytes), "application/pdf")},
        data={"document_type": "Income Certificate"},
        headers=headers
    )
    assert upload_res.status_code == 201
    doc_data = upload_res.json()
    assert doc_data["document_type"] == "Income Certificate"

    # 9. List Documents
    docs_res = client.get("/api/documents", headers=headers)
    assert docs_res.status_code == 200
    assert len(docs_res.json()) >= 1

    # 10. Submit Application
    app_res = client.post("/api/applications", json={
        "scheme_id": pm_kisan["id"],
        "notes": "Verified application test submission"
    }, headers=headers)
    assert app_res.status_code == 201
    app_data = app_res.json()
    assert "PM_KISAN-" in app_data["application_reference_number"]

    # 11. List Applications
    my_apps = client.get("/api/applications", headers=headers)
    assert my_apps.status_code == 200
    assert len(my_apps.json()) >= 1

    # 12. AI Explain Eligibility
    ai_explain = client.post("/api/ai/explain-eligibility", json={
        "scheme_id": pm_kisan["id"],
        "result_id": pm_kisan_result["id"]
    }, headers=headers)
    assert ai_explain.status_code == 200
    explain_data = ai_explain.json()
    assert "PM-KISAN" in explain_data["scheme_name"] or "Pradhan Mantri" in explain_data["scheme_name"]
    assert len(explain_data["citations"]) > 0

    # 13. AI Recommend Schemes
    ai_rec = client.post("/api/ai/recommend-schemes", json={
        "category": "Agriculture"
    }, headers=headers)
    assert ai_rec.status_code == 200
    rec_data = ai_rec.json()
    assert len(rec_data["recommended_schemes"]) > 0
