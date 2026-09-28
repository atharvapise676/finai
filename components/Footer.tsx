"use client";

import React from "react";
import Link from "next/link";
import { Shield, Lock, FileCheck, ArrowUpRight } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-white/10 bg-slate-950 py-12 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <Shield className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold text-white tracking-tight">Fin<span className="text-emerald-400">AI</span></span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              AI-powered financial health intelligence, deterministic loan affordability, scenario simulation, and budgeting suite. Built for financial literacy and decision confidence.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400">
              <Lock className="h-3 w-3" />
              <span>TLS 256-bit Encrypted Session Architecture</span>
            </div>
          </div>

          {/* Quick Tools */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">Financial Tools</h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link href="/calculator" className="hover:text-emerald-400 transition-colors">
                  EMI & Amortization Calculator
                </Link>
              </li>
              <li>
                <Link href="/affordability" className="hover:text-emerald-400 transition-colors">
                  Loan Affordability & FOIR Engine
                </Link>
              </li>
              <li>
                <Link href="/budget" className="hover:text-emerald-400 transition-colors">
                  50/30/20 Monthly Budget Planner
                </Link>
              </li>
              <li>
                <Link href="/goals" className="hover:text-emerald-400 transition-colors">
                  Financial Goals Roadmap
                </Link>
              </li>
              <li>
                <Link href="/stress-test" className="hover:text-emerald-400 transition-colors">
                  Systemic Stress Testing Simulator
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Intelligence */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">Intelligence</h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link href="/assistant" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
                  <span>AI Financial Assistant</span>
                  <ArrowUpRight className="h-3 w-3 text-cyan-400" />
                </Link>
              </li>
              <li>
                <Link href="/documents" className="hover:text-emerald-400 transition-colors">
                  Document OCR & Statement Analyzer
                </Link>
              </li>
              <li>
                <Link href="/methodology" className="hover:text-emerald-400 transition-colors">
                  Financial Health Methodology
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-emerald-400 transition-colors">
                  Admin & Rule Governance
                </Link>
              </li>
              <li>
                <a href="/api/export" download className="hover:text-emerald-400 transition-colors">
                  Export Financial Summary (CSV)
                </a>
              </li>
            </ul>
          </div>

          {/* Governance & Privacy */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">Compliance & Trust</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              FinAI does not sell consumer data, execute unauthorized lender pulls, or perform credit bureau hard inquiries. All formulas are open, transparent, and deterministically audited.
            </p>
            <div className="flex items-center gap-2 pt-1 text-slate-300 text-xs">
              <FileCheck className="h-4 w-4 text-emerald-400" />
              <span>Rule Engine Policy Version: <strong>v1.2.0-finai</strong></span>
            </div>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="border-t border-white/5 pt-6 text-[11px] text-slate-500 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} FinAI Technologies. Non-lending financial advisory & decision-support platform.</p>
          <p className="text-center md:text-right">
            FinAI calculations are deterministic approximations. Not financial or legal advice.
          </p>
        </div>
      </div>
    </footer>
  );
};
