"use client";

import React, { useState } from "react";
import { calculateEMI, round } from "@/lib/financial-engine";
import { Sliders, TrendingDown, DollarSign, Calendar, Layers } from "lucide-react";

interface Props {
  defaultPrincipal?: number;
  defaultRate?: number;
  defaultIncome?: number;
  defaultExistingEmi?: number;
  defaultExpenses?: number;
}

export const WhatIfSimulator: React.FC<Props> = ({
  defaultPrincipal = 2000000,
  defaultRate = 8.5,
  defaultIncome = 85000,
  defaultExistingEmi = 8000,
  defaultExpenses = 32000,
}) => {
  const [principal, setPrincipal] = useState(defaultPrincipal);
  const [rate, setRate] = useState(defaultRate);
  const [income, setIncome] = useState(defaultIncome);
  const [existingEmi, setExistingEmi] = useState(defaultExistingEmi);
  const [expenses, setExpenses] = useState(defaultExpenses);

  const tenureBenchmarks = [5, 7, 10, 15, 20];

  const comparisons = tenureBenchmarks.map((years) => {
    const months = years * 12;
    const calc = calculateEMI({ principal, annualRate: rate, tenureMonths: months });
    const totalEmi = round(existingEmi + calc.monthlyEmi);
    const foir = income > 0 ? round((totalEmi / income) * 100) : 100;
    const disposable = round(income - expenses - totalEmi);

    return {
      years,
      months,
      emi: calc.monthlyEmi,
      totalInterest: calc.totalInterest,
      totalRepayment: calc.totalRepayment,
      foir,
      disposable,
    };
  });

  return (
    <div className="glass-panel rounded-2xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Interactive Scenario Engine
          </span>
          <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
            What-If Loan Simulator
          </h3>
        </div>
        <p className="text-xs text-slate-400">
          Slide parameters to instantly visualize trade-offs between EMI and cumulative interest.
        </p>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 rounded-2xl border border-white/5 bg-slate-950/40 p-5 mb-8">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400">Loan Principal</span>
            <span className="font-mono text-emerald-400 font-bold">₹{principal.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min="100000"
            max="15000000"
            step="50000"
            value={principal}
            onChange={(e) => setPrincipal(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400">Interest Rate</span>
            <span className="font-mono text-cyan-400 font-bold">{rate}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="18"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400">Monthly Gross Income</span>
            <span className="font-mono text-white font-bold">₹{income.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min="20000"
            max="300000"
            step="5000"
            value={income}
            onChange={(e) => setIncome(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Tenure Scenarios Grid */}
      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
        Tenure Sensitivity Matrix (5 vs 7 vs 10 vs 15 vs 20 Years)
      </h4>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {comparisons.map((c, idx) => (
          <div
            key={c.years}
            className={`rounded-xl border p-4 transition-all ${
              idx === 2
                ? "border-emerald-500/40 bg-emerald-500/10 shadow-glass-glow"
                : "border-white/5 bg-slate-950/60 hover:border-white/15"
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-white">{c.years} Years</span>
              <span className="text-[10px] text-slate-400 font-mono">{c.months} mo</span>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="text-[10px] text-slate-400">Monthly EMI:</span>
                <p className="font-mono text-sm font-extrabold text-emerald-400">
                  ₹{c.emi.toLocaleString()}
                </p>
              </div>

              <div>
                <span className="text-[10px] text-slate-400">Total Interest Cost:</span>
                <p className="font-mono text-xs font-semibold text-cyan-300">
                  ₹{c.totalInterest.toLocaleString()}
                </p>
              </div>

              <div>
                <span className="text-[10px] text-slate-400">Debt Ratio (FOIR):</span>
                <p className={`font-mono text-xs font-bold ${c.foir > 50 ? "text-amber-400" : "text-slate-300"}`}>
                  {c.foir}%
                </p>
              </div>

              <div className="border-t border-white/5 pt-2">
                <span className="text-[10px] text-slate-400">Disposable Buffer:</span>
                <p className={`font-mono text-xs font-bold ${c.disposable >= 0 ? "text-emerald-300" : "text-rose-400"}`}>
                  ₹{c.disposable.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-white/5 bg-slate-950/40 p-3 text-xs text-slate-400 flex items-center gap-2">
        <TrendingDown className="h-4 w-4 text-cyan-400 shrink-0" />
        <span>
          <strong>Key Insight:</strong> Notice how increasing tenure from 5 to 15 years cuts monthly EMI by ~50%, but increases total interest payable by over 200%.
        </span>
      </div>
    </div>
  );
};
