"use client";

import React, { useState } from "react";
import { calculateEmergencyFund } from "@/lib/financial-engine";
import { ShieldAlert, Umbrella, CheckCircle2, TrendingUp } from "lucide-react";

interface Props {
  monthlyExpenses: number;
  existingEmi: number;
  currentSavings: number;
}

export const EmergencyFundCard: React.FC<Props> = ({
  monthlyExpenses,
  existingEmi,
  currentSavings,
}) => {
  const [targetMonths, setTargetMonths] = useState(6);
  const essentialMonthlyBurn = monthlyExpenses + existingEmi;

  const result = calculateEmergencyFund(essentialMonthlyBurn, targetMonths, currentSavings);

  return (
    <div className="glass-panel rounded-2xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Liquidity Buffer Calculator
          </span>
          <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
            Emergency Fund Readiness
          </h3>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-900 border border-white/10 rounded-lg p-1 text-xs">
          {[3, 6, 9, 12].map((m) => (
            <button
              key={m}
              onClick={() => setTargetMonths(m)}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                targetMonths === m
                  ? "bg-emerald-500 text-slate-950 shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {m} Months
            </button>
          ))}
        </div>
      </div>

      {/* Target vs Actual Progress */}
      <div className="mb-6 rounded-2xl border border-white/5 bg-slate-950/40 p-5">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mb-3">
          <div>
            <span className="text-xs text-slate-400">Target Safety Reserve:</span>
            <div className="font-mono text-2xl font-extrabold text-white">
              ₹{result.targetFund.toLocaleString()}
            </div>
            <span className="text-[11px] text-slate-500">
              ₹{essentialMonthlyBurn.toLocaleString()}/mo essential burn × {targetMonths} months
            </span>
          </div>

          <div className="sm:text-right">
            <span className="text-xs text-slate-400">Current Dedicated Liquid Reserves:</span>
            <div className="font-mono text-xl font-bold text-emerald-400">
              ₹{result.currentFund.toLocaleString()}
            </div>
            <span className="text-[11px] font-mono text-cyan-300">
              {result.monthsCoveredCurrent} Months Covered
            </span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="space-y-1.5 mt-4">
          <div className="flex justify-between text-xs font-mono">
            <span className="text-slate-400">Funding Level</span>
            <span className="text-emerald-400 font-bold">{result.progressPercent}%</span>
          </div>
          <div className="h-3 w-full rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-700"
              style={{ width: `${result.progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        <div className="rounded-xl border border-white/5 bg-slate-950/40 p-4">
          <span className="text-[10px] text-slate-400 font-medium">Shortfall / Surplus Buffer</span>
          <div className={`mt-1 font-mono text-base font-bold ${result.shortfallOrSurplus >= 0 ? "text-emerald-400" : "text-amber-400"}`}>
            {result.shortfallOrSurplus >= 0
              ? `+₹${result.shortfallOrSurplus.toLocaleString()} Surplus`
              : `-₹${Math.abs(result.shortfallOrSurplus).toLocaleString()} Shortfall`}
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            {result.shortfallOrSurplus >= 0
              ? "Your liquid cushion fully shields you against income disruption."
              : "Funding gap exists. An unexpected shock would require debt or asset liquidation."}
          </p>
        </div>

        <div className="rounded-xl border border-white/5 bg-slate-950/40 p-4">
          <span className="text-[10px] text-slate-400 font-medium">12-Month Target Roadmap</span>
          <div className="mt-1 font-mono text-base font-bold text-cyan-400">
            ₹{result.monthlySavingsRequiredToReachGoalIn12Mo.toLocaleString()} / month
          </div>
          <p className="mt-1 text-[11px] text-slate-400">
            Monthly savings allocation needed to fully bridge the reserve gap over the next 12 billing cycles.
          </p>
        </div>
      </div>
    </div>
  );
};
