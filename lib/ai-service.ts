import { z } from "zod";
import { AIAnalysisResponse, UserFinancialProfile, AffordabilityResult, FinancialHealthScore } from "@/types";

export const FINAI_SYSTEM_PROMPT = `You are FinAI's financial education assistant.
Use ONLY the financial information and calculated values supplied by the application.
Do NOT calculate or invent numbers, interest amounts, or percentages.
Do NOT guarantee loan approval or represent underwriting decisions of any bank or lender.
Do NOT claim to represent a bank, lender, regulator, credit bureau, or financial institution.
Do NOT request passwords, OTPs, PINs, CVV numbers, authentication codes, or other highly sensitive credentials.
Clearly distinguish calculations from interpretations.
When discussing loan affordability, describe results as estimates based on configured assumptions.
When discussing credit scores, explain that scoring models and lender policies vary.
Do not provide fabricated interest rates, fees, regulations, or lender policies.
Use simple, clear language.
When uncertainty exists, explicitly state it.
Prioritize transparency, educational empowerment, and user financial health.

You must respond with valid JSON strictly matching this schema:
{
  "summary": "1-2 sentence executive overview summarizing the calculated financial position",
  "insights": ["3-5 clear, positive or educational analytical points grounded in the data"],
  "considerations": ["2-3 prudent risk considerations, buffer warnings, or suggestions"],
  "disclaimer": "Mandatory standard compliance disclaimer stating that FinAI provides estimates for educational purposes and is not a loan underwriting authority"
}`;

export const AIResponseSchema = z.object({
  summary: z.string().min(10).max(500),
  insights: z.array(z.string()).min(1).max(8),
  considerations: z.array(z.string()).min(1).max(6),
  disclaimer: z.string().min(20),
});

/**
 * Deterministic Financial Synthesis Fallback
 * Used when ANTHROPIC_API_KEY is not configured or in development/offline modes.
 * Generates structured, deterministic financial insights based strictly on user metrics.
 */
export function generateLocalFinancialInsights(context: {
  profile?: Partial<UserFinancialProfile>;
  affordability?: Partial<AffordabilityResult>;
  health?: Partial<FinancialHealthScore>;
  query?: string;
}): AIAnalysisResponse {
  const profile = context.profile;
  const affordability = context.affordability;
  const health = context.health;
  const query = context.query?.toLowerCase() || "";

  const insights: string[] = [];
  const considerations: string[] = [];

  let summary = "FinAI has analyzed your calculated financial metrics against configured risk parameters.";

  if (affordability) {
    summary = `Your loan evaluation is currently categorized as "${affordability.status}". Estimated EMI is ₹${affordability.monthlyEmi?.toLocaleString()} with a post-loan FOIR of ${Math.round((affordability.newFOIR || 0) * 100)}%.`;

    if ((affordability.newFOIR || 0) <= 0.40) {
      insights.push(`Your debt burden (${Math.round((affordability.newFOIR || 0) * 100)}% FOIR) remains within prudent limits, preserving monthly liquidity.`);
    } else {
      considerations.push(`A debt-to-income ratio of ${Math.round((affordability.newFOIR || 0) * 100)}% places significant demand on your monthly cashflow.`);
    }

    if ((affordability.disposableIncomeAfter || 0) > 15000) {
      insights.push(`Projected disposable surplus of ₹${affordability.disposableIncomeAfter?.toLocaleString()} allows continued contributions to emergency savings.`);
    } else {
      considerations.push(`Tight disposable income (₹${affordability.disposableIncomeAfter?.toLocaleString()}) limits capacity to absorb sudden healthcare or living cost spikes.`);
    }
  }

  if (health) {
    insights.push(`Your Financial Health Indicator score is ${health.overallScore}/100 (${health.tier} Tier), supported by your ${health.pillars?.debtBurden?.metric || "debt profile"}.`);
    if (health.pillars?.savingsBuffer?.score && health.pillars.savingsBuffer.score < 60) {
      considerations.push("Liquid reserves are below the 3 to 6-month benchmark. Prioritize building an emergency buffer before taking on new long-term debt.");
    }
  }

  if (profile?.creditScore) {
    if (profile.creditScore >= 750) {
      insights.push(`Your credit score of ${profile.creditScore} is prime, which typically qualifies for competitive rate brackets.`);
    } else {
      considerations.push(`A credit score of ${profile.creditScore} may lead lenders to request additional documentation or risk-adjusted pricing.`);
    }
  }

  // Address specific user query themes
  if (query.includes("tenure") || query.includes("duration")) {
    insights.push("Extending loan tenure reduces monthly EMI payments but substantially inflates total cumulative interest paid over the life of the loan.");
  }
  if (query.includes("afford") || query.includes("can i")) {
    insights.push("Affordability depends on maintaining consistent income, keeping total debt service under 45% of income, and preserving a 6-month emergency reserve.");
  }
  if (query.includes("interest") || query.includes("rate")) {
    considerations.push("If opting for a floating rate loan, stress-test your repayment capacity against potential 1.5% to 2.5% rate hike cycles.");
  }

  // Fallbacks if lists are brief
  if (insights.length < 2) {
    insights.push("Regularly tracking fixed obligations versus variable living expenses ensures steady progress toward long-term financial security.");
    insights.push("Maintaining debt payments below 35% of net income provides the highest resilience against economic uncertainties.");
  }
  if (considerations.length < 1) {
    considerations.push("Ensure your emergency fund is insulated in high-liquidity instruments rather than locked in long-term commitments.");
  }

  return {
    summary,
    insights,
    considerations,
    disclaimer:
      "FinAI provides educational explanations and estimates based on user-entered values and deterministic models. FinAI does not represent any lender, guarantee loan approvals, or provide legal or tax advice. Actual underwriting criteria differ across banks and NBFCs.",
    isMock: !process.env.ANTHROPIC_API_KEY,
  };
}

/**
 * Call Anthropic Claude API with Structured Output & Strict Safety Controls
 */
export async function queryClaudeAI(context: {
  profile?: Partial<UserFinancialProfile>;
  affordability?: Partial<AffordabilityResult>;
  health?: Partial<FinancialHealthScore>;
  query: string;
}): Promise<AIAnalysisResponse> {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  // Use local deterministic financial synthesis if no API key is provided
  if (!apiKey || apiKey.trim() === "" || apiKey === "sk-ant-api-...") {
    return generateLocalFinancialInsights(context);
  }

  try {
    const userPrompt = `
Here is the user's structured financial profile and deterministic calculations:
Profile:
- Monthly Income: ₹${context.profile?.monthlyIncome || "N/A"}
- Monthly Expenses: ₹${context.profile?.monthlyExpenses || "N/A"}
- Existing EMI: ₹${context.profile?.existingEmi || "N/A"}
- Liquid Savings: ₹${context.profile?.savings || "N/A"}
- Credit Score: ${context.profile?.creditScore || "N/A"}
- Employment Type: ${context.profile?.employmentType || "N/A"}

Calculations (Computed deterministically):
${context.affordability ? `
- Affordability Status: ${context.affordability.status}
- New Loan EMI: ₹${context.affordability.monthlyEmi}
- Total Monthly EMI: ₹${context.affordability.totalEmiBurden}
- Pre-Loan FOIR: ${Math.round((context.affordability.existingFOIR || 0) * 100)}%
- Post-Loan FOIR: ${Math.round((context.affordability.newFOIR || 0) * 100)}%
- Post-Loan Disposable Income: ₹${context.affordability.disposableIncomeAfter}
` : "No active loan calculation."}

${context.health ? `
- Financial Health Score: ${context.health.overallScore}/100 (${context.health.tier})
` : ""}

User Question: "${context.query}"

Provide an educational, objective explanation of these calculations in valid JSON format.`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1000,
        system: FINAI_SYSTEM_PROMPT,
        messages: [{ role: "user", content: userPrompt }],
        temperature: 0.2, // Low temperature for deterministic, factual consistency
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`Claude API error status: ${response.status}. Falling back to deterministic synthesis.`);
      return generateLocalFinancialInsights(context);
    }

    const data = await response.json();
    const content = data.content?.[0]?.text;

    if (!content) {
      return generateLocalFinancialInsights(context);
    }

    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return generateLocalFinancialInsights(context);
    }

    const parsed = JSON.parse(jsonMatch[0]);
    const validated = AIResponseSchema.safeParse(parsed);

    if (!validated.success) {
      console.warn("AI response validation failed schema:", validated.error);
      return generateLocalFinancialInsights(context);
    }

    return {
      summary: validated.data.summary,
      insights: validated.data.insights,
      considerations: validated.data.considerations,
      disclaimer: validated.data.disclaimer,
      isMock: false,
    };
  } catch (error) {
    console.error("AI service error:", error);
    return generateLocalFinancialInsights(context);
  }
}
