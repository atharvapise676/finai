import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { calculateAffordability, DEFAULT_ELIGIBILITY_RULES } from "@/lib/financial-engine";
import { getUserFromRequest } from "@/lib/auth";
import { db } from "@/lib/db";
import { recordAuditLog } from "@/lib/audit";

const AffordabilitySchema = z.object({
  monthlyIncome: z.number().min(0, "Monthly income cannot be negative"),
  monthlyExpenses: z.number().min(0, "Monthly expenses cannot be negative"),
  existingEmi: z.number().min(0, "Existing EMI cannot be negative"),
  requestedLoan: z.number().min(0, "Requested loan cannot be negative"),
  annualRate: z.number().min(0).max(100),
  tenureMonths: z.number().min(1).max(600),
  creditScore: z.number().min(300).max(900),
  employmentType: z.enum(["salaried", "self_employed", "business", "freelancer"]).optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = AffordabilitySchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    // Fetch active eligibility rule from DB if available, otherwise use default
    let activeRule = DEFAULT_ELIGIBILITY_RULES;
    try {
      const dbRule = await db.eligibilityRule.findFirst({
        where: { isActive: true },
        orderBy: { createdAt: "desc" },
      });
      if (dbRule) {
        activeRule = {
          id: dbRule.id,
          ruleVersion: dbRule.ruleVersion,
          minIncome: dbRule.minIncome,
          maxFOIR: dbRule.maxFOIR,
          minCreditScore: dbRule.minCreditScore,
          maxLoanTenure: dbRule.maxLoanTenure,
          maxMultiplier: dbRule.maxMultiplier,
          isActive: dbRule.isActive,
          updatedBy: dbRule.updatedBy,
        };
      }
    } catch (e) {
      console.warn("Could not query DB rules, using default rule config:", e);
    }

    const result = calculateAffordability(validated.data, activeRule);

    const user = await getUserFromRequest(req);
    if (user) {
      await db.calculation.create({
        data: {
          userId: user.userId,
          type: "affordability",
          inputData: JSON.stringify(validated.data),
          outputData: JSON.stringify({
            status: result.status,
            monthlyEmi: result.monthlyEmi,
            newFOIR: result.newFOIR,
            disposableIncomeAfter: result.disposableIncomeAfter,
            maxAffordableLoan: result.maxAffordableLoan,
          }),
        },
      });
      await recordAuditLog("AFFORDABILITY_EVALUATED", user.userId, {
        status: result.status,
        requestedLoan: validated.data.requestedLoan,
      });
    }

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("Loan affordability error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
