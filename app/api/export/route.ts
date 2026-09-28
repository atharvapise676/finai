import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { db } from "@/lib/db";
import { calculateFinancialHealth } from "@/lib/financial-engine";
import { generateFinancialSummaryCSV } from "@/lib/export-utils";
import { UserFinancialProfile } from "@/types";
import { recordAuditLog } from "@/lib/audit";

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

    let goals = undefined;
    let budget = undefined;

    if (session) {
      const dbUser = await db.user.findUnique({
        where: { id: session.userId },
        include: {
          profile: true,
          goals: true,
          budgets: {
            include: { items: true },
            take: 1,
            orderBy: { createdAt: "desc" },
          },
        },
      });

      if (dbUser && dbUser.profile) {
        profile = {
          name: dbUser.name,
          email: dbUser.email,
          monthlyIncome: dbUser.profile.monthlyIncome,
          monthlyExpenses: dbUser.profile.monthlyExpenses,
          existingEmi: dbUser.profile.existingEmi,
          savings: dbUser.profile.savings,
          emergencyFund: dbUser.profile.emergencyFund,
          creditScore: dbUser.profile.creditScore,
          employmentType: dbUser.profile.employmentType as UserFinancialProfile["employmentType"],
          age: dbUser.profile.age,
          dependents: dbUser.profile.dependents,
        };

        goals = dbUser.goals.map((g) => ({
          id: g.id,
          name: g.name,
          category: g.category as any,
          targetAmount: g.targetAmount,
          currentAmount: g.currentAmount,
          targetDate: g.targetDate.toISOString().split("T")[0],
        }));

        if (dbUser.budgets[0]?.items) {
          budget = dbUser.budgets[0].items.map((i) => ({
            category: i.category,
            allocated: i.allocated,
            spent: i.spent,
          }));
        }

        await recordAuditLog("EXPORT_DATA", session.userId, { format: "csv" });
      }
    }

    const health = calculateFinancialHealth(profile);
    const csvContent = generateFinancialSummaryCSV({
      profile,
      health,
      goals,
      budget,
    });

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="finai_summary_${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json({ error: "Failed to generate export" }, { status: 500 });
  }
}
