# System Architecture

## Overview
The **Financial Policy Discovery & Eligibility Assistant** is engineered to bridge the accessibility gap between government welfare policies and eligible citizens.

```
+-------------------------------------------------------------------------+
|                                Frontend                                 |
|      (React, Vite, Tailwind CSS, React Router, Axios, Lucide Icons)     |
+------------------------------------+------------------------------------+
                                     |
                                REST API (JWT)
                                     |
+------------------------------------v------------------------------------+
|                             FastAPI Backend                             |
|                                                                         |
|  +---------------------+  +---------------------+  +-----------------+  |
|  | Authentication &    |  | Deterministic       |  | Modular AI &    |  |
|  | Profile Management  |  | Rule Engine         |  | RAG Subsystem   |  |
|  +---------------------+  +---------------------+  +-----------------+  |
|             |                        |                      |           |
|             |                        |                      |           |
|  +---------------------+  +---------------------+  +-----------------+  |
|  | Document Extractor  |  | Benefit Calculator  |  | Policy Embedder |  |
|  | (PDF / OCR Adapter) |  | & Guidance Engine   |  | & Retriever     |  |
|  +---------------------+  +---------------------+  +-----------------+  |
+------------------------------------+------------------------------------+
                                     |
                                SQLAlchemy
                                     |
+------------------------------------v------------------------------------+
|                         PostgreSQL / SQLite                             |
|  Users | Profiles | Schemes | EligibilityRules | Documents | Results    |
+-------------------------------------------------------------------------+
```

## Architectural Decoupling Principles
1. **Separation of Evaluation and Explanation**: The LLM NEVER determines whether a citizen is eligible. That decision is strictly computed by the deterministic rule engine.
2. **Explainability by Design**: Every decision output details passed rules, failed rules, missing information, and official policy citations.
3. **Pluggable Vector & AI Layer**: Operates deterministically offline without API keys, with simple toggle to switch to high-performance LLMs (Gemini / OpenAI).
