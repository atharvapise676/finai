import { UserFinancialProfile, AffordabilityResult, FinancialHealthScore, FinancialGoalItem, BudgetItemCategory } from "@/types";

export function generateFinancialSummaryCSV(data: {
  profile: UserFinancialProfile;
  health?: FinancialHealthScore;
  affordability?: AffordabilityResult;
  goals?: FinancialGoalItem[];
  budget?: BudgetItemCategory[];
}): string {
  const lines: string[] = [];

  // Header & Metadata
  lines.push("FINAI FINANCIAL INTELLIGENCE SUMMARY REPORT");
  lines.push(`Generated On,"${new Date().toISOString()}"`);
  lines.push(`User,"${data.profile.name}"`);
  lines.push(`Email,"${data.profile.email}"`);
  lines.push("");

  // Financial Profile
  lines.push("--- FINANCIAL PROFILE ---");
  lines.push(`Monthly Income,${data.profile.monthlyIncome}`);
  lines.push(`Monthly Expenses,${data.profile.monthlyExpenses}`);
  lines.push(`Existing EMI,${data.profile.existingEmi}`);
  lines.push(`Liquid Savings,${data.profile.savings}`);
  lines.push(`Emergency Fund,${data.profile.emergencyFund}`);
  lines.push(`Credit Score,${data.profile.creditScore}`);
  lines.push(`Employment Type,"${data.profile.employmentType}"`);
  lines.push("");

  // Financial Health Indicator
  if (data.health) {
    lines.push("--- FINANCIAL HEALTH INDICATOR ---");
    lines.push(`Overall Score,${data.health.overallScore}/100`);
    lines.push(`Health Tier,"${data.health.tier}"`);
    lines.push(`Debt Burden Pillar Score,${data.health.pillars.debtBurden.score}`);
    lines.push(`Savings Buffer Pillar Score,${data.health.pillars.savingsBuffer.score}`);
    lines.push(`Budget Discipline Pillar Score,${data.health.pillars.budgetDiscipline.score}`);
    lines.push(`Credit Standing Pillar Score,${data.health.pillars.creditHealth.score}`);
    lines.push(`Income Stability Pillar Score,${data.health.pillars.incomeStability.score}`);
    lines.push("");
  }

  // Active Loan Affordability Analysis
  if (data.affordability) {
    lines.push("--- LOAN AFFORDABILITY EVALUATION ---");
    lines.push(`Status,"${data.affordability.status}"`);
    lines.push(`Calculated Monthly EMI,${data.affordability.monthlyEmi}`);
    lines.push(`Total Post-Loan EMI Burden,${data.affordability.totalEmiBurden}`);
    lines.push(`Pre-Loan Debt Burden (FOIR),${Math.round(data.affordability.existingFOIR * 100)}%`);
    lines.push(`Post-Loan Debt Burden (FOIR),${Math.round(data.affordability.newFOIR * 100)}%`);
    lines.push(`Post-Loan Disposable Cashflow,${data.affordability.disposableIncomeAfter}`);
    lines.push(`Max Estimated Affordable Loan,${data.affordability.maxAffordableLoan}`);
    lines.push(`Rule Policy Version,"${data.affordability.ruleVersion}"`);
    lines.push("");
  }

  // Budget Breakdown
  if (data.budget && data.budget.length > 0) {
    lines.push("--- MONTHLY BUDGET ALLOCATION ---");
    lines.push("Category,Allocated (INR),Spent (INR),Remaining (INR)");
    data.budget.forEach((item) => {
      lines.push(`"${item.category}",${item.allocated},${item.spent},${item.allocated - item.spent}`);
    });
    lines.push("");
  }

  // Financial Goals
  if (data.goals && data.goals.length > 0) {
    lines.push("--- FINANCIAL GOALS ---");
    lines.push("Goal Name,Category,Target Amount (INR),Current Amount (INR),Target Date,Progress (%)");
    data.goals.forEach((g) => {
      const prog = g.targetAmount > 0 ? Math.round((g.currentAmount / g.targetAmount) * 100) : 0;
      lines.push(`"${g.name}","${g.category}",${g.targetAmount},${g.currentAmount},"${g.targetDate}",${prog}%`);
    });
    lines.push("");
  }

  lines.push("--- COMPLIANCE DISCLAIMER ---");
  lines.push('"FinAI provides mathematical estimates and financial educational insights based on user assumptions. It does not constitute a loan sanction or underwriting approval by any financial institution."');

  return lines.join("\n");
}
