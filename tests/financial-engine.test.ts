import { describe, it, expect } from "vitest";
import {
  calculateEMI,
  calculateFOIR,
  calculateAffordability,
  analyzeCreditScore,
  calculateFinancialHealth,
  calculateEmergencyFund,
  runStressTest,
  compareLoanOffers,
  DEFAULT_ELIGIBILITY_RULES,
} from "../lib/financial-engine";
import { UserFinancialProfile } from "../types";

describe("Deterministic Financial Engine Tests", () => {
  describe("EMI Calculation", () => {
    it("should calculate standard EMI accurately", () => {
      // Principal: 10,00,000, Rate: 8.5% p.a., Tenure: 120 months (10 years)
      const result = calculateEMI({
        principal: 1000000,
        annualRate: 8.5,
        tenureMonths: 120,
      });

      // Standard financial formula yields ~12398.57
      expect(result.monthlyEmi).toBeGreaterThan(12390);
      expect(result.monthlyEmi).toBeLessThan(12410);
      expect(result.totalPrincipal).toBe(1000000);
      expect(result.totalRepayment).toBeGreaterThan(1480000);
      expect(result.totalInterest).toBeCloseTo(result.totalRepayment - result.totalPrincipal, 2);
      expect(result.principalPercent + result.interestPercent).toBeCloseTo(100, 0);
      expect(result.amortizationPreview.length).toBe(12);
    });

    it("should handle zero-interest loans correctly without division by zero", () => {
      const result = calculateEMI({
        principal: 120000,
        annualRate: 0,
        tenureMonths: 12,
      });

      expect(result.monthlyEmi).toBe(10000);
      expect(result.totalInterest).toBe(0);
      expect(result.totalRepayment).toBe(120000);
      expect(result.principalPercent).toBe(100);
      expect(result.interestPercent).toBe(0);
    });

    it("should safely handle zero or negative principal", () => {
      const zeroResult = calculateEMI({
        principal: 0,
        annualRate: 9,
        tenureMonths: 60,
      });
      expect(zeroResult.monthlyEmi).toBe(0);
      expect(zeroResult.totalRepayment).toBe(0);

      const negResult = calculateEMI({
        principal: -50000,
        annualRate: 9,
        tenureMonths: 60,
      });
      expect(negResult.monthlyEmi).toBe(0);
    });
  });

  describe("FOIR Calculation", () => {
    it("should calculate Fixed Obligation to Income Ratio correctly", () => {
      const foir = calculateFOIR(20000, 50000);
      expect(foir).toBe(0.4); // 40%

      const zeroIncomeFoir = calculateFOIR(10000, 0);
      expect(zeroIncomeFoir).toBe(1.0); // Safety default 100%
    });
  });

  describe("Affordability & Explainable Eligibility", () => {
    it("should return within-criteria status for prime applicant", () => {
      const result = calculateAffordability(
        {
          monthlyIncome: 80000,
          monthlyExpenses: 30000,
          existingEmi: 5000,
          requestedLoan: 1500000,
          annualRate: 8.5,
          tenureMonths: 180,
          creditScore: 780,
        },
        DEFAULT_ELIGIBILITY_RULES
      );

      expect(result.status).toBe("Estimated within configured criteria");
      expect(result.statusBadge).toBe("success");
      expect(result.positiveFactors.length).toBeGreaterThan(2);
      expect(result.disposableIncomeAfter).toBeGreaterThan(0);
      expect(result.ruleVersion).toBe(DEFAULT_ELIGIBILITY_RULES.ruleVersion);
    });

    it("should flag outside-criteria status when debt obligations breach ceiling", () => {
      const result = calculateAffordability(
        {
          monthlyIncome: 30000,
          monthlyExpenses: 20000,
          existingEmi: 12000,
          requestedLoan: 3000000, // Massive loan for 30k income
          annualRate: 11,
          tenureMonths: 60,
          creditScore: 600, // Low credit score
        },
        DEFAULT_ELIGIBILITY_RULES
      );

      expect(result.status).toBe("Outside configured criteria");
      expect(result.statusBadge).toBe("danger");
      expect(result.attentionFactors.length).toBeGreaterThan(0);
    });
  });

  describe("Credit Score Analyzer", () => {
    it("should categorize scores into correct educational tiers", () => {
      const exceptional = analyzeCreditScore(820);
      expect(exceptional.tier).toBe("Exceptional");
      expect(exceptional.benchmarkPercentile).toBe(92);

      const fair = analyzeCreditScore(620);
      expect(fair.tier).toBe("Fair");

      const poor = analyzeCreditScore(500);
      expect(poor.tier).toBe("Poor");

      expect(exceptional.disclaimer).toContain("FinAI provides educational credit score analysis");
    });
  });

  describe("Financial Health Indicator (0 - 100)", () => {
    const primeProfile: UserFinancialProfile = {
      name: "Test User",
      email: "test@example.com",
      monthlyIncome: 90000,
      monthlyExpenses: 30000,
      existingEmi: 8000,
      savings: 300000,
      emergencyFund: 200000,
      creditScore: 790,
      employmentType: "salaried",
      age: 32,
      dependents: 1,
    };

    it("should compute transparent 5-pillar health score within 0 to 100", () => {
      const health = calculateFinancialHealth(primeProfile);
      expect(health.overallScore).toBeGreaterThanOrEqual(75);
      expect(health.overallScore).toBeLessThanOrEqual(100);
      expect(health.tier).toBe("Prime");

      // Verify all 5 pillars are populated
      expect(health.pillars.debtBurden.weightedScore).toBeGreaterThan(0);
      expect(health.pillars.savingsBuffer.weightedScore).toBeGreaterThan(0);
      expect(health.pillars.budgetDiscipline.weightedScore).toBeGreaterThan(0);
      expect(health.pillars.creditHealth.weightedScore).toBeGreaterThan(0);
      expect(health.pillars.incomeStability.weightedScore).toBeGreaterThan(0);
    });

    it("should penalize high debt burden and zero savings", () => {
      const stressedProfile: UserFinancialProfile = {
        name: "Stressed User",
        email: "stressed@example.com",
        monthlyIncome: 40000,
        monthlyExpenses: 25000,
        existingEmi: 22000, // EMI > 50%
        savings: 5000, // Almost no buffer
        emergencyFund: 0,
        creditScore: 590,
        employmentType: "freelancer",
        age: 29,
        dependents: 3,
      };

      const health = calculateFinancialHealth(stressedProfile);
      expect(health.overallScore).toBeLessThan(50);
      expect(health.tier).toMatch(/Stretched|Critical/);
      expect(health.recommendations.length).toBeGreaterThan(1);
    });
  });

  describe("Emergency Fund Calculation", () => {
    it("should calculate required target and monthly roadmap", () => {
      const result = calculateEmergencyFund(30000, 6, 90000);
      expect(result.targetFund).toBe(180000); // 30k * 6
      expect(result.currentFund).toBe(90000);
      expect(result.shortfallOrSurplus).toBe(-90000);
      expect(result.progressPercent).toBe(50);
      expect(result.monthlySavingsRequiredToReachGoalIn12Mo).toBe(7500); // 90000 / 12
    });
  });

  describe("Financial Stress Testing", () => {
    const profile: UserFinancialProfile = {
      name: "Stress Profile",
      email: "test@example.com",
      monthlyIncome: 70000,
      monthlyExpenses: 30000,
      existingEmi: 10000,
      savings: 100000,
      emergencyFund: 50000,
      creditScore: 720,
      employmentType: "salaried",
      age: 30,
      dependents: 1,
    };

    it("should accurately simulate income reduction and expense hike", () => {
      const result = runStressTest(
        profile,
        { principal: 1000000, rate: 9, tenureMonths: 120 },
        {
          incomeChangePercent: -20, // 20% income cut
          expenseChangePercent: 15, // 15% inflation
          interestRateHikePercent: 2.0, // +2% rate jump
          existingEmiIncreasePercent: 0,
        },
        "Recessionary Stagflation"
      );

      expect(result.stressedIncome).toBe(56000); // 70k - 20%
      expect(result.stressedExpenses).toBe(34500); // 30k + 15%
      expect(result.stressedLoanEmi).toBeGreaterThan(13000);
      expect(result.resilienceScore).toBeLessThan(60);
      expect(result.warnings.length).toBeGreaterThan(0);
    });
  });

  describe("Loan Comparison Engine", () => {
    it("should compare offers and compute upfront fees and net outflow transparently", () => {
      const offers = [
        {
          id: "bank-a",
          provider: "Axis Bank Hypo",
          principal: 1000000,
          annualRate: 8.5,
          tenureMonths: 120,
          processingFeePercent: 1.0,
          otherCharges: 2500,
        },
        {
          id: "bank-b",
          provider: "HDFC Bank Hypo",
          principal: 1000000,
          annualRate: 8.8,
          tenureMonths: 120,
          processingFeePercent: 0.5,
          otherCharges: 1000,
        },
      ];

      const compared = compareLoanOffers(offers);
      expect(compared.length).toBe(2);
      expect(compared[0].upfrontFees).toBe(12500); // 1% of 10L (10,000) + 2500
      expect(compared[1].upfrontFees).toBe(6000); // 0.5% of 10L (5,000) + 1000
      expect(compared[0].monthlyEmi).toBeLessThan(compared[1].monthlyEmi); // 8.5% < 8.8%
    });
  });
});
