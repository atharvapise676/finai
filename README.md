# FINAI — AI-Powered Financial Health & Loan Intelligence Platform

FinAI is a production-oriented, full-stack fintech platform designed to empower individuals with transparent, explainable financial intelligence, deterministic loan affordability analysis, credit evaluation, scenario stress testing, and budgeting guidance.

> **CRITICAL FINANCIAL EDUCATION NOTICE**  
> FinAI provides mathematical estimates and financial educational insights based on user-entered values and configured risk policies. FinAI **never** claims to guarantee loan approval or represent the underwriting authority of any regulated bank or financial institution.

---

## 🏛️ Core Architectural Principle

**Strict Separation of Deterministic Financial Mathematics from AI Reasoning.**

1. **Deterministic Application Layer (TypeScript):**  
   Every mathematical computation (Monthly EMI, Amortization Schedules, Fixed Obligation to Income Ratio (FOIR), Financial Health Indicator (0–100), Stress Resilience Scores, and Multi-Offer Comparisons) is calculated deterministically in verified TypeScript code.
2. **Claude AI Service Layer (Anthropic Claude 3.5 Sonnet / Haiku):**  
   AI is strictly reserved for qualitative synthesis, personalized education, risk trade-off interpretation, and conversational assistance. AI is **never** permitted to calculate numbers or make automated loan underwriting decisions.

---

## 🚀 Key Platform Features

### 1. User Authentication & 1-Click Demo Personas
- Secure session management with bcrypt password hashing and JWT token verification.
- **3 Pre-Loaded Realistic Demo Personas:**
  - **Aarav Sharma:** Prime Profile (₹85k/mo income, ₹8k EMI, 780 score, 82/100 health).
  - **Priya Patel:** Balanced Planner (₹60k/mo income, ₹5k EMI, 740 score, 74/100 health).
  - **Rohit Verma:** Stretched Debt Burden (₹45k/mo income, ₹18k EMI, 640 score, 52/100 health).

### 2. Financial Health Indicator (0 - 100)
Proprietary 5-pillar scoring algorithm with weighted factors:
- **Debt Burden (FOIR) [30% Weight]:** Measures total debt obligations against gross monthly income.
- **Savings Buffer [25% Weight]:** Computes liquid reserves relative to monthly essential burn rate.
- **Budget Discipline [20% Weight]:** Evaluates net monthly disposable surplus.
- **Credit Standing [15% Weight]:** Calibrates credit risk bracket percentiles.
- **Income Stability [10% Weight]:** Evaluates employment resilience and dependent obligations.

### 3. Explainable Loan Affordability Engine
- Evaluates loan requests against configurable risk ceilings (max 50% FOIR, min 650 credit score).
- **Explainable Factors Output:** Explicitly lists positive supporting factors (green checks) and attention risk factors (amber alerts).
- Computes post-loan disposable income and maximum affordable loan capacity.

### 4. Interactive EMI & What-If Loan Simulator
- Live sliders for Loan Principal (₹50k to ₹2Cr), Interest Rate (0% to 20%), and Tenure (1 to 30 yrs).
- Handles zero-interest loans seamlessly without division-by-zero errors.
- 12-month amortization preview table showing principal vs interest progression.
- **What-If Matrix:** Compares 5-year, 7-year, 10-year, 15-year, and 20-year tenures to expose the cumulative interest penalty of long tenures.

### 5. Multi-Offer Loan Comparison Suite
- Side-by-side comparison of up to 4 hypothetical loan offers.
- Incorporates processing fees, documentation charges, total cost of credit, and net total outflow.
- Sortable by Lowest Total Outflow, Lowest Monthly EMI, or Lowest Interest Rate.

### 6. Credit Score Analyzer
- Bureau score benchmark analysis (300 - 900 range) across 5 risk tiers (Exceptional to Poor).
- 4 key factor health cards (Payment History, Utilization, Account Age, Inquiries).
- Educational action steps to preserve credit standing.

### 7. 50/30/20 Budget Planner & Emergency Fund
- Visual cashflow allocation into Needs (50%), Wants (30%), and Savings/Debt (20%).
- Dedicated **Emergency Fund Calculator** (3 to 12 months essential burn target, gap analysis, and 12-month savings roadmap).

### 8. Macro Systemic Stress Testing
- Simulates recessionary downturns:
  - Income drop (-10% / -20%)
  - Inflation cost increase (+10% / +15%)
  - Floating interest rate spikes (+1.5% to +3.0%)
- Recalculates stressed FOIR, deficit warnings, and a 0–100 Stress Resilience Score.

### 9. Claude AI Financial Assistant
- Grounded conversational assistant with strict system prompt enforcement.
- Response validation schema requiring executive summary, bulleted insights, risk considerations, and compliance disclaimers.
- High-fidelity offline deterministic synthesis fallback when API key is unconfigured.

### 10. Document Statement Analyzer & Anomaly Scanner
- Simulates OCR field extraction for Salary Slips, Bank Statements, and Loan Sanctions.
- Allows user to verify extracted figures and sync them to their active profile.
- Scans transaction logs for unusual amount spikes and duplicate recurring subscription leaks.

### 11. Admin Governance Console & Audit Logging
- Telemetry dashboard (active users, calculations executed, system health).
- **Live Eligibility Rule Engine Editor:** Adjust minimum income, FOIR ceilings, and tenure limits with version tagging.
- Cryptographic audit trail logging logins, calculations, profile edits, and rule updates.

### 12. Multilingual Support & Export
- Instant language toggle for **English**, **Hindi (हिन्दी)**, and **Marathi (मराठी)**.
- One-click CSV and Google Sheets compatible financial summary export.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS |
| **UI Aesthetics** | Dark Glassmorphism, Plus Jakarta Sans, JetBrains Mono, Lucide Icons |
| **Backend** | Next.js Server Route Handlers, Node.js, TypeScript |
| **Database & ORM** | SQLite (zero-config local dev) / PostgreSQL (production), Prisma ORM |
| **AI Engine** | Anthropic Claude 3.5 Sonnet / Haiku with structured Zod response validation |
| **Validation** | Zod schema validation across all API endpoints |
| **Testing** | Vitest unit test suite for financial calculations |
| **Security** | bcryptjs password hashing, JWT session cookies, audit logging |

---

## 📦 Project Structure

```
finai/
├── app/                        # Next.js App Router Pages & API Endpoints
│   ├── api/                    # Clean REST API Route Handlers
│   │   ├── admin/              # Admin analytics and rule configuration
│   │   ├── ai/                 # Claude AI chat & insights routes
│   │   ├── auth/               # Sign in, sign up, logout, session
│   │   ├── budget/             # Monthly budget allocations
│   │   ├── credit/             # Credit score analysis
│   │   ├── documents/          # Document OCR extraction simulation
│   │   ├── emi/                # Deterministic EMI calculation
│   │   ├── export/             # CSV summary export
│   │   ├── financial-health/   # 5-pillar health score
│   │   ├── goals/              # Financial milestones
│   │   ├── loan/               # Affordability, simulate, compare
│   │   ├── profile/            # User profile management
│   │   ├── stress-test/        # Macro shock simulator
│   │   └── transactions/       # Anomaly & subscription leak detector
│   ├── affordability/          # Dedicated Affordability Suite
│   ├── admin/                  # Admin Governance Console
│   ├── assistant/              # Full-page AI Assistant
│   ├── budget/                 # Budget & Emergency Reserves
│   ├── calculator/             # EMI, What-If & Comparison
│   ├── dashboard/              # Main Financial Health Dashboard
│   ├── documents/              # Document Statement Analyzer
│   ├── goals/                  # Goals & Milestones
│   ├── methodology/            # Transparent Scoring Methodology
│   ├── stress-test/            # Systemic Stress Testing
│   ├── globals.css             # Dark Glassmorphism CSS design system
│   ├── layout.tsx              # Root Layout with Navigation & Providers
│   └── page.tsx                # Fintech SaaS Landing Page
├── components/                 # Reusable Fintech UI Components
├── context/                    # React Context (AuthContext)
├── docs/                       # Technical Architecture, API & Security Docs
├── lib/                        # Core Application Services & Engines
│   ├── ai-service.ts           # Claude AI integration & safety validation
│   ├── audit.ts                # Audit logging engine
│   ├── auth.ts                 # JWT & bcrypt authentication
│   ├── db.ts                   # Prisma database client singleton
│   ├── demo-data.ts            # Client-safe demo user personas
│   ├── export-utils.ts         # CSV & Google Sheets export builder
│   ├── financial-engine.ts     # Pure deterministic financial formulas
│   └── i18n.tsx                # English, Hindi & Marathi translations
├── prisma/
│   ├── schema.prisma           # Prisma database schema definition
│   └── seed.ts                 # Seed script with rules & demo profiles
├── tests/
│   └── financial-engine.test.ts# Vitest unit test suite (12 tests)
├── types/                      # Comprehensive TypeScript definitions
├── .env.example                # Example environment configuration
├── package.json                # Project dependencies and npm scripts
└── tailwind.config.ts          # Custom fintech color tokens & keyframes
```

---

## ⚡ Quick Start Guide

### Prerequisites
- Node.js (v18+ or v20+)
- npm or yarn

### 1. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Default `.env` configuration:
```env
# Local zero-config SQLite database (or set PostgreSQL URL)
DATABASE_URL="file:./dev.db"

# 32-character authentication secret
AUTH_SECRET="finai-super-secure-production-ready-secret-key-32chars"

# Optional: Anthropic Claude API Key (FinAI includes deterministic synthesis fallback if left blank)
ANTHROPIC_API_KEY=""

NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Initialize & Seed Database
```bash
# Push schema to SQLite/PostgreSQL
npx prisma db push

# Seed demo personas and default v1.2.0 risk rules
npm run prisma:seed # or npx tsx prisma/seed.ts
```

### 4. Run Unit Tests
```bash
npm test
```
*Expected: 12 passing tests across EMI, zero-interest, FOIR, health indicator, stress test, and comparisons.*

### 5. Launch Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🧪 Demo User Accounts

You can log in instantly using the **"Switch Demo Persona"** dropdown in the top navigation bar or the quick buttons on the sign-in modal:

| Persona | Income | Existing EMI | Credit Score | Health Tier |
|---|---|---|---|---|
| **Aarav Sharma** (`demo@finai.com` / `demo123`) | ₹85,000 | ₹8,000 | 780 | **Prime (82/100)** |
| **Priya Patel** (`priya@finai.com` / `demo123`) | ₹60,000 | ₹5,000 | 740 | **Strong (74/100)** |
| **Rohit Verma** (`rohit@finai.com` / `demo123`) | ₹45,000 | ₹18,000 | 640 | **Stretched (52/100)** |

---

## 🔒 Security & Privacy Architecture

- **Data Minimization:** FinAI never asks for or stores net banking passwords, OTPs, debit card PINs, CVV codes, or Aadhaar/PAN cards.
- **Local Isolation:** Calculations run locally and client-side where possible.
- **ORM Protection:** All database interactions use Prisma parameterized queries to prevent SQL injection.
- **Input Validation:** Every API route verifies payloads using strict Zod schemas before processing.
- **Audit Logging:** System actions (logins, rule revisions, calculations, AI calls) are logged with non-sensitive metadata for compliance tracking.

---

## 📜 Compliance Disclaimer

FinAI is a financial literacy, education, and decision-support platform. It does not provide underwriting authorization, credit broking services, or legally binding loan sanctions. Loan interest rates, fees, down payments, and approval criteria are subject to the policies of respective regulated financial institutions.
