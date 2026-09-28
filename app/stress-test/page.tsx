"use client";

import React from "react";
import { useAuth } from "@/context/AuthContext";
import { StressTestingCard } from "@/components/StressTestingCard";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { Zap, AlertTriangle, ShieldCheck } from "lucide-react";

export default function StressTestPage() {
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
          <span className="text-xs font-semibold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
            <Zap className="h-3.5 w-3.5" />
            <span>Macro Stress Simulation</span>
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
          Financial Stress Testing Engine
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl">
          Don't test loan serviceability only under ideal conditions. Simulate economic shocks, rate hikes, and living inflation to stress-test your cashflow before signing loan agreements.
        </p>
      </div>

      <StressTestingCard profile={activeProfile} />

      {/* Stress Testing Methodology Guidance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-panel rounded-2xl p-5 space-y-2">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            Floating Interest Rate Risk
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Most home loans in India and global markets are floating-rate loans benchmarked against repo rates. A 2% interest rate spike on a 20-year loan can expand total interest payable by several lakhs or lengthen tenure by years.
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-5 space-y-2">
          <h4 className="text-xs font-bold text-white uppercase tracking-wider">
            Cashflow Deficit Protection
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            If a scenario pushes your net cashflow into a negative monthly deficit, that deficit must be funded from your liquid savings. A 6-month emergency reserve ensures you avoid loan defaults during temporary income disruptions.
          </p>
        </div>
      </div>

      <DisclaimerBanner />
    </div>
  );
}
