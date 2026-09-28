# FinAI Database & Data Models

FinAI utilizes Prisma ORM with SQLite for out-of-the-box local development and PostgreSQL for production environments.

## 1. Entity-Relationship Overview

```
 [User] 1 ---- 1 [FinancialProfile]
   |
   +---- * [Budget] 1 ---- * [BudgetItem]
   +---- * [FinancialGoal]
   +---- * [Calculation]
   +---- * [AuditLog]
   +---- * [Notification]
   +---- * [AIConversation] 1 ---- * [AIMessage]

 [EligibilityRule] (Global Policy Versioning)
```

## 2. Models Detail

### `User`
Stores account authentication credentials, name, email, and user role (`user` | `admin`).

### `FinancialProfile`
Stores the user's active baseline financial inputs:
- `monthlyIncome`: Gross monthly inflow (₹)
- `monthlyExpenses`: Living expenditures (₹)
- `existingEmi`: Total ongoing debt repayments (₹)
- `savings`: Liquid savings (₹)
- `emergencyFund`: Dedicated liquid buffer (₹)
- `creditScore`: Score in 300–900 range
- `employmentType`: `salaried`, `self_employed`, `business`, or `freelancer`

### `EligibilityRule`
Enables dynamic rule versioning without hardcoding assumptions in application code:
- `ruleVersion`: e.g. `v1.2.0-finai`
- `minIncome`: Minimum monthly income threshold
- `maxFOIR`: Ceiling for debt-to-income ratio (default 0.50)
- `minCreditScore`: Benchmark minimum credit score (default 650)
- `maxMultiplier`: Maximum loan amount as a multiple of monthly income

### `AuditLog`
Records immutable system events with action code, metadata JSON snippet, and timestamps.

## 3. Switching to PostgreSQL in Production
To use PostgreSQL:
1. Update `datasource db` provider in `prisma/schema.prisma` from `"sqlite"` to `"postgresql"`.
2. Set `DATABASE_URL="postgresql://user:password@hostname:5432/finaidb?schema=public"` in `.env`.
3. Run `npx prisma db push` or `npx prisma migrate deploy`.
