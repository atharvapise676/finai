"use client";

import React from "react";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { Compass, ShieldCheck, Scale, Calculator, Bot, FileText } from "lucide-react";

export default function MethodologyPage() {
  return (
    <div className="space-y-8 pb-12">
      <div className="border-b border-white/5 pb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Open Methodology Manifesto
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
          Scoring Methodology & Architectural Principles
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl">
          FinAI is built on radical algorithmic transparency. We publish the full mathematical formulas, pillar weights, and risk boundaries powering our intelligence platform.
        </p>
      </div>

      {/* Principle 1: Pure Determinism */}
      <div className="glass-panel rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Calculator className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              Principle 1: Separation of Mathematical Truth from AI Reasoning
            </h3>
            <span className="text-xs text-slate-400">Deterministic code calculates; AI interprets.</span>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          Large Language Models (LLMs) are probabilistic and prone to math hallucinations. Under FinAI architecture, <strong>Claude AI never calculates EMI, amortization, FOIR, interest, or health scores</strong>. Every numerical calculation executes in audited, deterministic TypeScript functions. The verified structured outputs are then passed to Claude solely for contextual synthesis and educational plain-language explanation.
        </p>

        <div className="rounded-xl border border-white/5 bg-slate-950/60 p-4 font-mono text-xs text-emerald-400">
          {`EMI = [P × r × (1 + r)^n] / [(1 + r)^n - 1]`}
          <div className="text-[11px] text-slate-400 mt-1 font-sans">
            Where P = Principal, r = Monthly Rate (annualRate / 12 / 100), and n = Tenure in Months.
            Zero-interest loans cleanly reduce to EMI = P / n.
          </div>
        </div>
      </div>

      {/* Principle 2: 5-Pillar Health Score Breakdown */}
      <div className="glass-panel rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Scale className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              Principle 2: The 5-Pillar Financial Health Indicator (0 - 100)
            </h3>
            <span className="text-xs text-slate-400">Holistic balance across liquid and obligation metrics.</span>
          </div>
        </div>

        <div className="space-y-3 text-xs text-slate-300">
          <div className="rounded-xl border border-white/5 bg-slate-950/40 p-4">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-emerald-400">1. Debt Burden Pillar (Weight: 30%)</span>
              <span className="font-mono text-slate-400">FOIR &lt; 30% = 100 pts | FOIR &gt; 50% = 20 pts</span>
            </div>
            <p className="text-slate-400">
              Evaluates monthly debt repayments relative to gross monthly income. Lower obligations directly translate to higher score elasticity.
            </p>
          </div>

          <div className="rounded-xl border border-white/5 bg-slate-950/40 p-4">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-teal-400">2. Savings Buffer Pillar (Weight: 25%)</span>
              <span className="font-mono text-slate-400">6+ Mo Buffer = 100 pts | &lt;1 Mo = 25 pts</span>
            </div>
            <p className="text-slate-400">
              Measures liquid emergency savings divided by mandatory monthly burn (living expenses + EMIs).
            </p>
          </div>

          <div className="rounded-xl border border-white/5 bg-slate-950/40 p-4">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-cyan-400">3. Budget Discipline Pillar (Weight: 20%)</span>
              <span className="font-mono text-slate-400">Surplus ≥ 30% = 100 pts | Deficit = 15 pts</span>
            </div>
            <p className="text-slate-400">
              Assesses net cashflow available after meeting essential living expenses and existing credit obligations.
            </p>
          </div>

          <div className="rounded-xl border border-white/5 bg-slate-950/40 p-4">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-indigo-400">4. Credit Standing Pillar (Weight: 15%)</span>
              <span className="font-mono text-slate-400">Score ≥ 780 = 100 pts | &lt;660 = 35 pts</span>
            </div>
            <p className="text-slate-400">
              Calibrates past credit discipline based on standard bureau tier distributions.
            </p>
          </div>

          <div className="rounded-xl border border-white/5 bg-slate-950/40 p-4">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-amber-400">5. Income Stability Pillar (Weight: 10%)</span>
              <span className="font-mono text-slate-400">Salaried = 95 pts | Business = 80 pts</span>
            </div>
            <p className="text-slate-400">
              Accounts for employment stability and dependent obligations in cashflow volatility.
            </p>
          </div>
        </div>
      </div>

      {/* Compliance Disclaimer */}
      <DisclaimerBanner />
    </div>
  );
}
