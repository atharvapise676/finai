"use client";

import React from "react";
import { analyzeCreditScore } from "@/lib/financial-engine";
import { ShieldCheck, Award, Info, AlertCircle, ArrowUpRight } from "lucide-react";

interface Props {
  score: number;
}

export const CreditScoreCard: React.FC<Props> = ({ score }) => {
  const analysis = analyzeCreditScore(score);

  return (
    <div className="glass-panel rounded-2xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Educational Bureau Analyzer
          </span>
          <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
            Credit Score & Risk Assessment
          </h3>
        </div>
        <span className="text-xs text-slate-400">
          Ranked in the <strong>{analysis.benchmarkPercentile}th percentile</strong> of borrowers
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center mb-6">
        {/* Visual Gauge */}
        <div className="md:col-span-4 flex flex-col items-center justify-center rounded-2xl border border-white/5 bg-slate-950/40 p-6 text-center">
          <div className="relative flex items-center justify-center">
            <svg className="h-32 w-32 -rotate-90 transform" viewBox="0 0 120 120">
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
                className="text-emerald-400 transition-all duration-1000 ease-out"
                fill="transparent"
                strokeDasharray={2 * Math.PI * 50}
                strokeDashoffset={2 * Math.PI * 50 * (1 - (analysis.score - 300) / 600)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-extrabold text-white font-mono">{analysis.score}</span>
              <span className="text-[10px] text-slate-400 font-semibold">RANGE 300-900</span>
            </div>
          </div>

          <div className="mt-3">
            <span className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${
              analysis.score >= 750
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                : analysis.score >= 650
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
            }`}>
              {analysis.tier} Tier
            </span>
          </div>

          <p className="mt-2 text-xs text-slate-400 leading-relaxed px-2">
            {analysis.ratingDescription}
          </p>
        </div>

        {/* 4 Factor Cards */}
        <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {analysis.keyFactors.map((factor) => (
            <div
              key={factor.name}
              className="rounded-xl border border-white/5 bg-slate-950/40 p-3.5 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-xs text-slate-200">{factor.name}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[9px] font-semibold ${
                      factor.status === "Good"
                        ? "bg-emerald-500/15 text-emerald-400"
                        : factor.status === "Fair"
                        ? "bg-cyan-500/15 text-cyan-300"
                        : "bg-amber-500/15 text-amber-300"
                    }`}
                  >
                    {factor.status}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug mt-1">{factor.tip}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Educational Tips */}
      <div className="rounded-xl border border-white/5 bg-slate-950/40 p-4">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
          <Award className="h-4 w-4 text-emerald-400" />
          <span>Educational Recommendations for Credit Resilience</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-400">
          {analysis.educationalRecommendations.map((tip, idx) => (
            <div key={idx} className="flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-lg border border-white/5">
              <span className="text-emerald-400 font-bold">•</span>
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
