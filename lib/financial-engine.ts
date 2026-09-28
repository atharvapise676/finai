import {
  EMICalculationInput,
  EMICalculationResult,
  AffordabilityInput,
  AffordabilityResult,
  AffordabilityStatus,
  CreditAnalysisResult,
  FinancialHealthScore,
  EmergencyFundCalculation,
  StressTestScenarioInput,
  StressTestResult,
  LoanComparisonOffer,
  ComparedOfferResult,
  EligibilityRuleConfig,
  UserFinancialProfile,
  HealthPillar,
} from "@/types";

/**
 * Standard rounding utility for currency (2 decimal places)
 */
export function round(value: number): number {
  if (isNaN(value) || !isFinite(value)) return 0;
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

/**
 * DETERMINISTIC EMI CALCULATION
 * Formula: EMI = P * r * (1 + r)^n / ((1 + r)^n - 1)
 * Where:
 * P = Principal
 * r = Monthly interest rate (annualRate / 12 / 100)
 * n = Tenure in months
 */
export function calculateEMI(input: EMICalculationInput): EMICalculationResult {
  const principal = Math.max(0, input.principal || 0);
  const annualRate = Math.max(0, input.annualRate || 0);
  const tenureMonths = Math.max(1, Math.round(input.tenureMonths || 1));

  if (principal === 0) {
    return {
      monthlyEmi: 0,
      totalPrincipal: 0,
      totalInterest: 0,
      totalRepayment: 0,
      principalPercent: 100,
      interestPercent: 0,
      amortizationPreview: [],
    };
  }

  // Edge case: 0% Interest Loan
  if (annualRate === 0) {
    const monthlyEmi = round(principal / tenureMonths);
    const totalRepayment = principal;
    const amortizationPreview = [];
    let remaining = principal;

    for (let m = 1; m <= Math.min(12, tenureMonths); m++) {
      const principalPaid = m === tenureMonths ? remaining : monthlyEmi;
      remaining = Math.max(0, remaining - principalPaid);
      amortizationPreview.push({
        month: m,
        emi: principalPaid,
        principalPaid,
        interestPaid: 0,
        remainingBalance: round(remaining),
      });
    }

    return {
      monthlyEmi,
      totalPrincipal: principal,
      totalInterest: 0,
      totalRepayment,
      principalPercent: 100,
      interestPercent: 0,
      amortizationPreview,
    };
  }

  const monthlyRate = annualRate / 12 / 100;
  const factor = Math.pow(1 + monthlyRate, tenureMonths);
  const monthlyEmi = round((principal * monthlyRate * factor) / (factor - 1));
  const totalRepayment = round(monthlyEmi * tenureMonths);
  const totalInterest = round(Math.max(0, totalRepayment - principal));
  const principalPercent = round((principal / totalRepayment) * 100);
  const interestPercent = round((totalInterest / totalRepayment) * 100);

  // Generate 12-month amortization preview
  const amortizationPreview = [];
  let currentBalance = principal;

  for (let m = 1; m <= Math.min(12, tenureMonths); m++) {
    const interestForMonth = round(currentBalance * monthlyRate);
    const principalForMonth = round(Math.min(currentBalance, monthlyEmi - interestForMonth));
    currentBalance = Math.max(0, round(currentBalance - principalForMonth));

    amortizationPreview.push({
      month: m,
      emi: monthlyEmi,
      principalPaid: principalForMonth,
      interestPaid: interestForMonth,
      remainingBalance: currentBalance,
    });
  }

  return {
    monthlyEmi,
    totalPrincipal: principal,
    totalInterest,
    totalRepayment,
    principalPercent,
    interestPercent,
    amortizationPreview,
  };
}

/**
 * FIXED OBLIGATION TO INCOME RATIO (FOIR)
 * FOIR = Total Monthly Debt Payments / Gross Monthly Income
 */
export function calculateFOIR(totalMonthlyDebt: number, monthlyIncome: number): number {
  if (!monthlyIncome || monthlyIncome <= 0) return 1.0;
  return round(Math.max(0, totalMonthlyDebt / monthlyIncome));
}

/**
 * DEFAULT ELIGIBILITY RULE CONFIGURATION
 */
export const DEFAULT_ELIGIBILITY_RULES: EligibilityRuleConfig = {
  ruleVersion: "v1.2.0-finai",
  minIncome: 25000,
  maxFOIR: 0.50, // 50% max debt burden
  minCreditScore: 650,
  maxLoanTenure: 360,
  maxMultiplier: 60, // Maximum loan is 60x monthly income
  isActive: true,
  updatedBy: "FinAI Risk Policy Architecture",
};

/**
 * DETERMINISTIC LOAN AFFORDABILITY & EXPLAINABLE ELIGIBILITY
 */
export function calculateAffordability(
  input: AffordabilityInput,
  rules: EligibilityRuleConfig = DEFAULT_ELIGIBILITY_RULES
): AffordabilityResult {
  const income = Math.max(0, input.monthlyIncome || 0);
  const expenses = Math.max(0, input.monthlyExpenses || 0);
  const existingEmi = Math.max(0, input.existingEmi || 0);
  const requestedLoan = Math.max(0, input.requestedLoan || 0);
  const annualRate = Math.max(0, input.annualRate || 8.5);
  const tenure = Math.max(1, Math.min(rules.maxLoanTenure, input.tenureMonths || 240));
  const creditScore = Math.max(300, Math.min(900, input.creditScore || 700));

  const loanCalc = calculateEMI({
    principal: requestedLoan,
    annualRate,
    tenureMonths: tenure,
  });

  const newEmi = loanCalc.monthlyEmi;
  const totalEmiBurden = round(existingEmi + newEmi);

  const existingFOIR = calculateFOIR(existingEmi, income);
  const newFOIR = calculateFOIR(totalEmiBurden, income);

  const disposableIncomeBefore = round(income - expenses - existingEmi);
  const disposableIncomeAfter = round(disposableIncomeBefore - newEmi);

  // Maximum loan calculated from max allowed FOIR
  const maxAllowedTotalEmi = round(income * rules.maxFOIR);
  const maxAvailableEmiForNewLoan = Math.max(0, round(maxAllowedTotalEmi - existingEmi));

  // Reverse calculate principal affordable at maxAvailableEmiForNewLoan
  let maxAffordableLoan = 0;
  if (maxAvailableEmiForNewLoan > 0) {
    if (annualRate === 0) {
      maxAffordableLoan = round(maxAvailableEmiForNewLoan * tenure);
    } else {
      const r = annualRate / 12 / 100;
      const factor = Math.pow(1 + r, tenure);
      maxAffordableLoan = round((maxAvailableEmiForNewLoan * (factor - 1)) / (r * factor));
    }
  }

  // Cap with maximum income multiplier rule
  const cappedMaxLoan = Math.min(maxAffordableLoan, income * rules.maxMultiplier);

  // Rule Evaluation Factors
  const positiveFactors: string[] = [];
  const attentionFactors: string[] = [];

  // Income Check
  if (income >= rules.minIncome) {
    positiveFactors.push(`Income of ₹${income.toLocaleString()} meets the configured minimum threshold (₹${rules.minIncome.toLocaleString()}).`);
  } else {
    attentionFactors.push(`Monthly income (₹${income.toLocaleString()}) is below the platform baseline threshold (₹${rules.minIncome.toLocaleString()}).`);
  }

  // Credit Score Check
  if (creditScore >= 750) {
    positiveFactors.push(`Credit score (${creditScore}) is in the prime tier (≥ 750), suggesting disciplined past repayment history.`);
  } else if (creditScore >= rules.minCreditScore) {
    positiveFactors.push(`Credit score (${creditScore}) satisfies the baseline configured threshold (${rules.minCreditScore}).`);
  } else {
    attentionFactors.push(`Credit score (${creditScore}) is below the configured benchmark (${rules.minCreditScore}), indicating elevated underwriting scrutiny.`);
  }

  // Debt Burden / FOIR Check
  const foirPercent = Math.round(newFOIR * 100);
  const maxFoirPercent = Math.round(rules.maxFOIR * 100);

  if (newFOIR <= 0.35) {
    positiveFactors.push(`Estimated total debt burden (FOIR: ${foirPercent}%) is conservative and comfortably below the ${maxFoirPercent}% policy ceiling.`);
  } else if (newFOIR <= rules.maxFOIR) {
    positiveFactors.push(`Estimated FOIR (${foirPercent}%) is acceptable within the ${maxFoirPercent}% maximum limit.`);
  } else {
    attentionFactors.push(`Estimated total EMI burden reaches ${foirPercent}% of monthly income, exceeding the configured ceiling of ${maxFoirPercent}%.`);
  }

  // Disposable Income Check
  if (disposableIncomeAfter >= income * 0.25) {
    positiveFactors.push(`Projected post-EMI disposable income leaves an adequate safety buffer of ₹${disposableIncomeAfter.toLocaleString()} (≥ 25% of income).`);
  } else if (disposableIncomeAfter > 0) {
    attentionFactors.push(`Post-EMI surplus is narrow (₹${disposableIncomeAfter.toLocaleString()}), potentially squeezing monthly emergency liquidity.`);
  } else {
    attentionFactors.push(`Negative cashflow detected: Monthly obligations exceed total income by ₹${Math.abs(disposableIncomeAfter).toLocaleString()}.`);
  }

  // Requested loan size relative to income
  if (requestedLoan <= income * rules.maxMultiplier) {
    positiveFactors.push(`Requested loan amount (₹${requestedLoan.toLocaleString()}) is within the ${rules.maxMultiplier}x income multiple limit.`);
  } else {
    attentionFactors.push(`Requested loan amount exceeds the ${rules.maxMultiplier}x monthly income guideline.`);
  }

  // Determine Affordability Status
  let status: AffordabilityStatus;
  let statusBadge: "success" | "warning" | "danger";

  if (
    income >= rules.minIncome &&
    creditScore >= rules.minCreditScore &&
    newFOIR <= rules.maxFOIR &&
    disposableIncomeAfter > 0
  ) {
    status = "Estimated within configured criteria";
    statusBadge = "success";
  } else if (
    income >= rules.minIncome * 0.8 &&
    creditScore >= rules.minCreditScore - 30 &&
    newFOIR <= rules.maxFOIR + 0.08 &&
    disposableIncomeAfter >= 0
  ) {
    status = "Requires review";
    statusBadge = "warning";
  } else {
    status = "Outside configured criteria";
    statusBadge = "danger";
  }

  return {
    status,
    statusBadge,
    monthlyEmi: newEmi,
    totalEmiBurden,
    existingFOIR,
    newFOIR,
    disposableIncomeBefore,
    disposableIncomeAfter,
    maxAffordableLoan: round(cappedMaxLoan),
    maxAffordableEmi: round(maxAvailableEmiForNewLoan),
    positiveFactors,
    attentionFactors,
    ruleVersion: rules.ruleVersion,
    timestamp: new Date().toISOString(),
  };
}

/**
 * CREDIT SCORE ANALYSIS
 */
export function analyzeCreditScore(score: number): CreditAnalysisResult {
  const cleanScore = Math.max(300, Math.min(900, Math.round(score)));

  let tier: "Exceptional" | "Very Good" | "Good" | "Fair" | "Poor";
  let ratingDescription: string;
  let benchmarkPercentile: number;
  let colorClass: string;

  if (cleanScore >= 800) {
    tier = "Exceptional";
    ratingDescription = "Top-tier credit profile with highest probability of favorable lender pricing and rapid pre-qualification.";
    benchmarkPercentile = 92;
    colorClass = "text-emerald-400";
  } else if (cleanScore >= 740) {
    tier = "Very Good";
    ratingDescription = "Strong credit history demonstrating consistent payment punctuality and low default risk across lenders.";
    benchmarkPercentile = 78;
    colorClass = "text-teal-400";
  } else if (cleanScore >= 670) {
    tier = "Good";
    ratingDescription = "Acceptable credit standing within normal industry expectations; qualify for mainstream rates with standard documentation.";
    benchmarkPercentile = 55;
    colorClass = "text-cyan-400";
  } else if (cleanScore >= 580) {
    tier = "Fair";
    ratingDescription = "Sub-prime tier; may attract risk-based interest premiums, higher down payment mandates, or additional security.";
    benchmarkPercentile = 28;
    colorClass = "text-amber-400";
  } else {
    tier = "Poor";
    ratingDescription = "Significant adverse credit events or thin credit file requiring structured credit repair before new debt applications.";
    benchmarkPercentile = 10;
    colorClass = "text-rose-400";
  }

  const keyFactors = [
    {
      name: "Payment History (35% weight)",
      impact: "High" as const,
      status: cleanScore >= 720 ? ("Good" as const) : cleanScore >= 640 ? ("Fair" as const) : ("Needs Attention" as const),
      tip: "Ensure zero missed or delayed payments on active credit cards and loans over the next 12 billing cycles.",
    },
    {
      name: "Credit Utilization Ratio (30% weight)",
      impact: "High" as const,
      status: cleanScore >= 740 ? ("Good" as const) : ("Fair" as const),
      tip: "Aim to keep total outstanding credit card balances below 30% of aggregate available credit limits.",
    },
    {
      name: "Credit History Length (15% weight)",
      impact: "Medium" as const,
      status: cleanScore >= 700 ? ("Good" as const) : ("Fair" as const),
      tip: "Keep oldest credit cards active to preserve account vintage and positive repayment history.",
    },
    {
      name: "Credit Mix & Inquiries (20% weight)",
      impact: "Medium" as const,
      status: cleanScore >= 680 ? ("Good" as const) : ("Needs Attention" as const),
      tip: "Avoid multiple hard credit inquiries in quick succession; bunch loan quotes within short 14-day comparison windows.",
    },
  ];

  const educationalRecommendations = [
    "Verify your credit bureau report every quarter for clerical inaccuracies or unauthorized inquiries.",
    "Pay revolving credit card statements in full before the billing due date to avoid finance charges.",
    "Do not close old no-annual-fee credit cards, as closing them shortens your average credit history length.",
    "Avoid applying for multiple consumer credit products simultaneously across multiple financial institutions.",
  ];

  const disclaimer =
    "FinAI provides educational credit score analysis based on user-provided scores. Credit score models (e.g. CIBIL, Experian, Equifax, CRIF, FICO) and individual bank underwriting risk algorithms vary significantly across lenders.";

  return {
    score: cleanScore,
    tier,
    ratingDescription,
    benchmarkPercentile,
    colorClass,
    keyFactors,
    educationalRecommendations,
    disclaimer,
  };
}

/**
 * DETERMINISTIC FINANCIAL HEALTH INDICATOR (0 - 100)
 * Evaluates 5 pillars:
 * 1. Debt Burden (Weight: 30%)
 * 2. Savings Buffer (Weight: 25%)
 * 3. Budget Balance / Savings Rate (Weight: 20%)
 * 4. Credit Standing (Weight: 15%)
 * 5. Income Stability (Weight: 10%)
 */
export function calculateFinancialHealth(profile: UserFinancialProfile): FinancialHealthScore {
  const income = Math.max(1, profile.monthlyIncome || 0);
  const expenses = Math.max(0, profile.monthlyExpenses || 0);
  const existingEmi = Math.max(0, profile.existingEmi || 0);
  const savings = Math.max(0, profile.savings || 0);
  const creditScore = Math.max(300, Math.min(900, profile.creditScore || 700));

  // Pillar 1: Debt Burden (FOIR) - 30% weight
  const foir = calculateFOIR(existingEmi, income);
  let debtScore = 100;
  let debtStatus: HealthPillar["status"] = "Excellent";
  if (foir > 0.6) {
    debtScore = 20;
    debtStatus = "Action Required";
  } else if (foir > 0.45) {
    debtScore = 50;
    debtStatus = "Fair";
  } else if (foir > 0.3) {
    debtScore = 75;
    debtStatus = "Good";
  } else {
    debtScore = 100;
    debtStatus = "Excellent";
  }

  // Pillar 2: Savings Buffer (Months of essential expenses covered) - 25% weight
  const monthlyBurn = Math.max(1, expenses + existingEmi);
  const monthsCovered = round(savings / monthlyBurn);
  let savingsScore = 100;
  let savingsStatus: HealthPillar["status"] = "Excellent";
  if (monthsCovered >= 6) {
    savingsScore = 100;
    savingsStatus = "Excellent";
  } else if (monthsCovered >= 3) {
    savingsScore = 80;
    savingsStatus = "Good";
  } else if (monthsCovered >= 1) {
    savingsScore = 55;
    savingsStatus = "Fair";
  } else {
    savingsScore = 25;
    savingsStatus = "Action Required";
  }

  // Pillar 3: Budget Discipline / Savings Rate - 20% weight
  const netMonthlySurplus = income - expenses - existingEmi;
  const savingsRate = netMonthlySurplus / income;
  let budgetScore = 100;
  let budgetStatus: HealthPillar["status"] = "Excellent";
  if (savingsRate >= 0.3) {
    budgetScore = 100;
    budgetStatus = "Excellent";
  } else if (savingsRate >= 0.2) {
    budgetScore = 85;
    budgetStatus = "Good";
  } else if (savingsRate >= 0.1) {
    budgetScore = 65;
    budgetStatus = "Fair";
  } else if (savingsRate >= 0) {
    budgetScore = 40;
    budgetStatus = "Fair";
  } else {
    budgetScore = 15;
    budgetStatus = "Action Required";
  }

  // Pillar 4: Credit Health - 15% weight
  let creditPillarScore = 100;
  let creditStatus: HealthPillar["status"] = "Excellent";
  if (creditScore >= 780) {
    creditPillarScore = 100;
    creditStatus = "Excellent";
  } else if (creditScore >= 720) {
    creditPillarScore = 85;
    creditStatus = "Good";
  } else if (creditScore >= 660) {
    creditPillarScore = 65;
    creditStatus = "Fair";
  } else {
    creditPillarScore = 35;
    creditStatus = "Action Required";
  }

  // Pillar 5: Income Stability - 10% weight
  let stabilityScore = 85;
  if (profile.employmentType === "salaried") stabilityScore = 95;
  else if (profile.employmentType === "business") stabilityScore = 80;
  else if (profile.employmentType === "self_employed") stabilityScore = 75;
  else stabilityScore = 70;

  // Deduct slightly if dependents high with low surplus
  if (profile.dependents >= 3 && savingsRate < 0.15) {
    stabilityScore = Math.max(40, stabilityScore - 15);
  }

  const pillars = {
    debtBurden: {
      name: "Debt Burden",
      score: debtScore,
      weight: 0.30,
      weightedScore: round(debtScore * 0.30),
      metric: `FOIR: ${Math.round(foir * 100)}%`,
      description: "Ratio of current monthly debt obligations to total monthly income.",
      status: debtStatus,
    },
    savingsBuffer: {
      name: "Savings Buffer",
      score: savingsScore,
      weight: 0.25,
      weightedScore: round(savingsScore * 0.25),
      metric: `${monthsCovered} Months Covered`,
      description: "Current liquid reserves measured in months of living expenses.",
      status: savingsStatus,
    },
    budgetDiscipline: {
      name: "Budget Discipline",
      score: budgetScore,
      weight: 0.20,
      weightedScore: round(budgetScore * 0.20),
      metric: `${Math.round(savingsRate * 100)}% Monthly Surplus`,
      description: "Net disposable cashflow available after meeting expenses and debt.",
      status: budgetStatus,
    },
    creditHealth: {
      name: "Credit Standing",
      score: creditPillarScore,
      weight: 0.15,
      weightedScore: round(creditPillarScore * 0.15),
      metric: `${creditScore} Score`,
      description: "Overall credit risk standing based on score brackets.",
      status: creditStatus,
    },
    incomeStability: {
      name: "Income Stability",
      score: stabilityScore,
      weight: 0.10,
      weightedScore: round(stabilityScore * 0.10),
      metric: `${profile.employmentType.replace("_", " ").toUpperCase()}`,
      description: "Employment risk resilience and dependent load profile.",
      status: (stabilityScore >= 85 ? "Excellent" : stabilityScore >= 70 ? "Good" : "Fair") as HealthPillar["status"],
    },
  };

  const overallScore = Math.round(
    pillars.debtBurden.weightedScore +
    pillars.savingsBuffer.weightedScore +
    pillars.budgetDiscipline.weightedScore +
    pillars.creditHealth.weightedScore +
    pillars.incomeStability.weightedScore
  );

  let tier: FinancialHealthScore["tier"];
  let tierColor: string;
  let summary: string;

  if (overallScore >= 80) {
    tier = "Prime";
    tierColor = "text-emerald-400";
    summary = "Your financial vitals are robust with strong debt control and comfortable liquidity reserves.";
  } else if (overallScore >= 70) {
    tier = "Strong";
    tierColor = "text-teal-400";
    summary = "Solid financial footing with balanced obligations and consistent disposable income.";
  } else if (overallScore >= 55) {
    tier = "Balanced";
    tierColor = "text-cyan-400";
    summary = "Moderate financial health. Key opportunities exist in augmenting emergency savings and lowering debt burden.";
  } else if (overallScore >= 40) {
    tier = "Stretched";
    tierColor = "text-amber-400";
    summary = "Your finances are vulnerable to unexpected shocks due to elevated debt or narrow cashflow margins.";
  } else {
    tier = "Critical";
    tierColor = "text-rose-400";
    summary = "Immediate debt restructuring and essential expense optimization recommended to restore financial stability.";
  }

  const recommendations: string[] = [];
  if (debtScore < 70) recommendations.push("Focus on paying down high-cost existing loans to bring FOIR below 35%.");
  if (savingsScore < 70) recommendations.push(`Build emergency savings to reach at least 3 to 6 months of mandatory expenses (₹${(monthlyBurn * 6).toLocaleString()}).`);
  if (budgetScore < 70) recommendations.push("Review discretionary spending categories to increase monthly net savings rate above 20%.");
  if (creditPillarScore < 70) recommendations.push("Maintain a 100% on-time payment record and reduce credit card utilization below 30%.");

  if (recommendations.length === 0) {
    recommendations.push("Maintain your disciplined allocation and consider channelizing surplus cash into long-term wealth assets.");
  }

  return {
    overallScore,
    tier,
    tierColor,
    summary,
    pillars,
    recommendations,
  };
}

/**
 * EMERGENCY FUND CALCULATOR
 * Target = Monthly Essential Expenses * Target Months
 */
export function calculateEmergencyFund(
  essentialExpenses: number,
  targetMonths: number,
  currentFund: number
): EmergencyFundCalculation {
  const expenses = Math.max(0, essentialExpenses || 0);
  const months = Math.max(1, Math.min(24, Math.round(targetMonths || 6)));
  const current = Math.max(0, currentFund || 0);

  const targetFund = round(expenses * months);
  const shortfallOrSurplus = round(current - targetFund);
  const progressPercent = targetFund > 0 ? Math.min(100, round((current / targetFund) * 100)) : 100;
  const monthsCoveredCurrent = expenses > 0 ? round(current / expenses) : months;
  const remainingGap = Math.max(0, targetFund - current);
  const monthlySavingsRequiredToReachGoalIn12Mo = round(remainingGap / 12);

  return {
    essentialExpenses: expenses,
    targetMonths: months,
    targetFund,
    currentFund: current,
    shortfallOrSurplus,
    progressPercent,
    monthsCoveredCurrent,
    monthlySavingsRequiredToReachGoalIn12Mo,
  };
}

/**
 * FINANCIAL STRESS TESTING ENGINE
 * Simulates systemic financial shocks on cashflow and debt serviceability
 */
export function runStressTest(
  profile: UserFinancialProfile,
  requestedLoan: { principal: number; rate: number; tenureMonths: number },
  scenario: StressTestScenarioInput,
  scenarioName: string = "Custom Scenario"
): StressTestResult {
  const baseIncome = Math.max(0, profile.monthlyIncome);
  const baseExpenses = Math.max(0, profile.monthlyExpenses);
  const baseExistingEmi = Math.max(0, profile.existingEmi);

  // Apply shocks
  const incomeFactor = 1 + scenario.incomeChangePercent / 100;
  const stressedIncome = round(Math.max(0, baseIncome * incomeFactor));

  const expenseFactor = 1 + scenario.expenseChangePercent / 100;
  const stressedExpenses = round(baseExpenses * expenseFactor);

  const existingEmiFactor = 1 + scenario.existingEmiIncreasePercent / 100;
  const stressedExistingEmi = round(baseExistingEmi * existingEmiFactor);

  // Stressed new loan interest rate
  const stressedRate = Math.max(0, requestedLoan.rate + scenario.interestRateHikePercent);
  const loanCalc = calculateEMI({
    principal: requestedLoan.principal,
    annualRate: stressedRate,
    tenureMonths: requestedLoan.tenureMonths,
  });
  const stressedLoanEmi = loanCalc.monthlyEmi;

  const stressedTotalEmi = round(stressedExistingEmi + stressedLoanEmi);
  const stressedFOIR = calculateFOIR(stressedTotalEmi, stressedIncome);
  const stressedDisposableIncome = round(stressedIncome - stressedExpenses - stressedTotalEmi);

  const isDeficit = stressedDisposableIncome < 0;

  // Resilience score (0 - 100)
  let resilienceScore = 100;
  if (isDeficit) {
    const deficitRatio = Math.abs(stressedDisposableIncome) / Math.max(1, stressedIncome);
    resilienceScore = Math.max(5, Math.round(40 - deficitRatio * 100));
  } else {
    const cushionRatio = stressedDisposableIncome / Math.max(1, stressedIncome);
    resilienceScore = Math.min(100, Math.round(50 + cushionRatio * 100));
  }

  // Adjust for extreme FOIR
  if (stressedFOIR > 0.6) {
    resilienceScore = Math.max(10, resilienceScore - 20);
  }

  let riskLevel: StressTestResult["riskLevel"];
  if (resilienceScore >= 75) riskLevel = "Low Risk";
  else if (resilienceScore >= 55) riskLevel = "Moderate Risk";
  else if (resilienceScore >= 35) riskLevel = "High Risk";
  else riskLevel = "Severe Vulnerability";

  const warnings: string[] = [];
  if (isDeficit) {
    warnings.push(`Projected monthly cashflow slips into a deficit of -₹${Math.abs(stressedDisposableIncome).toLocaleString()}/month under this shock.`);
  }
  if (stressedFOIR > 0.50) {
    warnings.push(`Debt service ratio spikes to ${Math.round(stressedFOIR * 100)}%, consuming over half of your stressed monthly income.`);
  }
  if (scenario.interestRateHikePercent > 0) {
    warnings.push(`A +${scenario.interestRateHikePercent}% rate hike increases your loan EMI by ₹${(stressedLoanEmi - calculateEMI({ principal: requestedLoan.principal, annualRate: requestedLoan.rate, tenureMonths: requestedLoan.tenureMonths }).monthlyEmi).toLocaleString()}/month.`);
  }

  return {
    scenarioName,
    stressedIncome,
    stressedExpenses,
    stressedExistingEmi,
    stressedLoanEmi,
    stressedTotalEmi,
    stressedFOIR,
    stressedDisposableIncome,
    resilienceScore,
    riskLevel,
    isDeficit,
    warnings,
  };
}

/**
 * MULTI-OFFER LOAN COMPARISON
 */
export function compareLoanOffers(offers: LoanComparisonOffer[]): ComparedOfferResult[] {
  return offers.map((offer) => {
    const emiResult = calculateEMI({
      principal: offer.principal,
      annualRate: offer.annualRate,
      tenureMonths: offer.tenureMonths,
    });

    const upfrontFees = round(
      (offer.principal * (offer.processingFeePercent || 0)) / 100 + (offer.otherCharges || 0)
    );
    const overallNetOutflow = round(emiResult.totalRepayment + upfrontFees);
    const totalCostOfCredit = round(overallNetOutflow - offer.principal);

    return {
      ...offer,
      monthlyEmi: emiResult.monthlyEmi,
      totalInterest: emiResult.totalInterest,
      totalRepayment: emiResult.totalRepayment,
      upfrontFees,
      totalCostOfCredit,
      overallNetOutflow,
    };
  });
}

/**
 * WHAT-IF TENURE & RATE BENCHMARK SIMULATION
 */
export function simulateWhatIfScenarios(
  principal: number,
  baseRate: number,
  tenuresInYears: number[] = [5, 7, 10, 15, 20]
) {
  return tenuresInYears.map((years) => {
    const months = years * 12;
    const baseResult = calculateEMI({ principal, annualRate: baseRate, tenureMonths: months });
    const ratePlus1 = calculateEMI({ principal, annualRate: baseRate + 1.0, tenureMonths: months });
    const rateMinus1 = calculateEMI({ principal, annualRate: Math.max(1, baseRate - 1.0), tenureMonths: months });

    return {
      years,
      months,
      monthlyEmi: baseResult.monthlyEmi,
      totalInterest: baseResult.totalInterest,
      totalRepayment: baseResult.totalRepayment,
      emiIfRatePlus1Percent: ratePlus1.monthlyEmi,
      emiIfRateMinus1Percent: rateMinus1.monthlyEmi,
      interestSavingsVsTenureYears: 0, // Computed relative to highest tenure
    };
  });
}

/**
 * TRANSACTION ANOMALY ANALYZER
 * Analyzes structured transaction records for unusual spikes, frequency clusters, and subscription leaks
 */
export interface TransactionRecord {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
}

export interface AnomalyReportItem {
  id: string;
  transaction: TransactionRecord;
  severity: "Low" | "Medium" | "High";
  anomalyType: "Sudden Spike" | "Category Outlier" | "Duplicate Recurring Charge" | "Unusual Velocity";
  explanation: string;
}

export function detectTransactionAnomalies(transactions: TransactionRecord[]): AnomalyReportItem[] {
  if (!transactions || transactions.length === 0) return [];

  const anomalies: AnomalyReportItem[] = [];

  // Group by category to find category mean and std deviation
  const categoryStats: Record<string, { amounts: number[]; total: number }> = {};
  transactions.forEach((tx) => {
    if (!categoryStats[tx.category]) {
      categoryStats[tx.category] = { amounts: [], total: 0 };
    }
    categoryStats[tx.category].amounts.push(tx.amount);
    categoryStats[tx.category].total += tx.amount;
  });

  const categoryAverages: Record<string, { mean: number; max: number }> = {};
  Object.keys(categoryStats).forEach((cat) => {
    const arr = categoryStats[cat].amounts;
    const mean = categoryStats[cat].total / arr.length;
    const max = Math.max(...arr);
    categoryAverages[cat] = { mean, max };
  });

  // 1. Detect Category Spikes (Amount > 2.5x category mean)
  transactions.forEach((tx) => {
    const stats = categoryAverages[tx.category];
    if (stats && tx.amount > 3000 && tx.amount > stats.mean * 2.5) {
      anomalies.push({
        id: `spike-${tx.id}`,
        transaction: tx,
        severity: tx.amount > stats.mean * 4 ? "High" : "Medium",
        anomalyType: "Sudden Spike",
        explanation: `Amount of ₹${tx.amount.toLocaleString()} is ${round(tx.amount / stats.mean)}x higher than your average ${tx.category} expenditure (₹${round(stats.mean).toLocaleString()}).`,
      });
    }
  });

  // 2. Detect Potential Duplicate Recurring charges (identical amount & description within 7 days)
  for (let i = 0; i < transactions.length; i++) {
    for (let j = i + 1; j < transactions.length; j++) {
      const a = transactions[i];
      const b = transactions[j];
      if (
        a.amount === b.amount &&
        a.description.toLowerCase().trim() === b.description.toLowerCase().trim() &&
        Math.abs(new Date(a.date).getTime() - new Date(b.date).getTime()) <= 7 * 86400000
      ) {
        anomalies.push({
          id: `dup-${a.id}-${b.id}`,
          transaction: b,
          severity: "Medium",
          anomalyType: "Duplicate Recurring Charge",
          explanation: `Identical charge of ₹${b.amount} for "${b.description}" occurred on ${b.date} and ${a.date}. Check for duplicate subscription billing.`,
        });
      }
    }
  }

  return anomalies;
}
