# FinAI API Reference

All requests and responses use JSON (`application/json`). API routes are defined under `/api/*`.

---

## 1. Authentication Endpoints

### `POST /api/auth/signup`
Creates a new user account with hashed password and associated financial profile.
- **Request Body:**
  ```json
  {
    "name": "Aarav Sharma",
    "email": "aarav@example.com",
    "password": "securepassword123",
    "monthlyIncome": 85000,
    "monthlyExpenses": 32000,
    "existingEmi": 8000,
    "savings": 180000,
    "creditScore": 780
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "user": { "id": "...", "name": "Aarav Sharma", "email": "aarav@example.com", "role": "user" },
    "token": "..."
  }
  ```

### `POST /api/auth/login`
Authenticates credentials and issues an HTTP-only JWT cookie.
- **Request Body:**
  ```json
  {
    "email": "demo@finai.com",
    "password": "demo123"
  }
  ```

### `GET /api/auth/me`
Retrieves current session user, profile, active goals, and latest budget.

---

## 2. Financial Calculation Endpoints

### `POST /api/emi/calculate`
Calculates deterministic monthly EMI, total interest, total repayment, and 12-month amortization preview.
- **Request Body:**
  ```json
  {
    "principal": 2500000,
    "annualRate": 8.5,
    "tenureMonths": 240
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "result": {
      "monthlyEmi": 21696,
      "totalPrincipal": 2500000,
      "totalInterest": 2707040,
      "totalRepayment": 5207040,
      "principalPercent": 48.01,
      "interestPercent": 51.99,
      "amortizationPreview": [ ... ]
    }
  }
  ```

### `POST /api/loan/analyze`
Evaluates requested loan against database eligibility rules and produces explainable decision factors.
- **Request Body:**
  ```json
  {
    "monthlyIncome": 85000,
    "monthlyExpenses": 32000,
    "existingEmi": 8000,
    "requestedLoan": 2500000,
    "annualRate": 8.5,
    "tenureMonths": 240,
    "creditScore": 780
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "result": {
      "status": "Estimated within configured criteria",
      "statusBadge": "success",
      "monthlyEmi": 21696,
      "totalEmiBurden": 29696,
      "existingFOIR": 0.09,
      "newFOIR": 0.35,
      "disposableIncomeAfter": 23304,
      "maxAffordableLoan": 3982415,
      "positiveFactors": [ ... ],
      "attentionFactors": [ ... ],
      "ruleVersion": "v1.2.0-finai"
    }
  }
  ```

### `POST /api/stress-test`
Executes multi-scenario macroeconomic stress testing.

---

## 3. AI Service Endpoints

### `POST /api/ai/chat`
Conversational endpoint grounded with the user's financial profile.
- **Request Body:**
  ```json
  {
    "query": "Can I afford this loan under current assumptions?",
    "profile": { ... },
    "affordability": { ... }
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "response": {
      "summary": "...",
      "insights": [ "..." ],
      "considerations": [ "..." ],
      "disclaimer": "..."
    }
  }
  ```

---

## 4. Admin & Governance Endpoints

- `GET /api/admin/analytics`: Retrieves system health, user counts, calculation metrics, and recent audit logs.
- `GET /api/admin/rules`: Fetches active eligibility rule version and historical versions.
- `POST /api/admin/rules`: Publishes a new versioned eligibility rule configuration.
- `GET /api/export`: Downloads CSV report summarizing user financial vitals.
