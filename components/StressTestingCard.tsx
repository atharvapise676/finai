"use client";

import React, { useState } from "react";
import { UserFinancialProfile, StressTestResult } from "@/types";
import { runStressTest } from "@/lib/financial-engine";
import { Zap, AlertTriangle, ShieldCheck, TrendingDown, ArrowRight } from "lucide-react";

interface Props {
  profile: UserFinancialProfile;
  loanDetails?: { principal: number; rate: number; tenureMonths: number };
}

export const StressTestingCard: React.FC<Props> = ({
  profile,
  loanDetails = { principal: 2500000, rate: 8.5, tenureMonths: 240 },
}) => {
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);

  const predefinedScenarios = [
    {
      name: "Mild Headwind (-10% Income, +10% Living Costs)",
      description: "Moderate corporate pay freeze or mild inflation surge in daily living costs.",
      input: {
        incomeChangePercent: -10,
        expenseChangePercent: 10,
        interestRateHikePercent: 0.5,
        existingEmiIncreasePercent: 0,
      },
    },
    {
      name: "Severe Macro Shock (-20% Income, +15% Costs, +2% Interest Spike)",
      description: "Recessionary downturn combined with RBI benchmark interest rate hikes.",
      input: {
        incomeChangePercent: -20,
        expenseChangePercent: 15,
        interestRateHikePercent: 2.0,
        existingEmiIncreasePercent: 10,
      },
    },
    {
      name: "Rate Spike Crisis (+3.0% Floating Interest Rate Hike)",
      description: "Severe monetary policy tightening pushing floating home loan rates up significantly.",
      input: {
        incomeChangePercent: 0,
        expenseChangePercent: 5,
        interestRateHikePercent: 3.0,
        existingEmiIncreasePercent: 15,
      },
    },
  ];

  const currentScenario = predefinedScenarios[selectedScenarioIndex];
  const testResult: StressTestResult = runStressTest(
    profile,
    loanDetails,
    currentScenario.input,
    currentScenario.name
  );

  return (
    <div className="glass-panel rounded-2xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5" />
            <span>Macro Sensitivity & Resilience Engine</span>
          </span>
          <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
            Financial Stress Testing
          </h3>
        </div>
        <p className="text-xs text-slate-400">
          Simulate severe economic shocks to test debt repayment resilience before signing.
        </p>
      </div>

      {/* Scenario Selector Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-6">
        {predefinedScenarios.map((sc, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedScenarioIndex(idx)}
            className={`rounded-xl border p-3 text-left transition-all ${
              selectedScenarioIndex === idx
                ? "border-rose-500/40 bg-rose-500/10 shadow-lg text-white"
                : "border-white/5 bg-slate-950/40 text-slate-400 hover:text-white hover:border-white/15"
            }`}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-bold truncate">Scenario {idx + 1}</span>
              {selectedScenarioIndex === idx && (
                <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
              )}
            </div>
            <p className="text-[11px] leading-snug line-clamp-2">{sc.name}</p>
          </button>
        ))}
      </div>

      {/* Resilience Score & Warning Box */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center mb-6">
        {/* Resilience Score Gauge */}
        <div className="md:col-span-4 rounded-2xl border border-white/5 bg-slate-950/60 p-6 flex flex-col items-center justify-center text-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Resilience Score Under Shock
          </span>
          <div className="mt-2 text-4xl font-extrabold font-mono text-white">
            {testResult.resilienceScore}
            <span className="text-sm text-slate-500 font-sans font-normal"> / 100</span>
          </div>

          <div className="mt-2">
            <span
              className={`rounded-full px-3 py-0.5 text-xs font-bold ${
                testResult.resilienceScore >= 70
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : testResult.resilienceScore >= 50
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                  : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
              }`}
            >
              {testResult.riskLevel}
            </span>
          </div>

          <p className="mt-3 text-[11px] text-slate-400">
            {currentScenario.description}
          </p>
        </div>

        {/* Stressed Cashflow Metrics */}
        <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="rounded-xl border border-white/5 bg-slate-950/40 p-3">
            <span className="text-[10px] text-slate-400">Stressed Income</span>
            <div className="mt-1 font-mono text-sm font-bold text-white">
              ₹{testResult.stressedIncome.toLocaleString()}
            </div>
            <span className="text-[9px] text-slate-500 font-mono">Base: ₹{profile.monthlyIncome.toLocaleString()}</span>
          </div>

          <div className="rounded-xl border border-white/5 bg-slate-950/40 p-3">
            <span className="text-[10px] text-slate-400">Stressed Expenses</span>
            <div className="mt-1 font-mono text-sm font-bold text-slate-200">
              ₹{testResult.stressedExpenses.toLocaleString()}
            </div>
            <span className="text-[9px] text-slate-500 font-mono">Base: ₹{profile.monthlyExpenses.toLocaleString()}</span>
          </div>

          <div className="rounded-xl border border-white/5 bg-slate-950/40 p-3">
            <span className="text-[10px] text-slate-400">Stressed Total EMI</span>
            <div className="mt-1 font-mono text-sm font-bold text-cyan-400">
              ₹{testResult.stressedTotalEmi.toLocaleString()}
            </div>
            <span className="text-[9px] text-slate-500 font-mono">Loan EMI: ₹{testResult.stressedLoanEmi.toLocaleString()}</span>
          </div>

          <div className="rounded-xl border border-white/5 bg-slate-950/40 p-3">
            <span className="text-[10px] text-slate-400">Stressed Debt Burden (FOIR)</span>
            <div className={`mt-1 font-mono text-sm font-bold ${testResult.stressedFOIR > 0.5 ? "text-amber-400" : "text-emerald-400"}`}>
              {Math.round(testResult.stressedFOIR * 100)}%
            </div>
            <span className="text-[9px] text-slate-500">Ceiling: 50%</span>
          </div>

          <div className="col-span-2 rounded-xl border border-white/5 bg-slate-950/40 p-3">
            <span className="text-[10px] text-slate-400">Stressed Net Disposable Cashflow</span>
            <div className={`mt-1 font-mono text-sm font-extrabold ${testResult.stressedDisposableIncome >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
              {testResult.stressedDisposableIncome >= 0
                ? `+₹${testResult.stressedDisposableIncome.toLocaleString()} Surplus`
                : `-₹${Math.abs(testResult.stressedDisposableIncome).toLocaleString()} DEFICIT`}
            </div>
            <span className="text-[9px] text-slate-500">
              {testResult.isDeficit ? "Emergency reserve draw required" : "Buffer intact"}
            </span>
          </div>
        </div>
      </div>

      {/* Warnings & Risk Signals */}
      {testResult.warnings.length > 0 && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-4">
          <h4 className="text-xs font-bold text-rose-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4" />
            <span>Macro Stress Risk Triggers</span>
          </h4>
          <ul className="space-y-1.5 text-xs text-rose-200/90">
            {testResult.warnings.map((w, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-rose-400 mt-0.5">•</span>
                <span className="leading-snug">{w}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
