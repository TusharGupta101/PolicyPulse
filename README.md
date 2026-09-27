# PolicyPulse

### Financial Policy Discovery & Eligibility Assistant

**Understand. Discover. Access.**

PolicyPulse is a full-stack civic-tech platform designed to make government welfare schemes easier to discover, understand, and access.

Citizens often struggle to find relevant government schemes and understand complex eligibility conditions. PolicyPulse provides a centralized platform where users can discover schemes, maintain their citizen profile, check eligibility using a deterministic rule engine, understand why they qualify or do not qualify, and track their applications.

---

## 🚀 Key Features

### 🔎 Government Scheme Discovery

* Browse available government welfare schemes
* Search schemes by keyword
* Filter schemes by category
* Filter by state where supported
* View scheme benefits and basic eligibility information
* View detailed scheme information

### 👤 Citizen Profile

Users can maintain their eligibility-related information, including:

* Personal information
* Age
* Annual income
* State/location
* Occupation
* Category
* Other supported welfare-related criteria

The profile also provides a profile-completion indicator.

### ⚖️ Deterministic Eligibility Engine

PolicyPulse uses a rule-based eligibility engine instead of allowing an AI model to make statutory eligibility decisions.

The engine evaluates profile information against defined scheme conditions such as:

* Age
* Income
* State
* Occupation
* Other supported eligibility criteria

The system provides an explainable result showing which conditions were satisfied or not satisfied.

### 📋 Eligibility Results

Users receive:

* Eligibility status
* Rule-by-rule evaluation
* Reasons for the result
* Relevant scheme information
* Available application action

### 📄 Document Management

The platform includes document-management functionality where implemented, allowing users to manage supporting evidence required for schemes.

### 📝 Application Tracking

Eligible users can proceed to application submission and track application information such as:

* Application/reference ID
* Scheme
* Submission date
* Application status

### 📊 Citizen Dashboard

The dashboard provides a central overview of:

* Available schemes
* Eligible schemes
* Applications
* Profile completion
* Quick actions
* Recent activity

---

# 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │       Citizen       │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   React Frontend    │
                    │      + Vite         │
                    └──────────┬──────────┘
                               │
                         HTTP / REST API
                               │
                               ▼
                    ┌─────────────────────┐
                    │    FastAPI Backend  │
                    │                     │
                    │  Scheme API         │
                    │  Eligibility Engine │
                    │  Application API    │
                    └──────────┬──────────┘
                               │
                          SQLAlchemy
                               │
                               ▼
                    ┌─────────────────────┐
                    │     MySQL 8.0       │
                    └─────────────────────┘
```

### Eligibility Flow

```text
Citizen Profile
       │
       ▼
Selected Scheme
       │
       ▼
Deterministic Rule Engine
       │
       ├── Age
       ├── Income
       ├── State
       ├── Occupation
       └── Other Rules
       │
       ▼
Eligibility Result
       │
       ▼
Explanation
       │
       ▼
Application
```

---

# 🛠️ Technology Stack

## Frontend

* React
* TypeScript / JavaScript
* Vite
* Tailwind CSS (where used)
* Lucide React
* Fetch / Axios (as implemented)

## Backend

* Python
* FastAPI
* Uvicorn
* SQLAlchemy
* Pydantic

## Database

* MySQL 8.0
* PyMySQL

## Testing

* Pytest
* Frontend production build verification

---

# 🎨 Design System

PolicyPulse uses a civic-tech inspired visual identity rather than a generic SaaS blue theme.

| Purpose           | Color     |
| ----------------- | --------- |
| Deep Forest Green | `#173B32` |
| Primary Green     | `#246B55` |
| Warm Cream        | `#F7F5EF` |
| Saffron Gold      | `#D9A441` |
| White             | `#FFFFFF` |
| Warm Border       | `#E5E0D8` |

The design focuses on:

* Accessibility
* Clear information hierarchy
* Trust
* Simplicity
* Government/public-service usability
* Responsive design

---

# 📁 Project Structure

```text
PolicyPulse/
│
├── README.md
├── .gitignore
│
├── docs/
│   └── PROJECT_DOCUMENTATION.md
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   ├── services/
│   │   └── main.py
│   │
│   ├── requirements.txt
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── assets/
    │   ├── App.*
    │   └── main.*
    │
    ├── public/
    ├── package.json
    └── vite.config.*
```

> The exact file extensions and structure may vary slightly depending on the current implementation.

---

# ⚙️ Local Setup

## Prerequisites

Install:

* Python 3.13
* Node.js
* npm
* MySQL 8.0
* Git

Docker is **not required**.

---

# 🗄️ Database Setup

Create a MySQL database:

```sql
CREATE DATABASE policypulse;
```

Configure the backend environment.

Create:

```text
backend/.env
```

Example:

```env
DATABASE_URL=mysql+pymysql://root:YOUR_PASSWORD@localhost:3306/policypulse
```

> Never commit `.env` to GitHub.

Use `.env.example` as the template.

---

# 🔧 Backend Setup

Open PowerShell:

```powershell
cd backend
```

Create a virtual environment:

```powershell
python -m venv venv
```

Activate it:

```powershell
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```powershell
pip install -r requirements.txt
```

Start the backend:

```powershell
uvicorn app.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

Swagger API documentation:

```text
http://127.0.0.1:8000/docs
```

---

# 💻 Frontend Setup

Open a second PowerShell terminal:

```powershell
cd frontend
```

Install dependencies:

```powershell
npm install
```

Start the development server:

```powershell
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

# 🔌 API

Important API endpoints currently include:

| Method | Endpoint                                          | Purpose           |
| ------ | ------------------------------------------------- | ----------------- |
| GET    | `/`                                               | API status        |
| GET    | `/api/health`                                     | Health check      |
| GET    | `/api/schemes`                                    | Retrieve schemes  |
| POST   | `/api/eligibility/check/{scheme_id}/{profile_id}` | Check eligibility |

Additional endpoints may be available depending on the current implementation.

Complete API documentation is available through FastAPI Swagger:

```text
http://127.0.0.1:8000/docs
```

---

# 🧪 Testing

Run backend tests:

```powershell
pytest
```

Build the frontend:

```powershell
npm run build
```

Before deployment, verify:

```text
Landing Page
     ↓
Dashboard
     ↓
Profile
     ↓
Scheme Discovery
     ↓
Search / Filter
     ↓
Scheme Details
     ↓
Check Eligibility
     ↓
Eligibility Results
     ↓
Apply
     ↓
Application Tracking
```

---

# 🔐 Security

Sensitive configuration must not be committed to GitHub.

The following should remain local:

```text
.env
venv/
node_modules/
```

Never commit:

* Database passwords
* JWT secrets
* API keys
* Access tokens
* Personal credentials

Use:

```text
.env.example
```

for configuration templates.

---

# 👥 Team Development

PolicyPulse is developed collaboratively using GitHub.

Recommended workflow:

```text
Feature Branch
      ↓
Development
      ↓
Commit
      ↓
Push
      ↓
Pull Request
      ↓
Code Review
      ↓
Merge into main
```

Example branches:

```text
main

feature/frontend-ui
feature/backend-api
feature/testing-docs
feature/integration
```

Team members should avoid directly modifying `main`.

---

# 🚀 Deployment

The frontend can be deployed using a platform such as Netlify.

The production architecture is:

```text
                Internet
                   │
          ┌────────┴────────┐
          │                 │
          ▼                 ▼
       Netlify          Backend Host
       Frontend           FastAPI
          │                 │
          └────────┬────────┘
                   │
                   ▼
                Database
                  MySQL
```

The frontend should use an environment variable for the backend API URL instead of hardcoding `localhost`.

Example:

```env
VITE_API_URL=https://your-backend-domain.example
```

For local development:

```env
VITE_API_URL=http://127.0.0.1:8000
```

---

# 📌 Current Implementation

The current project focuses on the core citizen workflow:

* Government scheme discovery
* Citizen profile
* Search and filtering
* Scheme details
* Deterministic eligibility evaluation
* Explainable eligibility results
* Application tracking
* Civic-tech user interface
* MySQL database
* FastAPI backend
* React/Vite frontend

---

# 🔮 Future Scope

Potential future improvements include:

* DigiLocker integration
* UMANG/state portal integration
* Multilingual Indian-language support
* Advanced OCR and document verification
* Grounded RAG-based policy explanations
* AI policy assistant
* Automated benefit calculation
* Government API integrations
* Advanced authentication and identity verification
* Production-scale deployment
* Administrative dashboard
* More comprehensive central and state scheme coverage

These features should be treated as future enhancements unless they are already implemented in the current version.

---

# 🎯 Project Objective

PolicyPulse aims to make government welfare programs easier for citizens to discover and understand by combining:

**Citizen Profile + Government Schemes + Deterministic Eligibility + Explainable Results + Application Tracking**

The central principle is:

> **Use deterministic rules for eligibility decisions and AI only where it can safely assist with information and explanations.**

---

# 📄 Documentation

For detailed technical documentation, architecture, database models, API details, eligibility logic, and development information, see:

```text
docs/PROJECT_DOCUMENTATION.md
```

---

# 📜 License

This project was developed as an academic/hackathon project.

