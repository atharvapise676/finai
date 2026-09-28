"use client";

import React, { useState, useMemo } from "react";
import { calculateEMI } from "@/lib/financial-engine";
import { Calculator, ArrowRight, Table, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";

interface Props {
  initialPrincipal?: number;
  initialRate?: number;
  initialTenureYears?: number;
  onSelectEmi?: (emi: number) => void;
}

export const EMICalculator: React.FC<Props> = ({
  initialPrincipal = 2500000,
  initialRate = 8.5,
  initialTenureYears = 15,
  onSelectEmi,
}) => {
  const [principal, setPrincipal] = useState(initialPrincipal);
  const [rate, setRate] = useState(initialRate);
  const [tenureYears, setTenureYears] = useState(initialTenureYears);
  const [showAmortization, setShowAmortization] = useState(false);

  const tenureMonths = tenureYears * 12;

  const result = useMemo(() => {
    return calculateEMI({
      principal,
      annualRate: rate,
      tenureMonths,
    });
  }, [principal, rate, tenureMonths]);

  return (
    <div className="glass-panel rounded-2xl p-6 relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Interactive Calculation Engine
            </span>
            {rate === 0 && (
              <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-[10px] text-cyan-300 font-semibold border border-cyan-500/30">
                0% Zero-Interest Plan
              </span>
            )}
          </div>
          <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">Loan EMI Calculator</h3>
        </div>

        <Link
          href={`/assistant?q=${encodeURIComponent(`Explain this loan calculation: Principal ₹${principal.toLocaleString()}, Interest Rate ${rate}%, Tenure ${tenureYears} years with an EMI of ₹${result.monthlyEmi.toLocaleString()}.`)}`}
          className="flex items-center gap-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-300 hover:bg-cyan-500/20 transition-all w-fit"
        >
          <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
          <span>Ask AI to Explain</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Sliders and Controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Loan Amount Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-slate-300">Loan Amount (Principal)</label>
              <div className="flex items-center gap-1 bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1">
                <span className="text-slate-400">₹</span>
                <input
                  type="number"
                  value={principal}
                  onChange={(e) => setPrincipal(Math.max(0, Number(e.target.value)))}
                  className="w-28 bg-transparent text-right font-mono text-white text-xs font-bold focus:outline-none"
                />
              </div>
            </div>
            <input
              type="range"
              min="50000"
              max="20000000"
              step="50000"
              value={principal}
              onChange={(e) => setPrincipal(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>₹50K</span>
              <span>₹50 Lakh</span>
              <span>₹1 Crore</span>
              <span>₹2 Crore</span>
            </div>
          </div>

          {/* Interest Rate Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-slate-300">Annual Interest Rate (%)</label>
              <div className="flex items-center gap-1 bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="25"
                  value={rate}
                  onChange={(e) => setRate(Math.max(0, Number(e.target.value)))}
                  className="w-16 bg-transparent text-right font-mono text-white text-xs font-bold focus:outline-none"
                />
                <span className="text-slate-400">%</span>
              </div>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0% (Subsidized)</span>
              <span>8.5% (Prime)</span>
              <span>12% (Standard)</span>
              <span>20% (High Risk)</span>
            </div>
          </div>

          {/* Loan Tenure Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-slate-300">Loan Tenure (Years / Months)</label>
              <div className="flex items-center gap-1 bg-slate-900 border border-white/10 rounded-lg px-2.5 py-1">
                <input
                  type="number"
                  min="1"
                  max="35"
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Math.max(1, Number(e.target.value)))}
                  className="w-14 bg-transparent text-right font-mono text-white text-xs font-bold focus:outline-none"
                />
                <span className="text-slate-400">Yrs ({tenureMonths} Mo)</span>
              </div>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              step="1"
              value={tenureYears}
              onChange={(e) => setTenureYears(Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>1 Year</span>
              <span>5 Years</span>
              <span>15 Years</span>
              <span>30 Years</span>
            </div>
          </div>
        </div>

        {/* Calculation Output Card */}
        <div className="lg:col-span-5 rounded-2xl border border-white/10 bg-slate-950/60 p-6 flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Computed Monthly Repayment
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-emerald-400 font-mono">
                ₹{result.monthlyEmi.toLocaleString()}
              </span>
              <span className="text-xs text-slate-400 font-medium">/ month</span>
            </div>

            {/* Split Visual Progress */}
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-xs text-slate-300">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Principal ({result.principalPercent}%)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-cyan-400" />
                  Interest ({result.interestPercent}%)
                </span>
              </div>
              <div className="h-3 w-full rounded-full bg-slate-800 overflow-hidden flex">
                <div
                  className="bg-emerald-400 h-full transition-all duration-300"
                  style={{ width: `${result.principalPercent}%` }}
                />
                <div
                  className="bg-cyan-400 h-full transition-all duration-300"
                  style={{ width: `${result.interestPercent}%` }}
                />
              </div>
            </div>

            {/* Breakdown Figures */}
            <div className="mt-6 space-y-2 text-xs border-t border-white/5 pt-4">
              <div className="flex justify-between text-slate-400">
                <span>Principal Borrowed</span>
                <span className="font-mono text-slate-200">₹{result.totalPrincipal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Total Interest Payable</span>
                <span className="font-mono text-cyan-400">₹{result.totalInterest.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-300 font-semibold border-t border-white/5 pt-2">
                <span>Total Amount Payable</span>
                <span className="font-mono text-emerald-300 text-sm">
                  ₹{result.totalRepayment.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-white/5 flex gap-2">
            <button
              onClick={() => setShowAmortization(!showAmortization)}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-slate-900/80 px-3 py-2 text-xs font-medium text-slate-200 hover:bg-white/5 transition-all"
            >
              <Table className="h-3.5 w-3.5 text-slate-400" />
              <span>{showAmortization ? "Hide Schedule" : "Amortization Schedule"}</span>
              {showAmortization ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
          </div>
        </div>
      </div>

      {/* Amortization Table */}
      {showAmortization && (
        <div className="mt-6 border-t border-white/10 pt-6">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              12-Month Amortization Breakdown Preview
            </h4>
            <span className="text-[11px] text-slate-500">First Year Schedule</span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-white/5">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-[10px] uppercase text-slate-400 border-b border-white/5 font-semibold">
                <tr>
                  <th className="px-4 py-2.5">Month</th>
                  <th className="px-4 py-2.5">EMI (₹)</th>
                  <th className="px-4 py-2.5">Principal Paid (₹)</th>
                  <th className="px-4 py-2.5">Interest Paid (₹)</th>
                  <th className="px-4 py-2.5">Ending Balance (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-mono">
                {result.amortizationPreview.map((row) => (
                  <tr key={row.month} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-2 text-slate-400 font-sans">Month {row.month}</td>
                    <td className="px-4 py-2 text-white">₹{row.emi.toLocaleString()}</td>
                    <td className="px-4 py-2 text-emerald-400">₹{row.principalPaid.toLocaleString()}</td>
                    <td className="px-4 py-2 text-cyan-400">₹{row.interestPaid.toLocaleString()}</td>
                    <td className="px-4 py-2 text-slate-300">₹{row.remainingBalance.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
