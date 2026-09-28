"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { useI18n } from "@/lib/i18n";
import {
  Shield,
  Activity,
  Calculator,
  Compass,
  PieChart,
  Target,
  Zap,
  Bot,
  FileCheck,
  Lock,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  BarChart3,
  Layers,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { EMICalculator } from "@/components/EMICalculator";

export default function LandingPage() {
  const { switchDemoUser, user } = useAuth();
  const { t } = useI18n();

  return (
    <div className="space-y-24 py-8">
      {/* 1. Hero Section */}
      <section className="relative pt-6 pb-12 text-center lg:py-16">
        {/* Subtle Background Radial Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-emerald-500/10 via-cyan-500/10 to-indigo-500/10 blur-[100px] pointer-events-none rounded-full" />

        <div className="relative mx-auto max-w-4xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-300 backdrop-blur-xl shadow-glass">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            <span>AI-Powered Financial Health & Decision Intelligence</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.15]">
            {t.heroHeadline}
          </h1>

          <p className="mx-auto max-w-2xl text-base sm:text-lg text-slate-300 leading-relaxed">
            {t.heroSubtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 px-6 py-3.5 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/25 hover:from-emerald-400 hover:to-teal-300 transition-all hover:scale-[1.02]"
            >
              <span>{t.getStarted}</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/calculator"
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-slate-900/60 px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/10 transition-all"
            >
              <Calculator className="h-4 w-4 text-slate-400" />
              <span>{t.exploreTools}</span>
            </Link>
          </div>

          {/* Quick Demo Mode Persona Triggers */}
          <div className="pt-8 border-t border-white/5 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
            <span className="font-semibold text-slate-300">Quick Tour Personas:</span>
            {[
              { email: "demo@finai.com", label: "Aarav Sharma (Prime Profile)" },
              { email: "priya@finai.com", label: "Priya Patel (Balanced Planner)" },
              { email: "rohit@finai.com", label: "Rohit Verma (High Debt Burden)" },
            ].map((p) => (
              <button
                key={p.email}
                onClick={() => switchDemoUser(p.email)}
                className="rounded-lg border border-white/10 bg-slate-950/60 px-2.5 py-1 text-slate-300 hover:border-emerald-500/40 hover:text-emerald-300 transition-all"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Interactive Calculator Preview Section */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Instant Exploration
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Deterministic Financial Engine in Action
          </h2>
          <p className="text-xs text-slate-400 max-w-xl mx-auto">
            Test loan repayments with 100% mathematical precision. Claude AI is reserved exclusively for interpretation and synthesis.
          </p>
        </div>

        <EMICalculator initialPrincipal={2500000} initialRate={8.5} initialTenureYears={15} />
      </section>

      {/* 3. Core Pillars / Product Overview */}
      <section className="space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
            Architectural Excellence
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Separating Pure Math from AI Reasoning
          </h2>
          <p className="text-xs text-slate-400 max-w-xl mx-auto">
            Why FinAI delivers reliable fintech intelligence where standard generative AI fails.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel rounded-2xl p-6 space-y-3 relative overflow-hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Calculator className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">1. Deterministic Calculation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every EMI, FOIR, amortization, interest total, and health score is computed deterministically in verified TypeScript code. Zero hallucinated math.
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-6 space-y-3 relative overflow-hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Bot className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">2. Grounded Claude AI Interpretation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Claude 3.5 operates strictly downstream of the mathematical engine, providing educational summaries, scenario tradeoffs, and risk considerations.
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-6 space-y-3 relative overflow-hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="text-base font-bold text-white">3. Rule Engine & Transparency</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              All loan eligibility rules are transparent, explainable, and configurable with audit logging. No opaque black-box loan rejections.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Complete Tool Suite */}
      <section className="space-y-12">
        <div className="text-center space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            End-to-End Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Integrated Personal Finance Intelligence
          </h2>
          <p className="text-xs text-slate-400 max-w-xl mx-auto">
            Everything you need to evaluate loan affordability, preserve liquidity, and optimize long-term health.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              title: "Financial Health Indicator",
              desc: "Transparent 0-100 score across Debt Burden, Savings Cushion, Budget Balance, Credit Standing, and Income Resilience.",
              icon: Activity,
              href: "/dashboard",
              color: "text-emerald-400",
            },
            {
              title: "Explainable Loan Affordability",
              desc: "Evaluates requested loans against debt burden ceilings, highlighting exact supporting factors and warning triggers.",
              icon: Compass,
              href: "/affordability",
              color: "text-teal-400",
            },
            {
              title: "What-If Scenario Simulator",
              desc: "Interactive matrix comparing 5-yr, 7-yr, 10-yr, and 15-yr tenures to uncover interest vs EMI tradeoffs.",
              icon: Layers,
              href: "/calculator",
              color: "text-cyan-400",
            },
            {
              title: "Loan Comparison Suite",
              desc: "Side-by-side comparison of up to 4 loan offers including processing charges, net outflows, and sortable rankings.",
              icon: BarChart3,
              href: "/calculator",
              color: "text-blue-400",
            },
            {
              title: "Systemic Stress Testing",
              desc: "Simulate -20% income drops, inflation surges, and floating interest rate hikes to measure crisis resilience.",
              icon: Zap,
              href: "/stress-test",
              color: "text-amber-400",
            },
            {
              title: "50/30/20 Budget Planner",
              desc: "Categorize monthly living costs, benchmark against financial discipline rules, and avoid subscription leaks.",
              icon: PieChart,
              href: "/budget",
              color: "text-indigo-400",
            },
            {
              title: "Emergency Fund Buffer",
              desc: "Calculate required 3 to 12-month essential living cushions and track 12-month funding roadmaps.",
              icon: ShieldCheck,
              href: "/budget",
              color: "text-emerald-400",
            },
            {
              title: "Financial Goals Roadmap",
              desc: "Set, track, and deposit into structured milestones for homes, education, vehicles, and debt reduction.",
              icon: Target,
              href: "/goals",
              color: "text-teal-400",
            },
            {
              title: "AI Financial Assistant",
              desc: "Ask contextual questions regarding your numbers with strict response validation and zero hallucination risk.",
              icon: Bot,
              href: "/assistant",
              color: "text-cyan-400",
            },
          ].map((feature, i) => {
            const Icon = feature.icon;
            return (
              <Link
                key={i}
                href={feature.href}
                className="glass-panel glass-panel-hover rounded-2xl p-5 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 border border-white/10 group-hover:border-emerald-500/30 transition-all">
                      <Icon className={`h-4 w-4 ${feature.color}`} />
                    </div>
                    <ChevronRight className="h-4 w-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mt-1.5">
                    {feature.desc}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 5. How It Works Workflow */}
      <section className="glass-panel rounded-3xl p-8 lg:p-12 relative overflow-hidden">
        <div className="text-center space-y-2 mb-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            User Journey
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            How FinAI Empowers Your Decisions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
          {[
            {
              step: "01",
              title: "Input Financial Profile",
              desc: "Enter income, existing EMIs, and living expenses with zero unnecessary invasive data collection.",
            },
            {
              step: "02",
              title: "Deterministic Engine",
              desc: "FinAI computes FOIR, repayment schedules, and health scores using pure mathematical models.",
            },
            {
              step: "03",
              title: "Scenario Stress Testing",
              desc: "Simulate interest rate spikes or income reductions to verify safety margins before committing.",
            },
            {
              step: "04",
              title: "AI Synthesis & Action",
              desc: "Claude explains the trade-offs in plain language, empowering confident financial decisions.",
            },
          ].map((item, idx) => (
            <div key={idx} className="space-y-2 rounded-2xl border border-white/5 bg-slate-950/40 p-5">
              <span className="text-2xl font-extrabold font-mono text-emerald-400/80">
                {item.step}
              </span>
              <h4 className="text-sm font-bold text-white">{item.title}</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Security & Privacy Notice */}
      <section className="rounded-3xl border border-white/10 bg-slate-950/80 p-8 lg:p-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-8 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-400">
              <Lock className="h-4 w-4" />
              <span>Privacy & Security Safeguards</span>
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight">
              Your Financial Privacy is Non-Negotiable
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              FinAI does not request bank account logins, OTPs, debit card PINs, or PAN credentials. We do not sell your personal data or execute unauthorized credit bureau pulls. All calculations execute transparently with local database encryption.
            </p>
            <div className="flex flex-wrap gap-4 pt-2 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Zero Bank Credentials Required
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                No Hard Credit Inquiries
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Full Data Export & Audit Logging
              </span>
            </div>
          </div>

          <div className="md:col-span-4 flex justify-center">
            <div className="flex h-32 w-32 items-center justify-center rounded-3xl bg-emerald-500/10 border border-emerald-500/30 shadow-glass-glow">
              <Shield className="h-16 w-16 text-emerald-400" />
            </div>
          </div>
        </div>
      </section>

      {/* 7. Regulatory Compliance Disclaimer Banner */}
      <DisclaimerBanner />

      {/* 8. Call to Action Banner */}
      <section className="glass-panel rounded-3xl p-10 text-center relative overflow-hidden border border-emerald-500/30">
        <div className="max-w-2xl mx-auto space-y-4">
          <h2 className="text-3xl font-extrabold text-white tracking-tight">
            Ready to Take Control of Your Financial Future?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300">
            Explore your debt capacity, plan emergency reserves, and test loan scenarios with complete confidence today.
          </p>
          <div className="pt-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-emerald-500/25 hover:bg-emerald-400 transition-all hover:scale-[1.02]"
            >
              <span>Launch FinAI Dashboard</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
