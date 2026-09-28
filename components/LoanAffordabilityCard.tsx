"use client";

import React, { useState } from "react";
import { UserFinancialProfile, AffordabilityResult } from "@/types";
import { calculateAffordability, DEFAULT_ELIGIBILITY_RULES } from "@/lib/financial-engine";
import { CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, HelpCircle, Bot, Sparkles } from "lucide-react";
import Link from "next/link";

interface Props {
  profile: UserFinancialProfile;
  initialLoanAmount?: number;
  initialRate?: number;
  initialTenureMonths?: number;
}

export const LoanAffordabilityCard: React.FC<Props> = ({
  profile,
  initialLoanAmount = 2500000,
  initialRate = 8.5,
  initialTenureMonths = 240,
}) => {
  const [requestedLoan, setRequestedLoan] = useState(initialLoanAmount);
  const [annualRate, setAnnualRate] = useState(initialRate);
  const [tenureMonths, setTenureMonths] = useState(initialTenureMonths);

  const result: AffordabilityResult = calculateAffordability(
    {
      monthlyIncome: profile.monthlyIncome,
      monthlyExpenses: profile.monthlyExpenses,
      existingEmi: profile.existingEmi,
      requestedLoan,
      annualRate,
      tenureMonths,
      creditScore: profile.creditScore,
      employmentType: profile.employmentType,
    },
    DEFAULT_ELIGIBILITY_RULES
  );

  const statusColor =
    result.statusBadge === "success"
      ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
      : result.statusBadge === "warning"
      ? "text-amber-400 border-amber-500/30 bg-amber-500/10"
      : "text-rose-400 border-rose-500/30 bg-rose-500/10";

  return (
    <div className="glass-panel rounded-2xl p-6 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Rule-Based Affordability Engine
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Policy {result.ruleVersion}</span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
            Loan Affordability & Eligibility
          </h3>
        </div>

        <Link
          href={`/assistant?q=${encodeURIComponent(`Can I afford a loan of ₹${requestedLoan.toLocaleString()} at ${annualRate}% for ${Math.round(tenureMonths / 12)} years under my current income of ₹${profile.monthlyIncome.toLocaleString()} and FOIR of ${Math.round(result.newFOIR * 100)}%?`)}`}
          className="flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-300 hover:bg-cyan-500/20 transition-all w-fit"
        >
          <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
          <span>Explain With AI</span>
        </Link>
      </div>

      {/* Inputs Strip */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4 rounded-xl border border-white/5 bg-slate-950/60 p-4">
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">
            Requested Loan Amount (₹)
          </label>
          <input
            type="number"
            step="50000"
            value={requestedLoan}
            onChange={(e) => setRequestedLoan(Math.max(0, Number(e.target.value)))}
            className="w-full rounded-lg glass-input px-3 py-1.5 text-xs font-mono font-bold text-white"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">
            Interest Rate (%)
          </label>
          <input
            type="number"
            step="0.1"
            value={annualRate}
            onChange={(e) => setAnnualRate(Math.max(0, Number(e.target.value)))}
            className="w-full rounded-lg glass-input px-3 py-1.5 text-xs font-mono font-bold text-white"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">
            Tenure (Months / Years)
          </label>
          <select
            value={tenureMonths}
            onChange={(e) => setTenureMonths(Number(e.target.value))}
            className="w-full rounded-lg glass-input px-3 py-1.5 text-xs bg-slate-900 text-white font-mono"
          >
            <option value="60">60 Months (5 Years)</option>
            <option value="120">120 Months (10 Years)</option>
            <option value="180">180 Months (15 Years)</option>
            <option value="240">240 Months (20 Years)</option>
            <option value="300">300 Months (25 Years)</option>
            <option value="360">360 Months (30 Years)</option>
          </select>
        </div>
      </div>

      {/* Status Banner */}
      <div className={`mb-6 rounded-xl border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${statusColor}`}>
        <div className="flex items-center gap-3">
          {result.statusBadge === "success" ? (
            <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-400" />
          ) : (
            <AlertTriangle className="h-6 w-6 shrink-0 text-amber-400" />
          )}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider opacity-80">
              Evaluation Outcome
            </span>
            <h4 className="text-base font-bold text-white">{result.status}</h4>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] uppercase text-slate-400 font-semibold">New Loan Monthly EMI</span>
          <div className="font-mono text-lg font-extrabold text-white">
            ₹{result.monthlyEmi.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="rounded-xl border border-white/5 bg-slate-950/40 p-3">
          <span className="text-[10px] text-slate-400 font-medium">Post-Loan Total EMI</span>
          <div className="mt-1 font-mono text-sm font-bold text-white">
            ₹{result.totalEmiBurden.toLocaleString()}
          </div>
          <span className="text-[9px] text-slate-500 font-mono">Existing: ₹{profile.existingEmi.toLocaleString()}</span>
        </div>

        <div className="rounded-xl border border-white/5 bg-slate-950/40 p-3">
          <span className="text-[10px] text-slate-400 font-medium">Debt Burden (FOIR)</span>
          <div className="mt-1 font-mono text-sm font-bold text-cyan-400">
            {Math.round(result.newFOIR * 100)}%
          </div>
          <span className="text-[9px] text-slate-500">Max Configured: 50%</span>
        </div>

        <div className="rounded-xl border border-white/5 bg-slate-950/40 p-3">
          <span className="text-[10px] text-slate-400 font-medium">Post-EMI Disposable</span>
          <div className={`mt-1 font-mono text-sm font-bold ${result.disposableIncomeAfter >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
            ₹{result.disposableIncomeAfter.toLocaleString()}
          </div>
          <span className="text-[9px] text-slate-500">Before: ₹{result.disposableIncomeBefore.toLocaleString()}</span>
        </div>

        <div className="rounded-xl border border-white/5 bg-slate-950/40 p-3">
          <span className="text-[10px] text-slate-400 font-medium">Max Affordable Loan</span>
          <div className="mt-1 font-mono text-sm font-bold text-indigo-400">
            ₹{result.maxAffordableLoan.toLocaleString()}
          </div>
          <span className="text-[9px] text-slate-500">At 50% FOIR limit</span>
        </div>
      </div>

      {/* Explainable Decision Factors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Positive Factors */}
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
          <h5 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4" />
            <span>Supporting Positive Factors</span>
          </h5>
          <ul className="space-y-2 text-xs text-slate-300">
            {result.positiveFactors.map((f, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5">✓</span>
                <span className="leading-snug">{f}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Factors Requiring Attention */}
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
          <h5 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <AlertTriangle className="h-4 w-4" />
            <span>Factors Requiring Review</span>
          </h5>
          <ul className="space-y-2 text-xs text-slate-300">
            {result.attentionFactors.map((f, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-amber-400 mt-0.5">⚠</span>
                <span className="leading-snug">{f}</span>
              </li>
            ))}
            {result.attentionFactors.length === 0 && (
              <li className="text-slate-400 italic">No adverse risk triggers detected under configured criteria.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};
