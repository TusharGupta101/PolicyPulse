# PolicyPulse — Project Documentation

**Financial Policy Discovery & Eligibility Assistant**  
*Understand. Discover. Access.*

---

## 1. Project Overview

**PolicyPulse** is an accessible, citizen-first civic-technology platform designed to bridge the gap between government welfare programs and eligible beneficiaries. It enables citizens across India to discover central and state welfare initiatives, evaluate their statutory eligibility deterministically with zero AI hallucinations, manage supporting evidence documents, calculate entitled financial benefits, and track submitted applications through unique reference codes.

---

## 2. Problem Statement

Across central and state jurisdictions, hundreds of government welfare policies exist across agriculture, healthcare, housing, education, livelihood, and social security. However, citizens face critical accessibility bottlenecks:
1. **Fragmented Portals**: Information is scattered across dozens of ministry and state websites with inconsistent formats.
2. **Complex Statutory Criteria**: Eligibility requirements (income thresholds, landholding limits, age brackets, social categories) are buried in dense legal gazettes.
3. **Ambiguity and Misinformation**: Citizens frequently submit invalid applications or miss out on entitlements due to uncertainty about their qualification status.
4. **Lack of Evidence Visibility**: Citizens rarely know the exact checklist of supporting documents required before applying.

---

## 3. Solution

PolicyPulse solves this accessibility paradox through:
1. **Unified Policy Registry**: A standardized, searchable directory of central and state welfare schemes.
2. **Deterministic Rule Engine**: A rule-based evaluation engine that computes legal qualification mathematically, ensuring predictable and reliable decisions.
3. **Evidence Verification Checklist**: Automated document requirements matching and text extraction.
4. **Explainable Citations**: Clear justifications citing official policy gazettes and statutory clauses.
5. **Centralized Application Tracking**: Instant tracking reference generation and status lifecycle tracking.

---

## 4. Core Features

### Currently Implemented Features

| Feature | Description | Implementation Status |
| :--- | :--- | :--- |
| **Landing Page** | Redesigned civic-tech landing page with hero composition, value propositions, 4-step workflow, real scheme highlights, deterministic flowchart, and universal footer. | ✅ Implemented |
| **Citizen Dashboard** | Overview hub displaying active scheme counts, eligible benefit totals, profile completion meter, quick actions, and recent activity widgets. | ✅ Implemented |
| **Citizen Demographic Profile** | Structured 4-section profile editor (Personal, Financial, Location, Social & Welfare status) with dynamic completion percentage calculation. | ✅ Implemented |
| **Scheme Discovery Catalog** | Filterable and searchable catalog with category pills (Agriculture, Health, Housing, Education, Business, Social Security), state filters, and benefit caps. | ✅ Implemented |
| **Scheme Details Deep-Dive** | Detailed scheme inspection view showing policy objectives, statutory rule tables, benefit calculations, official gazette links, and evidence checklists. | ✅ Implemented |
| **Deterministic Rule Engine** | Boolean and comparison evaluator (`==`, `!=`, `>`, `<`, `>=`, `<=`, `IN`, `NOT_IN`) testing profile attributes against statutory conditions. | ✅ Implemented |
| **Four Eligibility States** | Categorizes results into `ELIGIBLE`, `POTENTIALLY_ELIGIBLE` (missing document), `INELIGIBLE`, and `INSUFFICIENT_INFORMATION`. | ✅ Implemented |
| **Explainable Audit Results** | Rule-by-rule breakdown showing satisfied criteria, failed criteria, missing documents, entitled benefits, and official citations. | ✅ Implemented |
| **Application Tracking** | One-click application submission with auto-generated tracking references (e.g. `APP-2026-XXXXX`) and workflow lifecycle status. | ✅ Implemented |
| **Document Evidence Vault** | Upload vault for PDFs and images (Aadhaar, Income Certificate, Ration Card, etc.) with file parsing and text extraction. | ✅ Implemented |
| **Grounded AI / RAG Module** | Grounded explanation generator using curated official gazette clauses (`ai_data/scheme_knowledge_base.json`) with citation synthesis. | ✅ Implemented |
| **Authentication & Security** | Salted Bcrypt password hashing, stateless 24-hour JWT tokens, and CORS security. | ✅ Implemented |

### Planned / Future Features

- **Direct DigiLocker Integration**: Direct citizen credential pulling for instant document verification.
- **Official Umang / State API Integration**: Real-time two-way synchronization with official government application portals.
- **Multilingual Vernacular Support**: Native UI and explanations in Hindi, Tamil, Telugu, Bengali, and Marathi.
- **Automated SMS & WhatsApp Alerts**: Notification alerts when new schemes matching citizen profiles are gazetted.

---

## 5. Technology Stack

### Frontend
- **Framework**: React 19 (SPA)
- **Tooling & Build**: Vite 8
- **Routing**: React Router DOM (v7)
- **Styling**: Tailwind CSS (Civic-tech palette: Forest Green `#173B32` / `#246B55`, Warm Cream `#F7F5EF`, Saffron Gold `#D9A441`)
- **Icons**: Lucide React
- **HTTP Client**: Axios with JWT interceptors
- **State Management**: React Context API (`AuthContext`)

### Backend
- **Framework**: FastAPI (Python 3.13)
- **ASGI Server**: Uvicorn
- **ORM & Database Toolkit**: SQLAlchemy 2.0
- **Database Drivers**: `pymysql`, `cryptography` (for MySQL 8.0)
- **Data Validation & Schemas**: Pydantic v2 & `pydantic-settings`
- **Security & Crypto**: `bcrypt`, `pyjwt` (HS256)
- **Document Processing**: `pypdf`, `python-multipart`
- **Test Suite**: `pytest`, `pytest-asyncio`

### Database
- **Primary Database**: MySQL 8.0 (configured via `DATABASE_URL=mysql+pymysql://user:password@localhost:3306/financial_policy`)
- **Local Fallback**: SQLite (`sqlite:///./financial_policy.db`) for zero-configuration local development

---

## 6. System Architecture

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

### Eligibility Evaluation Flow

1. Citizen updates demographic and financial parameters in **Profile**.
2. Citizen triggers **Eligibility Checker** for all schemes or a specific scheme.
3. Backend fetches scheme rules and tests each condition against profile fields:
   - Evaluates numeric comparisons (Income $\le$ threshold, Age $\ge$ min_age, Land $\le$ max_acres).
   - Evaluates categorical comparisons (State match, Occupation match, Social category match).
   - Evaluates mandatory evidence document presence in citizen's vault.
4. If all statutory rules pass and all documents exist $\rightarrow$ **`ELIGIBLE`**.
5. If rules pass but mandatory documents are pending $\rightarrow$ **`POTENTIALLY_ELIGIBLE`**.
6. If any mandatory statutory rule fails $\rightarrow$ **`INELIGIBLE`**.
7. If required profile parameters are blank $\rightarrow$ **`INSUFFICIENT_INFORMATION`**.
8. Citizen reviews detailed audit result, official citations, and clicks **Apply** to generate a tracking reference.

---

## 7. Database Models & Schema

| Table Name | Model Class | Key Fields & Purpose |
| :--- | :--- | :--- |
| `users` | `User` | `id`, `email`, `hashed_password`, `full_name`, `role`, `is_active`, `created_at`. Citizen credentials and account state. |
| `profiles` | `Profile` | `id`, `user_id`, `age`, `gender`, `annual_income`, `state`, `occupation`, `caste_category`, `disability_status`, `marital_status`, `land_ownership_acres`, `has_ration_card`, `has_bpl_card`, `is_student`, `is_senior_citizen`, `is_minority`. |
| `schemes` | `Scheme` | `id`, `name`, `code`, `category`, `description`, `benefit_description`, `max_benefit_amount`, `state_applicability`, `target_users`, `ministry`, `official_source_url`, `required_documents`, `application_steps`. |
| `eligibility_rules` | `EligibilityRule` | `id`, `scheme_id`, `field_name`, `operator`, `expected_value`, `is_mandatory`, `error_message`, `source_section`. |
| `documents` | `Document` | `id`, `user_id`, `document_type`, `file_name`, `file_path`, `file_size`, `extracted_text`, `uploaded_at`. |
| `eligibility_results` | `EligibilityResult` | `id`, `user_id`, `scheme_id`, `status`, `estimated_benefit`, `explanation`, `passed_criteria`, `failed_criteria`, `missing_information`, `checked_at`. |
| `applications` | `Application` | `id`, `user_id`, `scheme_id`, `scheme_name`, `application_reference`, `status`, `notes`, `created_at`. |

---

## 8. Implemented API Endpoints

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Create citizen account with full name, email, password.
- `POST /api/auth/login` — Authenticate and receive JWT access token.
- `GET /api/auth/me` — Fetch currently authenticated citizen.

### Profile (`/api/profile`)
- `GET /api/profile` — Retrieve citizen criteria profile.
- `PUT /api/profile` — Update demographic, financial, and welfare attributes.

### Schemes (`/api/schemes`)
- `GET /api/schemes` — List active welfare schemes with search, category, and state query filters.
- `GET /api/schemes/{scheme_id}` — Retrieve detailed scheme data with statutory rule relations.

### Deterministic Eligibility (`/api/eligibility`)
- `POST /api/eligibility/check` — Run rule engine against profile for all schemes or a specified `scheme_id`.
- `GET /api/eligibility/results` — Fetch past audit evaluations for authenticated citizen.

### Document Evidence Vault (`/api/documents`)
- `GET /api/documents` — List uploaded evidence documents for citizen.
- `POST /api/documents/upload` — Multipart upload for PDF/JPG/PNG files with automated text parsing.
- `DELETE /api/documents/{doc_id}` — Remove uploaded document.

### Application Tracking (`/api/applications`)
- `GET /api/applications` — List citizen submitted scheme applications.
- `POST /api/applications` — Submit application and generate tracking code (e.g. `APP-2026-XXXXX`).

### AI & Policy Explainability (`/api/ai`)
- `POST /api/ai/explain` — Generate grounded policy explanation citing official gazettes for a given eligibility evaluation.
- `POST /api/ai/recommend` — Recommend relevant welfare initiatives matching profile criteria.

### System Health
- `GET /api/health` — System status, database health, and active rule engine mode.
- `GET /` — API root welcoming message and Swagger docs link.

---

## 9. Deterministic Eligibility Engine

Eligibility evaluation is 100% rule-based and deterministic:
- **Age Bounds**: Validates whether citizen age satisfies statutory brackets (e.g. $18 \le \text{age} \le 70$).
- **Income Thresholds**: Tests whether household annual income is within legal ceilings (e.g. $\text{income} \le 180,000$).
- **Landholding Limits**: Checks agricultural land holding in acres (e.g. $\text{land} \le 2.0$ for small/marginal farmers).
- **State Jurisdiction**: Checks whether scheme is `All India` or matches citizen domicile state.
- **Occupation & Social Category**: Matches occupation and caste category with statutory beneficiary groups.
- **Document Cross-Validation**: Validates that all required proof types exist in citizen's uploaded document vault.

---

## 10. Folder Structure

```text
financial-policy-assistant/
│
├── backend/
│   ├── app/
│   │   ├── api/                     # REST route controllers
│   │   │   ├── auth.py              # Register, Login, Me
│   │   │   ├── profile.py           # Get & Update profile
│   │   │   ├── schemes.py           # List & Detail schemes
│   │   │   ├── eligibility.py       # Deterministic check & results
│   │   │   ├── documents.py         # Multipart upload & parsing
│   │   │   ├── applications.py      # Tracking & submission
│   │   │   ├── ai.py                # Grounded explanations & citations
│   │   │   └── deps.py              # JWT auth, bcrypt, DB session
│   │   │
│   │   ├── models/                  # SQLAlchemy ORM database models
│   │   │   ├── user.py              # Citizen accounts
│   │   │   ├── profile.py           # Demographics & financial attributes
│   │   │   ├── scheme.py            # Welfare policies
│   │   │   ├── eligibility_rule.py  # Statutory rules
│   │   │   ├── document.py          # Uploaded evidence
│   │   │   ├── eligibility_result.py# Evaluation audits
│   │   │   └── application.py       # Tracked applications
│   │   │
│   │   ├── schemas/                 # Pydantic validation schemas
│   │   │   ├── auth.py
│   │   │   ├── profile.py
│   │   │   ├── scheme.py
│   │   │   ├── rule.py
│   │   │   ├── document.py
│   │   │   ├── eligibility.py
│   │   │   └── application.py
│   │   │
│   │   ├── rule_engine/             # Deterministic evaluation engine
│   │   │   └── engine.py            # Comparison operators & status evaluator
│   │   │
│   │   ├── ai/                      # Grounded RAG explainability module
│   │   │   ├── document_extractor.py# PDF text extractor
│   │   │   ├── embeddings.py        # Offline vector service
│   │   │   ├── retriever.py         # Knowledge base retriever
│   │   │   ├── rag_pipeline.py      # Gazette indexing
│   │   │   └── llm_service.py       # Grounded justification generator
│   │   │
│   │   ├── config.py                # Environment & settings parser
│   │   ├── database.py              # SQLAlchemy engine & session maker
│   │   └── main.py                  # FastAPI application entrypoint
│   │
│   ├── seed/
│   │   └── seed_data.py             # Prepopulates demo citizen & 8+ schemes
│   │
│   ├── tests/                       # Pytest test suite
│   │   ├── test_auth.py
│   │   ├── test_api.py
│   │   └── test_rule_engine.py
│   │
│   ├── requirements.txt             # Python dependencies (FastAPI, SQLAlchemy, PyMySQL)
│   ├── .env.example                 # Environment configuration template
│   └── pytest.ini                   # Pytest configuration
│
├── frontend/
│   ├── src/
│   │   ├── components/              # Reusable UI components
│   │   │   ├── Navbar.jsx           # Universal top navigation
│   │   │   ├── Footer.jsx           # Universal civic-tech footer
│   │   │   ├── Sidebar.jsx          # Protected app sidebar
│   │   │   ├── Layout.jsx           # Protected route layout
│   │   │   ├── StatusBadge.jsx      # High-contrast eligibility badges
│   │   │   ├── StatCard.jsx         # Metric summary cards
│   │   │   ├── LoadingSpinner.jsx   # State loaders
│   │   │   └── ProtectedRoute.jsx   # Auth route guard
│   │   │
│   │   ├── pages/                   # Application views
│   │   │   ├── LandingPage.jsx      # Redesigned civic-tech landing page
│   │   │   ├── LoginPage.jsx        # Login & demo auto-fill
│   │   │   ├── RegisterPage.jsx     # Citizen registration
│   │   │   ├── DashboardPage.jsx    # Metric overview & quick actions
│   │   │   ├── ProfilePage.jsx      # Demographic & criteria editor
│   │   │   ├── SchemeDiscoveryPage.jsx # Filterable scheme catalog
│   │   │   ├── SchemeDetailsPage.jsx# Policy inspection & rules table
│   │   │   ├── EligibilityCheckerPage.jsx # Evaluation wizard
│   │   │   ├── EligibilityResultsPage.jsx # Audit breakdown & Apply action
│   │   │   ├── DocumentUploadPage.jsx # Evidence vault & file manager
│   │   │   ├── ApplicationsPage.jsx # Submission tracking & reference IDs
│   │   │   └── SettingsPage.jsx     # Security & system preferences
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx      # JWT auth state provider
│   │   │
│   │   ├── services/                # Axios API services
│   │   │   ├── api.js
│   │   │   ├── authService.js
│   │   │   ├── profileService.js
│   │   │   ├── schemeService.js
│   │   │   ├── eligibilityService.js
│   │   │   ├── documentService.js
│   │   │   ├── applicationService.js
│   │   │   └── aiService.js
│   │   │
│   │   ├── App.jsx                  # Route definitions
│   │   ├── main.jsx                 # React root entrypoint
│   │   └── index.css                # Base styling & Tailwind directives
│   │
│   ├── public/                      # Static assets
│   ├── package.json                 # Frontend dependencies
│   ├── tailwind.config.js           # Civic-tech theme tokens
│   └── vite.config.js               # Vite config & API proxy
│
├── ai_data/
│   └── scheme_knowledge_base.json   # Curated official government gazettes
│
├── docs/
│   └── PROJECT_DOCUMENTATION.md     # Full architectural documentation
│
├── .env.example
├── .gitignore
└── README.md
```

---

## 11. Running the Project Locally (Windows PowerShell)

### Prerequisites
- Python 3.10+
- Node.js 18+ and npm
- (Optional) MySQL 8.0 server (or use automatic local SQLite fallback)

### Step 1: Start Backend

Open PowerShell in the project directory:

```powershell
cd backend
# Activate virtual environment
.\venv\Scripts\Activate.ps1
# (Optional) Seed demo user & schemes if database is clean
python seed/seed_data.py
# Start FastAPI backend server
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```

- **Backend API:** [http://127.0.0.1:8000](http://127.0.0.1:8000)
- **Interactive Swagger Docs:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### Step 2: Start Frontend

Open a second PowerShell window in the project directory:

```powershell
cd frontend
# Install dependencies (if not already installed)
npm install
# Start Vite development server
npm run dev
```

- **Frontend App:** [http://localhost:5173](http://localhost:5173)

### Demo Evaluator Credentials
- **Email:** `demo@example.com`
- **Password:** `DemoPassword123!`

---

## 12. Verification & Testing

Run the automated backend test suite:

```powershell
cd backend
pytest -v
```

All 8 unit and integration tests covering authentication, deterministic rule evaluation, scheme retrieval, and application submission pass successfully.
