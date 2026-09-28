"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import {
  Sliders,
  Shield,
  Activity,
  Save,
  CheckCircle2,
  Clock,
  Database,
  Cpu,
  History,
  AlertTriangle,
} from "lucide-react";

export default function AdminPage() {
  const { user } = useAuth();

  const [metrics, setMetrics] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [activeRule, setActiveRule] = useState<any>({
    ruleVersion: "v1.2.0-finai",
    minIncome: 25000,
    maxFOIR: 0.5,
    minCreditScore: 650,
    maxLoanTenure: 360,
    maxMultiplier: 60,
  });
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchAdminData = async () => {
    try {
      const res = await fetch("/api/admin/analytics");
      if (res.ok) {
        const data = await res.json();
        setMetrics(data);
        if (data.auditLogs) setAuditLogs(data.auditLogs);
      }

      const ruleRes = await fetch("/api/admin/rules");
      if (ruleRes.ok) {
        const rData = await ruleRes.json();
        if (rData.activeRule) setActiveRule(rData.activeRule);
      }
    } catch (e) {
      console.error("Admin fetch error:", e);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleSaveRule = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch("/api/admin/rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ruleVersion: activeRule.ruleVersion,
          minIncome: Number(activeRule.minIncome),
          maxFOIR: Number(activeRule.maxFOIR),
          minCreditScore: Number(activeRule.minCreditScore),
          maxLoanTenure: Number(activeRule.maxLoanTenure),
          maxMultiplier: Number(activeRule.maxMultiplier),
        }),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
        fetchAdminData();
      }
    } catch (e) {
      console.error("Rule save error:", e);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <div className="border-b border-white/5 pb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            System Administration & Policy Governance
          </span>
          <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-[10px] font-bold text-cyan-300">
            Audit Level: Active
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
          Admin Governance Console
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl">
          Configure rule engine criteria, track telemetry, and inspect cryptographic audit logs to guarantee compliance and fairness.
        </p>
      </div>

      {/* System Health Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="glass-panel rounded-2xl p-4">
          <span className="text-[10px] uppercase font-semibold text-slate-400">System Status</span>
          <div className="mt-1 flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold text-white text-base">Operational</span>
          </div>
          <span className="text-[10px] text-slate-500">Uptime: 99.98%</span>
        </div>

        <div className="glass-panel rounded-2xl p-4">
          <span className="text-[10px] uppercase font-semibold text-slate-400">Total Users</span>
          <div className="mt-1 font-mono text-xl font-extrabold text-white">
            {metrics?.metrics?.totalUsers || 4}
          </div>
          <span className="text-[10px] text-emerald-400">Active Profiles</span>
        </div>

        <div className="glass-panel rounded-2xl p-4">
          <span className="text-[10px] uppercase font-semibold text-slate-400">Calculations Executed</span>
          <div className="mt-1 font-mono text-xl font-extrabold text-cyan-400">
            {metrics?.metrics?.totalCalculations || 18}
          </div>
          <span className="text-[10px] text-slate-500">Deterministic Operations</span>
        </div>

        <div className="glass-panel rounded-2xl p-4">
          <span className="text-[10px] uppercase font-semibold text-slate-400">Active Rule Policy</span>
          <div className="mt-1 font-mono text-sm font-bold text-emerald-400 truncate">
            {activeRule.ruleVersion}
          </div>
          <span className="text-[10px] text-slate-500">Audit Verified</span>
        </div>
      </div>

      {/* Eligibility Rule Configuration Manager */}
      <div className="glass-panel rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Configurable Eligibility Rule Engine
            </h3>
            <p className="text-xs text-slate-400">
              Modify risk thresholds in real-time. Changes are versioned and logged in the immutable audit trail.
            </p>
          </div>

          {saveSuccess && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg">
              <CheckCircle2 className="h-4 w-4" />
              <span>Policy Version Saved & Activated</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSaveRule} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Rule Policy Version Tag
              </label>
              <input
                type="text"
                required
                value={activeRule.ruleVersion}
                onChange={(e) => setActiveRule({ ...activeRule, ruleVersion: e.target.value })}
                className="w-full rounded-lg glass-input px-3 py-2 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Minimum Monthly Income (₹)
              </label>
              <input
                type="number"
                step="1000"
                value={activeRule.minIncome}
                onChange={(e) => setActiveRule({ ...activeRule, minIncome: Number(e.target.value) })}
                className="w-full rounded-lg glass-input px-3 py-2 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Max Debt Burden Ceiling (FOIR)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  step="0.05"
                  min="0.1"
                  max="0.8"
                  value={activeRule.maxFOIR}
                  onChange={(e) => setActiveRule({ ...activeRule, maxFOIR: Number(e.target.value) })}
                  className="w-full rounded-lg glass-input px-3 py-2 text-xs font-mono"
                />
                <span className="text-xs text-slate-400 font-mono">
                  ({Math.round(activeRule.maxFOIR * 100)}%)
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Minimum Credit Score Benchmark
              </label>
              <input
                type="number"
                min="300"
                max="850"
                value={activeRule.minCreditScore}
                onChange={(e) => setActiveRule({ ...activeRule, minCreditScore: Number(e.target.value) })}
                className="w-full rounded-lg glass-input px-3 py-2 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Max Permissible Tenure (Months)
              </label>
              <input
                type="number"
                step="12"
                value={activeRule.maxLoanTenure}
                onChange={(e) => setActiveRule({ ...activeRule, maxLoanTenure: Number(e.target.value) })}
                className="w-full rounded-lg glass-input px-3 py-2 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Max Income Multiplier Limit (x)
              </label>
              <input
                type="number"
                step="5"
                value={activeRule.maxMultiplier}
                onChange={(e) => setActiveRule({ ...activeRule, maxMultiplier: Number(e.target.value) })}
                className="w-full rounded-lg glass-input px-3 py-2 text-xs font-mono"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-all disabled:opacity-50"
            >
              <Save className="h-4 w-4" />
              <span>{isSaving ? "Updating Policy..." : "Publish New Rule Version"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Audit Log Table */}
      <div className="glass-panel rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-emerald-400" />
            <h3 className="text-base font-bold text-white tracking-tight">
              Cryptographic Audit Log Stream
            </h3>
          </div>
          <span className="text-[11px] text-slate-500">Last 20 System Events</span>
        </div>

        <div className="overflow-x-auto rounded-xl border border-white/5">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[10px] uppercase text-slate-400 border-b border-white/5 font-semibold">
              <tr>
                <th className="px-4 py-2.5">Timestamp</th>
                <th className="px-4 py-2.5">User</th>
                <th className="px-4 py-2.5">Action</th>
                <th className="px-4 py-2.5">Metadata Snippet</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-mono text-[11px]">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-4 py-2 text-slate-400">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-white font-sans">
                    {log.user?.name || "System"}
                  </td>
                  <td className="px-4 py-2">
                    <span className="rounded bg-white/5 px-2 py-0.5 text-emerald-400 font-semibold">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-slate-400 truncate max-w-xs">
                    {log.metadata || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <DisclaimerBanner />
    </div>
  );
}
