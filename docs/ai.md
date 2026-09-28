# FinAI Artificial Intelligence Architecture

## 1. Core Philosophy
Claude AI is integrated as an educational and interpretive reasoning layer, completely separated from mathematical operations.

## 2. Guardrails & System Prompt
The system prompt explicitly commands the AI to:
- Act strictly as FinAI's financial education assistant.
- Use only the deterministic metrics provided in the request context.
- Never invent numbers, calculate interest rates, or project exact credit scores.
- Never guarantee loan approvals or claim to represent any bank or underwriter.
- Never request sensitive credentials (passwords, OTPs, PINs, card numbers).
- Distinguish objective calculations from subjective interpretations.

## 3. Strict Response Schema Validation
All Claude API responses are parsed and validated against this Zod schema:
```typescript
{
  summary: z.string().min(10).max(500),
  insights: z.array(z.string()).min(1).max(8),
  considerations: z.array(z.string()).min(1).max(6),
  disclaimer: z.string().min(20),
}
```
If an AI response deviates from this format or fails schema validation, the application automatically falls back to deterministic local synthesis.

## 4. Development & Offline Mock Fallback
FinAI includes `generateLocalFinancialInsights()`. When `ANTHROPIC_API_KEY` is not present, the platform seamlessly synthesizes structured educational summaries based on the user's FOIR, savings ratio, and disposable income.
