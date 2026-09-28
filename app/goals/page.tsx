"use client";

import React from "react";
import { GoalsTracker } from "@/components/GoalsTracker";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { Target, Sparkles, TrendingUp, CheckCircle2 } from "lucide-react";

export default function GoalsPage() {
  return (
    <div className="space-y-8 pb-12">
      <div className="border-b border-white/5 pb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Aspirations & Future Capital
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
          Financial Goals & Milestones
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl">
          Set clear milestones for emergency cushions, home down payments, vehicles, and education. Track progress visually and calculate monthly capital requirements.
        </p>
      </div>

      <GoalsTracker />

      {/* Goal Strategy Tips */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-panel rounded-2xl p-5 space-y-2">
          <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Automate Regular Deposits</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Schedule standing instructions (SIPs) right after salary credit day. Treating savings as a non-negotiable expense drastically boosts completion probability.
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-5 space-y-2">
          <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Protect the Emergency Core</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Keep your 6-month emergency buffer strictly in liquid mutual funds or sweep-in FDs, distinct from speculative growth investments.
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-5 space-y-2">
          <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Accelerate Debt Paydown</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            If carrying high-cost loans, paying them off gives an effective risk-free guaranteed return equal to the loan interest rate.
          </p>
        </div>
      </div>

      <DisclaimerBanner />
    </div>
  );
}
