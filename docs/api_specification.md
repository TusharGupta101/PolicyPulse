# API Specification

## Authentication Endpoints
- `POST /api/auth/register`: Register new citizen account.
- `POST /api/auth/login`: Authenticate and issue JWT token.
- `GET /api/auth/me`: Retrieve current authenticated user profile.

## Profile Endpoints
- `GET /api/users/profile`: Fetch citizen socio-economic parameters.
- `PUT /api/users/profile`: Update citizen attributes (income, occupation, land holding, etc.).

## Schemes Catalog
- `GET /api/schemes`: Filter schemes by category, state, or search keywords.
- `GET /api/schemes/{id}`: Detailed view including operational rules and required documents.

## Deterministic Eligibility Engine
- `POST /api/eligibility/check`: Evaluates scheme rules against user profile and uploaded documents.
- `GET /api/eligibility/results`: Retrieves history of evaluations.
- `GET /api/eligibility/{id}`: Inspect single evaluation with criteria breakdown.

## Documents & Evidence
- `POST /api/documents/upload`: Multi-part upload for PDF/images with automatic text extraction.
- `GET /api/documents`: List user documents.
- `DELETE /api/documents/{id}`: Remove document.

## Applications
- `GET /api/applications`: List tracked scheme applications.
- `POST /api/applications`: Submit new application draft or tracking record.

## AI Endpoints
- `POST /api/ai/explain-eligibility`: Synthesizes grounded explanation with citations.
- `POST /api/ai/recommend-schemes`: Semantically matches schemes by demographic profile.
