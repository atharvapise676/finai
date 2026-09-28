"use client";

import React, { useState } from "react";
import { compareLoanOffers } from "@/lib/financial-engine";
import { LoanComparisonOffer, ComparedOfferResult } from "@/types";
import { Plus, Trash2, ArrowUpDown, Check, Shield } from "lucide-react";

export const LoanComparisonTable: React.FC = () => {
  const [offers, setOffers] = useState<LoanComparisonOffer[]>([
    {
      id: "1",
      provider: "HDFC Bank (Hypothetical)",
      principal: 2500000,
      annualRate: 8.5,
      tenureMonths: 240,
      processingFeePercent: 0.5,
      otherCharges: 3000,
    },
    {
      id: "2",
      provider: "State Bank of India (Hypothetical)",
      principal: 2500000,
      annualRate: 8.4,
      tenureMonths: 240,
      processingFeePercent: 0.35,
      otherCharges: 5000,
    },
    {
      id: "3",
      provider: "Axis Bank (Hypothetical)",
      principal: 2500000,
      annualRate: 8.75,
      tenureMonths: 180,
      processingFeePercent: 1.0,
      otherCharges: 2500,
    },
  ]);

  const [sortBy, setSortBy] = useState<"emi" | "totalCost" | "rate">("totalCost");

  const results: ComparedOfferResult[] = compareLoanOffers(offers);

  const sortedResults = [...results].sort((a, b) => {
    if (sortBy === "emi") return a.monthlyEmi - b.monthlyEmi;
    if (sortBy === "totalCost") return a.overallNetOutflow - b.overallNetOutflow;
    return a.annualRate - b.annualRate;
  });

  const handleAddOffer = () => {
    if (offers.length >= 4) return;
    const newOffer: LoanComparisonOffer = {
      id: Date.now().toString(),
      provider: `Offer Option ${offers.length + 1}`,
      principal: 2500000,
      annualRate: 9.0,
      tenureMonths: 240,
      processingFeePercent: 0.5,
      otherCharges: 2000,
    };
    setOffers([...offers, newOffer]);
  };

  const handleRemoveOffer = (id: string) => {
    if (offers.length <= 1) return;
    setOffers(offers.filter((o) => o.id !== id));
  };

  const handleUpdate = (id: string, field: keyof LoanComparisonOffer, val: any) => {
    setOffers(
      offers.map((o) => (o.id === id ? { ...o, [field]: val } : o))
    );
  };

  return (
    <div className="glass-panel rounded-2xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Multi-Offer Decision Suite
          </span>
          <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
            Loan Comparison & Fee Analyzer
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="rounded-lg border border-white/10 bg-slate-900/90 px-2.5 py-1.5 text-xs text-white"
          >
            <option value="totalCost">Lowest Total Outflow</option>
            <option value="emi">Lowest Monthly EMI</option>
            <option value="rate">Lowest Interest Rate</option>
          </select>

          {offers.length < 4 && (
            <button
              onClick={handleAddOffer}
              className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 transition-all"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Offer</span>
            </button>
          )}
        </div>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {sortedResults.map((offer, index) => {
          const isTopRanked = index === 0;

          return (
            <div
              key={offer.id}
              className={`rounded-2xl border p-5 flex flex-col justify-between relative transition-all ${
                isTopRanked
                  ? "border-emerald-500/40 bg-emerald-500/5 shadow-glass-glow"
                  : "border-white/5 bg-slate-950/60"
              }`}
            >
              {isTopRanked && (
                <div className="absolute -top-2.5 left-4 rounded-full bg-emerald-500 px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-slate-950">
                  Ranked #1 ({sortBy === "totalCost" ? "Lowest Outflow" : sortBy === "emi" ? "Lowest EMI" : "Lowest Rate"})
                </div>
              )}

              <div>
                <div className="flex justify-between items-start mb-3 pt-1">
                  <input
                    type="text"
                    value={offer.provider}
                    onChange={(e) => handleUpdate(offer.id, "provider", e.target.value)}
                    className="font-bold text-xs text-white bg-transparent border-b border-transparent hover:border-white/20 focus:border-emerald-400 focus:outline-none w-full mr-2"
                  />
                  {offers.length > 1 && (
                    <button
                      onClick={() => handleRemoveOffer(offer.id)}
                      className="text-slate-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>

                {/* Editable Parameters */}
                <div className="space-y-2 text-xs mb-4 rounded-xl border border-white/5 bg-slate-900/60 p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-400">Interest Rate:</span>
                    <div className="flex items-center gap-1 font-mono">
                      <input
                        type="number"
                        step="0.05"
                        value={offer.annualRate}
                        onChange={(e) => handleUpdate(offer.id, "annualRate", Number(e.target.value))}
                        className="w-12 bg-transparent text-right text-cyan-300 font-bold focus:outline-none"
                      />
                      <span className="text-slate-400 text-[10px]">%</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-400">Tenure:</span>
                    <div className="flex items-center gap-1 font-mono">
                      <input
                        type="number"
                        step="12"
                        value={offer.tenureMonths}
                        onChange={(e) => handleUpdate(offer.id, "tenureMonths", Number(e.target.value))}
                        className="w-12 bg-transparent text-right text-slate-200 font-bold focus:outline-none"
                      />
                      <span className="text-slate-400 text-[10px]">mo</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-[10px] text-slate-400">Processing Fee:</span>
                    <div className="flex items-center gap-1 font-mono">
                      <input
                        type="number"
                        step="0.1"
                        value={offer.processingFeePercent}
                        onChange={(e) => handleUpdate(offer.id, "processingFeePercent", Number(e.target.value))}
                        className="w-12 bg-transparent text-right text-slate-200 font-bold focus:outline-none"
                      />
                      <span className="text-slate-400 text-[10px]">%</span>
                    </div>
                  </div>
                </div>

                {/* Financial Results */}
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400">Monthly EMI</span>
                    <div className="font-mono text-base font-extrabold text-emerald-400">
                      ₹{offer.monthlyEmi.toLocaleString()}
                    </div>
                  </div>

                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Total Interest:</span>
                    <span className="font-mono text-slate-200">₹{offer.totalInterest.toLocaleString()}</span>
                  </div>

                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Upfront Fees & Tax:</span>
                    <span className="font-mono text-amber-300">₹{offer.upfrontFees.toLocaleString()}</span>
                  </div>

                  <div className="border-t border-white/10 pt-2 flex justify-between text-xs font-semibold text-white">
                    <span>Total Net Outflow:</span>
                    <span className="font-mono text-emerald-300">₹{offer.overallNetOutflow.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
