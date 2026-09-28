"use client";

import React, { useState } from "react";
import Link from "next/link";
import { FinancialHealthScore } from "@/types";
import { ShieldCheck, Info, ChevronRight, AlertTriangle, ArrowUpRight } from "lucide-react";

interface Props {
  health: FinancialHealthScore;
}

export const FinancialHealthScoreCard: React.FC<Props> = ({ health }) => {
  const [showMethodologyModal, setShowMethodologyModal] = useState(false);

  const pillars = [
    health.pillars.debtBurden,
    health.pillars.savingsBuffer,
    health.pillars.budgetDiscipline,
    health.pillars.creditHealth,
    health.pillars.incomeStability,
  ];

  return (
    <div className="glass-panel rounded-2xl p-6 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute -top-12 -right-12 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Deterministic Scoring Engine
            </span>
            <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-slate-400">
              5 Weighted Pillars
            </span>
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">Financial Health Indicator</h3>
        </div>

        <button
          onClick={() => setShowMethodologyModal(true)}
          className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/10 transition-colors w-fit"
        >
          <Info className="h-3.5 w-3.5 text-emerald-400" />
          <span>Scoring Methodology</span>
        </button>
      </div>

      {/* Main Score Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Big Circular Metric */}
        <div className="md:col-span-4 flex flex-col items-center justify-center p-6 rounded-2xl border border-white/5 bg-slate-950/40 text-center relative">
          <div className="relative flex items-center justify-center">
            {/* SVG Progress Circle */}
            <svg className="h-36 w-36 -rotate-90 transform" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="currentColor"
                strokeWidth="10"
                className="text-slate-800"
                fill="transparent"
              />
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="currentColor"
                strokeWidth="10"
                className="text-emerald-500 transition-all duration-1000 ease-out"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 50}
                strokeDashoffset={2 * Math.PI * 50 * (1 - health.overallScore / 100)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-extrabold text-white tracking-tight font-mono">
                {health.overallScore}
              </span>
              <span className="text-[10px] text-slate-400 font-semibold tracking-wider">OUT OF 100</span>
            </div>
          </div>

          <div className="mt-3">
            <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${
              health.overallScore >= 75
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                : health.overallScore >= 55
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
            }`}>
              {health.tier} Financial Tier
            </span>
          </div>

          <p className="mt-2 text-xs text-slate-400 leading-relaxed px-2">
            {health.summary}
          </p>
        </div>

        {/* 5-Pillar Breakdown Bars */}
        <div className="md:col-span-8 space-y-3.5">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Pillar-Level Breakdown
          </h4>
          {pillars.map((pillar) => (
            <div key={pillar.name} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-200">{pillar.name}</span>
                  <span className="text-[10px] text-slate-400">({Math.round(pillar.weight * 100)}% weight)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono text-emerald-400 font-medium">{pillar.metric}</span>
                  <span className="font-mono text-xs font-bold text-white">{pillar.score}/100</span>
                </div>
              </div>

              {/* Progress track */}
              <div className="h-2 w-full rounded-full bg-slate-800/80 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    pillar.score >= 75
                      ? "bg-gradient-to-r from-emerald-500 to-teal-400"
                      : pillar.score >= 50
                      ? "bg-gradient-to-r from-cyan-500 to-blue-400"
                      : "bg-gradient-to-r from-amber-500 to-rose-400"
                  }`}
                  style={{ width: `${pillar.score}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-[10px] text-slate-400">
                <span>{pillar.description}</span>
                <span className={`font-medium ${pillar.status === "Excellent" || pillar.status === "Good" ? "text-emerald-400" : "text-amber-400"}`}>
                  {pillar.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actionable Recommendations */}
      <div className="mt-6 rounded-xl border border-white/5 bg-slate-950/40 p-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-emerald-400 mb-2 flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4" />
          <span>Priority Optimization Steps</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300">
          {health.recommendations.map((rec, i) => (
            <div key={i} className="flex items-start gap-2 bg-slate-900/60 rounded-lg p-2.5 border border-white/5">
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-[10px] font-bold text-emerald-400">
                {i + 1}
              </span>
              <span className="leading-snug">{rec}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Methodology Modal */}
      {showMethodologyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-xl rounded-2xl border border-white/10 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-2xl">
            <h3 className="text-lg font-bold text-white tracking-tight mb-2">
              Financial Health Scoring Methodology
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              FinAI computes this proprietary 0-100 score using purely deterministic formulas. AI is never involved in computing mathematical figures.
            </p>

            <div className="space-y-3 text-xs text-slate-300 max-h-[60vh] overflow-y-auto pr-2">
              <div className="rounded-lg border border-white/5 bg-slate-950/60 p-3">
                <span className="font-semibold text-emerald-400">1. Debt Burden (FOIR) — 30% Weight</span>
                <p className="text-slate-400 mt-1">
                  Evaluates monthly debt obligations (EMIs) as a percentage of gross income. FOIR &lt; 30% earns a perfect 100 points, whereas FOIR &gt; 50% incurs severe deductions.
                </p>
              </div>

              <div className="rounded-lg border border-white/5 bg-slate-950/60 p-3">
                <span className="font-semibold text-teal-400">2. Savings Buffer — 25% Weight</span>
                <p className="text-slate-400 mt-1">
                  Measures total liquid emergency reserves divided by mandatory monthly burn (living expenses + EMIs). 6+ months achieves 100 points.
                </p>
              </div>

              <div className="rounded-lg border border-white/5 bg-slate-950/60 p-3">
                <span className="font-semibold text-cyan-400">3. Budget Discipline — 20% Weight</span>
                <p className="text-slate-400 mt-1">
                  Measures monthly net cashflow surplus rate (Disposable Income / Total Income). A surplus of 30%+ achieves 100 points.
                </p>
              </div>

              <div className="rounded-lg border border-white/5 bg-slate-950/60 p-3">
                <span className="font-semibold text-indigo-400">4. Credit Profile — 15% Weight</span>
                <p className="text-slate-400 mt-1">
                  Derived from standard credit bureau brackets (780+ = 100, 720-779 = 85, 660-719 = 65, &lt;660 = 35).
                </p>
              </div>

              <div className="rounded-lg border border-white/5 bg-slate-950/60 p-3">
                <span className="font-semibold text-amber-400">5. Income Stability — 10% Weight</span>
                <p className="text-slate-400 mt-1">
                  Evaluates employment resilience (salaried vs business/freelance) calibrated with dependent obligations.
                </p>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setShowMethodologyModal(false)}
                className="rounded-lg bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-400 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
