# FinAI Security & Privacy Controls

FinAI is designed following strict security and financial privacy guidelines:

## 1. Authentication & Session Security
- **Password Hashing:** Passwords are never stored in plain text. Passwords are salted and hashed using `bcryptjs` with an adaptive cost factor of 10.
- **JWT Signing:** Session tokens are signed using a 32-character secret key (`AUTH_SECRET`).
- **HTTP-Only Cookies:** Session tokens are transported in `httpOnly`, `sameSite: "lax"` cookies, protecting them against client-side XSS exfiltration.

## 2. Input Validation & Injection Defenses
- **Zod Schemas:** Every request payload is checked against strict Zod type constraints (e.g., non-negative principal, interest rates bounded between 0% and 100%, tenure between 1 and 600 months).
- **SQL Injection Prevention:** Database interactions are mediated exclusively through the Prisma ORM using parameterized queries.
- **XSS Protection:** React JSX automatically escapes dangerous markup. Raw HTML injection is completely prohibited.

## 3. Data Minimization & Privacy
- **No Sensitive Credential Storage:** FinAI **never** collects or stores net-banking passwords, UPI PINs, debit card numbers, CVVs, or government IDs.
- **No Credit Bureau Hard Pulls:** The Credit Score Analyzer uses self-reported score approximations, avoiding hard inquiries that lower borrower credit scores.
- **Document Sandbox:** Uploaded documents are processed in memory and validated against allowed MIME types (PDF, PNG, JPEG) with an 8MB cap. Uploaded files cannot execute code.

## 4. Audit Logging & Non-Repudiation
- The `AuditLog` table records security-relevant events (`LOGIN`, `PROFILE_UPDATE`, `RULE_UPDATED`, `AI_QUERY_DISPATCHED`).
- Sensitive fields like passwords and auth secrets are automatically redacted before audit persistence.
