import { NextRequest, NextResponse } from "next/server";
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
      monthlyIncome: 60000,
      monthlyExpenses: 25000,
      existingEmi: 5000,
      savings: 80000,
      emergencyFund: 50000,
      creditScore: 760,
      employmentType: "salaried",
      age: 30,
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

    return NextResponse.json({ success: true, health, profile });
  } catch (error) {
    console.error("Financial health calculation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
