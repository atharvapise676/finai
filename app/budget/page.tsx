"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { BudgetPlanner } from "@/components/BudgetPlanner";
import { EmergencyFundCard } from "@/components/EmergencyFundCard";
import { TransactionAnomalyCard } from "@/components/TransactionAnomalyCard";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { PieChart, ShieldCheck } from "lucide-react";

export default function BudgetPage() {
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
            Cashflow & Stability Architecture
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
          Budget & Emergency Reserves Planner
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl">
          Implement disciplined 50/30/20 allocation, secure your liquid emergency cushion against shocks, and detect hidden subscription leakage.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7">
          <BudgetPlanner monthlyIncome={activeProfile.monthlyIncome} />
        </div>
        <div className="lg:col-span-5">
          <EmergencyFundCard
            monthlyExpenses={activeProfile.monthlyExpenses}
            existingEmi={activeProfile.existingEmi}
            currentSavings={activeProfile.savings}
          />
        </div>
      </div>

      {/* Transaction Anomaly Scanner */}
      <TransactionAnomalyCard />

      <DisclaimerBanner />
    </div>
  );
}
