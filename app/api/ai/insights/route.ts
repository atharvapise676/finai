import { NextRequest, NextResponse } from "next/server";
import { generateLocalFinancialInsights, queryClaudeAI } from "@/lib/ai-service";
import { getUserFromRequest } from "@/lib/auth";
import { db } from "@/lib/db";
import { calculateFinancialHealth } from "@/lib/financial-engine";
import { UserFinancialProfile } from "@/types";

export async function GET(req: NextRequest) {
  try {
    const session = await getUserFromRequest(req);

    let profile: UserFinancialProfile = {
      name: "Demo User",
      email: "demo@finai.com",
      monthlyIncome: 85000,
      monthlyExpenses: 32000,
      existingEmi: 8000,
      savings: 180000,
      emergencyFund: 150000,
      creditScore: 780,
      employmentType: "salaried",
      age: 31,
      dependents: 1,
    };

    if (session) {
      const dbProfile = await db.financialProfile.findUnique({
        where: { userId: session.userId },
        include: { user: true },
      });
      if (dbProfile) {
        profile = {
          name: dbProfile.user.name,
          email: dbProfile.user.email,
          monthlyIncome: dbProfile.monthlyIncome,
          monthlyExpenses: dbProfile.monthlyExpenses,
          existingEmi: dbProfile.existingEmi,
          savings: dbProfile.savings,
          emergencyFund: dbProfile.emergencyFund,
          creditScore: dbProfile.creditScore,
          employmentType: dbProfile.employmentType as UserFinancialProfile["employmentType"],
          age: dbProfile.age,
          dependents: dbProfile.dependents,
        };
      }
    }

    const health = calculateFinancialHealth(profile);

    const insights = await queryClaudeAI({
      profile,
      health,
      query: "Provide an executive summary and financial insights based on my health score and debt burden.",
    });

    return NextResponse.json({ success: true, insights, health });
  } catch (error) {
    console.error("AI Insights API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
