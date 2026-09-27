# PolicyPulse — Financial Policy Discovery & Eligibility Assistant

> **Understand. Discover. Access.**  
> A civic-technology platform built for transparent government welfare scheme discovery, deterministic statutory eligibility verification, and application tracking.

---

## 1. Executive Summary

**PolicyPulse** bridges the gap between citizens and government welfare programs. It replaces opaque eligibility assessments and fragmented ministry portals with a single discovery catalog, a **deterministic mathematical rule engine** with zero AI hallucinations, automated document evidence verification, and end-to-end application tracking.

---

## 2. Core Feature Highlights

- **National Scheme Directory**: Search and filter central and state welfare initiatives across Agriculture, Healthcare, Housing, Education, Business, and Social Security.
- **Deterministic Rule Engine**: Mathematically tests statutory conditions (`==`, `!=`, `>`, `<`, `>=`, `<=`, `IN`, `NOT_IN`) against profile parameters.
- **Explainable Eligibility States**:
  - `ELIGIBLE` (Green): Citizen meets all statutory requirements and all mandatory documents are uploaded.
  - `POTENTIALLY_ELIGIBLE` (Yellow): Citizen meets conditions, but required documents are pending upload.
  - `INELIGIBLE` (Red): One or more statutory conditions failed.
  - `INSUFFICIENT_INFORMATION` (Gray): Required profile criteria are blank.
- **Civic-Tech Design System**: Accessible, professional visual identity in Deep Forest Green (`#173B32` / `#246B55`), Warm Cream (`#F7F5EF`), and Saffron Gold (`#D9A441`).
- **Document Evidence Vault**: Upload and extract text from identity and income proofs (PDF/JPG/PNG).
- **Grounded Legal Explanations**: Gazette citations for statutory rules from curated knowledge bases (`ai_data/scheme_knowledge_base.json`).
- **Application Tracking**: Generates unique alphanumeric tracking reference codes (e.g. `APP-2026-XXXXX`).

---

## 3. Technology Stack

- **Frontend**: React 19, Vite 8, Tailwind CSS, React Router v7, Lucide React, Axios
- **Backend**: FastAPI (Python 3.13), Uvicorn, SQLAlchemy 2.0 ORM, Pydantic v2
- **Database**: MySQL 8.0 (configured via `DATABASE_URL` with SQLite zero-config local fallback)
- **Security**: Salted Bcrypt password hashing, stateless 24-hour JWT tokens (HS256)
- **Document Extraction**: `pypdf`, `python-multipart`
- **Testing**: `pytest`, `pytest-asyncio`

---

## 4. Architecture

```text
       Citizen / Browser
               │
               ▼
   React + Vite Frontend (Port 5173)
   (Tailwind CSS, Lucide, React Router)
               │
          REST API (JWT)
               │
               ▼
     FastAPI Backend (Port 8000)
 ┌─────────────┴─────────────────────────┐
 │                                       │
 ▼                                       ▼
Deterministic Rule Engine          Document Extractor
(Boolean / Range Evaluation)      (PDF Text Parsing)
 │                                       │
 └─────────────┬─────────────────────────┘
               │
               ▼
      SQLAlchemy 2.0 ORM
               │
               ▼
       MySQL 8.0 Database
 (Users, Profiles, Schemes, Rules,
   Documents, Results, Applications)
```

---

## 5. Quick Start (Windows PowerShell)

### 1. Start Backend

```powershell
cd backend
.\venv\Scripts\Activate.ps1
# Seed demo account and verified schemes (if database is fresh)
python seed/seed_data.py
# Run FastAPI server
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

- **API Endpoint:** [http://127.0.0.1:8000](http://127.0.0.1:8000)
- **Swagger Documentation:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### 2. Start Frontend

```powershell
cd frontend
npm install
npm run dev
```

- **Frontend Application:** [http://localhost:5173](http://localhost:5173)

### Demo Account Credentials
- **Email:** `demo@example.com`
- **Password:** `DemoPassword123!`

---

## 6. Testing

Execute all automated unit and integration tests:

```powershell
cd backend
pytest -v
```

---

## 7. Documentation

Comprehensive architecture, database schemas, and API documentation are available at [`docs/PROJECT_DOCUMENTATION.md`](docs/PROJECT_DOCUMENTATION.md).
