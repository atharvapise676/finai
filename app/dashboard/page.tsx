"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useI18n } from "@/lib/i18n";
import { calculateFinancialHealth } from "@/lib/financial-engine";
import { FinancialHealthScoreCard } from "@/components/FinancialHealthScoreCard";
import { CreditScoreCard } from "@/components/CreditScoreCard";
import { LoanAffordabilityCard } from "@/components/LoanAffordabilityCard";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import {
  DollarSign,
  TrendingUp,
  Wallet,
  ShieldCheck,
  FileDown,
  Sparkles,
  Bot,
  ArrowRight,
  Target,
  PieChart,
  RefreshCw,
} from "lucide-react";

export default function DashboardPage() {
  const { profile, user, setIsProfileModalOpen } = useAuth();
  const { t } = useI18n();

  const [aiInsights, setAiInsights] = useState<any>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);

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

  const healthScore = calculateFinancialHealth(activeProfile);
  const netDisposable = Math.max(0, activeProfile.monthlyIncome - activeProfile.monthlyExpenses - activeProfile.existingEmi);
  const foirPercent = activeProfile.monthlyIncome > 0 ? Math.round((activeProfile.existingEmi / activeProfile.monthlyIncome) * 100) : 0;

  const fetchInsights = async () => {
    try {
      setIsAiLoading(true);
      const res = await fetch("/api/ai/insights");
      if (res.ok) {
        const data = await res.json();
        setAiInsights(data.insights);
      }
    } catch (e) {
      console.error("Failed to fetch insights:", e);
    } finally {
      setIsAiLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [profile?.monthlyIncome, profile?.existingEmi]);

  return (
    <div className="space-y-8 pb-12">
      {/* Dashboard Top Header Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Financial Intelligence Dashboard
            </h1>
            <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
              Active Assessment
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time financial vitals, deterministic risk indicators, and AI decision insights for{" "}
            <strong className="text-slate-200">{activeProfile.name}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsProfileModalOpen(true)}
            className="rounded-lg border border-white/10 bg-slate-900/80 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-white/5 transition-all"
          >
            Update Metrics
          </button>

          <a
            href="/api/export"
            download
            className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 transition-all shadow-sm"
          >
            <FileDown className="h-4 w-4" />
            <span>Export CSV</span>
          </a>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Monthly Income */}
        <div className="glass-panel rounded-2xl p-4">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Monthly Income
          </span>
          <div className="mt-1 font-mono text-xl sm:text-2xl font-extrabold text-white">
            ₹{activeProfile.monthlyIncome.toLocaleString()}
          </div>
          <span className="text-[10px] text-emerald-400 font-medium">Verified Inflow</span>
        </div>

        {/* Existing EMIs */}
        <div className="glass-panel rounded-2xl p-4">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Existing EMIs
          </span>
          <div className="mt-1 font-mono text-xl sm:text-2xl font-extrabold text-cyan-400">
            ₹{activeProfile.existingEmi.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400">
            Debt Burden: <strong className="text-white">{foirPercent}%</strong>
          </span>
        </div>

        {/* Liquid Savings */}
        <div className="glass-panel rounded-2xl p-4">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Liquid Savings
          </span>
          <div className="mt-1 font-mono text-xl sm:text-2xl font-extrabold text-teal-300">
            ₹{activeProfile.savings.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-400">
            Reserves: <strong className="text-white">{healthScore.pillars.savingsBuffer.metric}</strong>
          </span>
        </div>

        {/* Disposable Income */}
        <div className="glass-panel rounded-2xl p-4">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Net Disposable Surplus
          </span>
          <div className="mt-1 font-mono text-xl sm:text-2xl font-extrabold text-emerald-400">
            ₹{netDisposable.toLocaleString()}
          </div>
          <span className="text-[10px] text-emerald-400 font-medium">Free Cashflow</span>
        </div>
      </div>

      {/* Main Financial Health Score Card */}
      <FinancialHealthScoreCard health={healthScore} />

      {/* AI Financial Insights Banner */}
      <div className="rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-cyan-950/40 via-slate-900/60 to-slate-950 p-6 relative overflow-hidden shadow-glass">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white tracking-tight">
                  Claude AI Financial Synthesis
                </h3>
                <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-[9px] font-bold text-cyan-300 border border-cyan-500/30">
                  Grounded Output
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Personalized summary derived strictly from your verified calculation outputs.
              </p>
            </div>
          </div>

          <Link
            href="/assistant"
            className="flex items-center gap-1.5 rounded-lg bg-cyan-500 px-3.5 py-1.5 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-all w-fit"
          >
            <span>Open AI Assistant</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {aiInsights ? (
          <div className="space-y-3 text-xs">
            <p className="font-medium text-slate-200 leading-relaxed bg-slate-900/70 p-3 rounded-xl border border-white/5">
              {aiInsights.summary}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                  Key Insights
                </span>
                <ul className="space-y-1 text-slate-300">
                  {aiInsights.insights?.slice(0, 3).map((ins: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{ins}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
                  Risk Considerations
                </span>
                <ul className="space-y-1 text-slate-300">
                  {aiInsights.considerations?.slice(0, 2).map((c: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-amber-400 font-bold">⚠</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-xs text-slate-400 italic">
            {isAiLoading ? "Synthesizing financial profile..." : "AI insights will generate based on your metrics."}
          </div>
        )}
      </div>

      {/* Credit Score & Loan Affordability Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5">
          <CreditScoreCard score={activeProfile.creditScore} />
        </div>
        <div className="lg:col-span-7">
          <LoanAffordabilityCard profile={activeProfile} initialLoanAmount={2500000} initialRate={8.5} initialTenureMonths={240} />
        </div>
      </div>

      {/* Compliance Notice */}
      <DisclaimerBanner />
    </div>
  );
}
