import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { runStressTest } from "@/lib/financial-engine";
import { getUserFromRequest } from "@/lib/auth";
import { db } from "@/lib/db";
import { recordAuditLog } from "@/lib/audit";

const StressTestSchema = z.object({
  profile: z.object({
    monthlyIncome: z.number().min(0),
    monthlyExpenses: z.number().min(0),
    existingEmi: z.number().min(0),
    savings: z.number().min(0),
    creditScore: z.number().min(300).max(900),
    employmentType: z.enum(["salaried", "self_employed", "business", "freelancer"]).optional().default("salaried"),
    age: z.number().optional().default(30),
    dependents: z.number().optional().default(1),
  }),
  requestedLoan: z.object({
    principal: z.number().min(0),
    rate: z.number().min(0).max(100),
    tenureMonths: z.number().min(1).max(600),
  }),
  scenarios: z.array(
    z.object({
      name: z.string(),
      incomeChangePercent: z.number().min(-100).max(100),
      expenseChangePercent: z.number().min(-100).max(200),
      interestRateHikePercent: z.number().min(0).max(25),
      existingEmiIncreasePercent: z.number().min(0).max(100),
    })
  ).min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = StressTestSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const { profile, requestedLoan, scenarios } = validated.data;

    const fullProfile = {
      name: "User",
      email: "",
      emergencyFund: profile.savings * 0.6,
      ...profile,
    };

    const results = scenarios.map((sc) =>
      runStressTest(
        fullProfile,
        requestedLoan,
        {
          incomeChangePercent: sc.incomeChangePercent,
          expenseChangePercent: sc.expenseChangePercent,
          interestRateHikePercent: sc.interestRateHikePercent,
          existingEmiIncreasePercent: sc.existingEmiIncreasePercent,
        },
        sc.name
      )
    );

    const user = await getUserFromRequest(req);
    if (user) {
      await recordAuditLog("STRESS_TEST_RUN", user.userId, {
        totalScenarios: scenarios.length,
      });
    }

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error("Stress test error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
