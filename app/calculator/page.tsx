"use client";

import React, { useState } from "react";
import { EMICalculator } from "@/components/EMICalculator";
import { WhatIfSimulator } from "@/components/WhatIfSimulator";
import { LoanComparisonTable } from "@/components/LoanComparisonTable";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { Calculator, Layers, ArrowLeftRight } from "lucide-react";

export default function CalculatorPage() {
  const [activeTab, setActiveTab] = useState<"emi" | "whatif" | "compare">("emi");

  return (
    <div className="space-y-8 pb-12">
      <div className="border-b border-white/5 pb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Deterministic Financial Math
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
          Loan Calculations & Simulation Suite
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl">
          Calculate monthly installments, explore sensitivity tradeoffs between tenure and cumulative interest, and compare multiple lender offers side by side.
        </p>

        {/* Tab Switcher */}
        <div className="flex gap-2 mt-6">
          <button
            onClick={() => setActiveTab("emi")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
              activeTab === "emi"
                ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
                : "border border-white/10 bg-slate-900/60 text-slate-300 hover:bg-white/5"
            }`}
          >
            <Calculator className="h-4 w-4" />
            <span>EMI & Amortization</span>
          </button>

          <button
            onClick={() => setActiveTab("whatif")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
              activeTab === "whatif"
                ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
                : "border border-white/10 bg-slate-900/60 text-slate-300 hover:bg-white/5"
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>What-If Simulator</span>
          </button>

          <button
            onClick={() => setActiveTab("compare")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all ${
              activeTab === "compare"
                ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
                : "border border-white/10 bg-slate-900/60 text-slate-300 hover:bg-white/5"
            }`}
          >
            <ArrowLeftRight className="h-4 w-4" />
            <span>Loan Comparison</span>
          </button>
        </div>
      </div>

      {/* Tab Panels */}
      {activeTab === "emi" && <EMICalculator />}
      {activeTab === "whatif" && <WhatIfSimulator />}
      {activeTab === "compare" && <LoanComparisonTable />}

      <DisclaimerBanner />
    </div>
  );
}
