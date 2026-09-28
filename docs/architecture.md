# FinAI System Architecture

## 1. High-Level Architectural Diagram

```
                      +------------------------------------------+
                      |               USER INTERFACE             |
                      |   Next.js 14 App Router + Tailwind CSS   |
                      |   (Dark Glassmorphic Component System)   |
                      +--------------------+---------------------+
                                           |
                                           v
                      +------------------------------------------+
                      |                API ROUTER                |
                      |  Zod Input Validation + Session Guard    |
                      +--------------------+---------------------+
                                           |
                    +----------------------+----------------------+
                    |                                             |
                    v                                             v
     +------------------------------+              +------------------------------+
     |   DETERMINISTIC MATH ENGINE  |              |        DATABASE LAYER        |
     |   - calculateEMI()           |              |  Prisma Client Singleton     |
     |   - calculateFOIR()          |              |  SQLite (Dev) / Postgres     |
     |   - calculateAffordability() |              +--------------+---------------+
     |   - calculateHealthScore()   |                             |
     |   - runStressTest()          |                             v
     |   - compareOffers()          |              +------------------------------+
     +--------------+---------------+              |        AUDIT LOGGER          |
                    |                              |  Compliance Action Stream    |
                    v                              +------------------------------+
     +------------------------------+
     |   STRUCTURED RESULTS OBJECT  |
     +--------------+---------------+
                    |
                    v
     +------------------------------+
     |       CLAUDE AI SERVICE      |
     |  System Prompt + JSON Schema |
     |  (Explanation & Synthesis)   |
     +------------------------------+
```

## 2. Layered Responsibilities

### 2.1 Presentation Layer (`/app`, `/components`, `/context`)
- Server Components provide fast static rendering of informational pages.
- Client Components manage interactive slider bindings, charts, language toggling, and demo persona switching.
- Tailwind CSS with custom glassmorphism design tokens (`.glass-panel`, `.glass-input`, `.fintech-bg`).

### 2.2 Security & Validation Layer (`/app/api/...`)
- Every API endpoint strictly validates incoming payloads using Zod schemas before touching business logic or the database.
- Sessions are verified using signed JWT tokens stored in HTTP-only cookies.

### 2.3 Financial Engine Layer (`lib/financial-engine.ts`)
- Pure, side-effect-free TypeScript mathematical functions.
- Independent of any LLM, database, or network dependency.
- Unit-tested with Vitest to guarantee zero division-by-zero errors or rounding anomalies.

### 2.4 AI Integration Layer (`lib/ai-service.ts`)
- Anthropic Claude 3.5 Sonnet / Haiku integration.
- Strict system prompt instructs the model to act solely as a financial educator.
- Responses must conform to `{ summary, insights, considerations, disclaimer }`.
- Deterministic fallback synthesis ensures full offline and development-mode functionality without requiring an active API key.
