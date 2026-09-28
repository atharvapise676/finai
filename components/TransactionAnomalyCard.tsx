"use client";

import React, { useState } from "react";
import { detectTransactionAnomalies, TransactionRecord, AnomalyReportItem } from "@/lib/financial-engine";
import { AlertCircle, AlertTriangle, ShieldCheck, CheckCircle2, Search } from "lucide-react";

export const TransactionAnomalyCard: React.FC = () => {
  const [sampleTransactions, setSampleTransactions] = useState<TransactionRecord[]>([
    { id: "tx1", date: "2026-09-02", category: "Dining Out", description: "Blue Tokai Coffee", amount: 450 },
    { id: "tx2", date: "2026-09-04", category: "Groceries", description: "Blinkit Grocery Store", amount: 1850 },
    { id: "tx3", date: "2026-09-08", category: "Entertainment", description: "Netflix Premium 4K", amount: 649 },
    { id: "tx4", date: "2026-09-12", category: "Entertainment", description: "Netflix Premium 4K", amount: 649 }, // Duplicate!
    { id: "tx5", date: "2026-09-15", category: "Dining Out", description: "High-End Luxury Lounge", amount: 18500 }, // Spike!
    { id: "tx6", date: "2026-09-18", category: "Transport", description: "Uber Premier", amount: 620 },
    { id: "tx7", date: "2026-09-22", category: "Utilities", description: "Electricity Bill (BESCOM)", amount: 3200 },
  ]);

  const anomalies: AnomalyReportItem[] = detectTransactionAnomalies(sampleTransactions);

  return (
    <div className="glass-panel rounded-2xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <Search className="h-3.5 w-3.5" />
            <span>Pattern & Leakage Scanner</span>
          </span>
          <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
            Transaction Anomaly & Subscription Leak Detector
          </h3>
        </div>
        <div className="text-xs text-slate-400">
          {sampleTransactions.length} Transactions Scanned | <strong>{anomalies.length} Flagged</strong>
        </div>
      </div>

      {/* Flagged Anomalies Grid */}
      {anomalies.length > 0 ? (
        <div className="space-y-3 mb-6">
          {anomalies.map((anom) => (
            <div
              key={anom.id}
              className={`rounded-xl border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                anom.severity === "High"
                  ? "border-rose-500/30 bg-rose-500/10 text-rose-200"
                  : "border-amber-500/30 bg-amber-500/10 text-amber-200"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`rounded-lg p-2 mt-0.5 ${anom.severity === "High" ? "bg-rose-500/20 text-rose-400" : "bg-amber-500/20 text-amber-400"}`}>
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{anom.anomalyType}</span>
                    <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                      anom.severity === "High" ? "bg-rose-500/20 text-rose-300" : "bg-amber-500/20 text-amber-300"
                    }`}>
                      {anom.severity} Severity
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-snug">{anom.explanation}</p>
                </div>
              </div>

              <div className="text-right sm:shrink-0 font-mono">
                <div className="text-sm font-bold text-white">₹{anom.transaction.amount.toLocaleString()}</div>
                <div className="text-[10px] text-slate-400">{anom.transaction.date}</div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-center text-xs text-emerald-300 mb-6">
          <CheckCircle2 className="h-5 w-5 mx-auto mb-1 text-emerald-400" />
          No unusual transaction spikes or duplicate charges detected.
        </div>
      )}

      {/* Transaction Feed Preview Table */}
      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
        Recent Account Activity Feed
      </h4>
      <div className="overflow-x-auto rounded-xl border border-white/5">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-[10px] uppercase text-slate-400 border-b border-white/5 font-semibold">
            <tr>
              <th className="px-4 py-2.5">Date</th>
              <th className="px-4 py-2.5">Description</th>
              <th className="px-4 py-2.5">Category</th>
              <th className="px-4 py-2.5 text-right">Amount (₹)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {sampleTransactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                <td className="px-4 py-2 text-slate-400 font-mono text-[11px]">{tx.date}</td>
                <td className="px-4 py-2 text-white font-medium">{tx.description}</td>
                <td className="px-4 py-2 text-slate-400">{tx.category}</td>
                <td className="px-4 py-2 text-right font-mono font-bold text-slate-200">
                  ₹{tx.amount.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
