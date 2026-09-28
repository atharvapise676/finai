"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { LoanAffordabilityCard } from "@/components/LoanAffordabilityCard";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { Compass, Info, CheckCircle2, ShieldCheck } from "lucide-react";

export default function AffordabilityPage() {
  const { profile } = useAuth();

  const activeProfile = profile || {
    name: "Aarav Sharma",
    email: "demo@finai.com",
    monthlyIncome: 85000,
    monthlyExpenses: 32000,
    existingEmi: 8000,
    savings: 180000,
    emergencyFund: 150000,
    creditScore: 780,
    employmentType: "salaried" as const,
    age: 31,
    dependents: 1,
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="border-b border-white/5 pb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Decision Support Architecture
          </span>
          <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-slate-400">
            FOIR & Affordability
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
          Loan Affordability & Eligibility Intelligence
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl">
          Evaluate whether requested credit obligations remain within safe debt-to-income benchmarks. Transparently see every positive supporting factor and risk attention trigger.
        </p>
      </div>

      <LoanAffordabilityCard profile={activeProfile} initialLoanAmount={2500000} initialRate={8.5} initialTenureMonths={240} />

      {/* Explanatory Guide Box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel rounded-2xl p-5 space-y-2">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">What is FOIR?</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Fixed Obligation to Income Ratio (FOIR) measures what percentage of your monthly income goes toward debt repayment. Most regulated lenders cap FOIR at 45% - 50%.
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-5 space-y-2">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Explainable Factors</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            FinAI displays the exact mathematical reasons behind every estimate. We never show an opaque "Approved" or "Rejected" label.
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-5 space-y-2">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">Buffer Preservation</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Ensuring your post-EMI disposable income leaves at least 20% to 25% surplus protects you against sudden medical or household emergencies.
          </p>
        </div>
      </div>

      <DisclaimerBanner />
    </div>
  );
}
