export type EmploymentType = "salaried" | "self_employed" | "business" | "freelancer";

export interface UserFinancialProfile {
  id?: string;
  userId?: string;
  name: string;
  email: string;
  role?: string;
  monthlyIncome: number;
  monthlyExpenses: number;
  existingEmi: number;
  savings: number;
  emergencyFund: number;
  creditScore: number;
  employmentType: EmploymentType;
  age: number;
  dependents: number;
}

export interface EMICalculationInput {
  principal: number;
  annualRate: number; // e.g. 8.5 for 8.5%
  tenureMonths: number;
}

export interface EMICalculationResult {
  monthlyEmi: number;
  totalPrincipal: number;
  totalInterest: number;
  totalRepayment: number;
  principalPercent: number;
  interestPercent: number;
  amortizationPreview: Array<{
    month: number;
    emi: number;
    principalPaid: number;
    interestPaid: number;
    remainingBalance: number;
  }>;
}

export interface AffordabilityInput {
  monthlyIncome: number;
  monthlyExpenses: number;
  existingEmi: number;
  requestedLoan: number;
  annualRate: number;
  tenureMonths: number;
  creditScore: number;
  employmentType?: EmploymentType;
}

export type AffordabilityStatus =
  | "Estimated within configured criteria"
  | "Requires review"
  | "Outside configured criteria";

export interface AffordabilityResult {
  status: AffordabilityStatus;
  statusBadge: "success" | "warning" | "danger";
  monthlyEmi: number;
  totalEmiBurden: number;
  existingFOIR: number; // e.g. 0.15 for 15%
  newFOIR: number; // e.g. 0.42 for 42%
  disposableIncomeBefore: number;
  disposableIncomeAfter: number;
  maxAffordableLoan: number;
  maxAffordableEmi: number;
  positiveFactors: string[];
  attentionFactors: string[];
  ruleVersion: string;
  timestamp: string;
}

export interface CreditAnalysisResult {
  score: number;
  tier: "Exceptional" | "Very Good" | "Good" | "Fair" | "Poor";
  ratingDescription: string;
  benchmarkPercentile: number;
  colorClass: string;
  keyFactors: Array<{
    name: string;
    impact: "High" | "Medium" | "Low";
    status: "Good" | "Fair" | "Needs Attention";
    tip: string;
  }>;
  educationalRecommendations: string[];
  disclaimer: string;
}

export interface HealthPillar {
  name: string;
  score: number; // 0 - 100
  weight: number; // 0 - 1
  weightedScore: number;
  metric: string;
  description: string;
  status: "Excellent" | "Good" | "Fair" | "Action Required";
}

export interface FinancialHealthScore {
  overallScore: number; // 0 - 100
  tier: "Prime" | "Strong" | "Balanced" | "Stretched" | "Critical";
  tierColor: string;
  summary: string;
  pillars: {
    debtBurden: HealthPillar;
    savingsBuffer: HealthPillar;
    budgetDiscipline: HealthPillar;
    creditHealth: HealthPillar;
    incomeStability: HealthPillar;
  };
  recommendations: string[];
}

export interface EmergencyFundCalculation {
  essentialExpenses: number;
  targetMonths: number;
  targetFund: number;
  currentFund: number;
  shortfallOrSurplus: number;
  progressPercent: number;
  monthsCoveredCurrent: number;
  monthlySavingsRequiredToReachGoalIn12Mo: number;
}

export interface StressTestScenarioInput {
  incomeChangePercent: number; // e.g. -10, -20
  expenseChangePercent: number; // e.g. +10, +20
  interestRateHikePercent: number; // e.g. +1.5, +2.5
  existingEmiIncreasePercent: number; // e.g. +10
}

export interface StressTestResult {
  scenarioName: string;
  stressedIncome: number;
  stressedExpenses: number;
  stressedExistingEmi: number;
  stressedLoanEmi: number;
  stressedTotalEmi: number;
  stressedFOIR: number;
  stressedDisposableIncome: number;
  resilienceScore: number; // 0 - 100
  riskLevel: "Low Risk" | "Moderate Risk" | "High Risk" | "Severe Vulnerability";
  isDeficit: boolean;
  warnings: string[];
}

export interface LoanComparisonOffer {
  id: string;
  provider: string;
  principal: number;
  annualRate: number;
  tenureMonths: number;
  processingFeePercent: number;
  otherCharges: number;
}

export interface ComparedOfferResult extends LoanComparisonOffer {
  monthlyEmi: number;
  totalInterest: number;
  totalRepayment: number;
  upfrontFees: number;
  totalCostOfCredit: number; // Repayment + Fees - Principal
  overallNetOutflow: number; // Total Repayment + Upfront Fees
}

export interface FinancialGoalItem {
  id: string;
  name: string;
  category: "Emergency" | "Home" | "Vehicle" | "Education" | "Travel" | "Debt" | "Other";
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  monthlyContributionRequired?: number;
  progressPercent?: number;
}

export interface BudgetItemCategory {
  id?: string;
  category: string;
  allocated: number;
  spent: number;
}

export interface AIAnalysisResponse {
  summary: string;
  insights: string[];
  considerations: string[];
  disclaimer: string;
  isMock?: boolean;
}

export interface EligibilityRuleConfig {
  id?: string;
  ruleVersion: string;
  minIncome: number;
  maxFOIR: number;
  minCreditScore: number;
  maxLoanTenure: number;
  maxMultiplier: number;
  isActive: boolean;
  updatedBy: string;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  metadata?: string;
  ipAddress?: string;
  createdAt: string;
  userName?: string;
  userEmail?: string;
}
