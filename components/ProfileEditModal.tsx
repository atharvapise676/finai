"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { X, Save, DollarSign, Wallet, ShieldCheck, Briefcase } from "lucide-react";

export const ProfileEditModal: React.FC = () => {
  const { profile, isProfileModalOpen, setIsProfileModalOpen, updateProfile } = useAuth();

  const [name, setName] = useState("");
  const [monthlyIncome, setMonthlyIncome] = useState(60000);
  const [monthlyExpenses, setMonthlyExpenses] = useState(25000);
  const [existingEmi, setExistingEmi] = useState(5000);
  const [savings, setSavings] = useState(80000);
  const [emergencyFund, setEmergencyFund] = useState(50000);
  const [creditScore, setCreditScore] = useState(760);
  const [employmentType, setEmploymentType] = useState("salaried");
  const [dependents, setDependents] = useState(1);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setMonthlyIncome(profile.monthlyIncome || 60000);
      setMonthlyExpenses(profile.monthlyExpenses || 25000);
      setExistingEmi(profile.existingEmi || 0);
      setSavings(profile.savings || 0);
      setEmergencyFund(profile.emergencyFund || 0);
      setCreditScore(profile.creditScore || 750);
      setEmploymentType(profile.employmentType || "salaried");
      setDependents(profile.dependents || 1);
    }
  }, [profile]);

  if (!isProfileModalOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await updateProfile({
      name,
      monthlyIncome: Number(monthlyIncome),
      monthlyExpenses: Number(monthlyExpenses),
      existingEmi: Number(existingEmi),
      savings: Number(savings),
      emergencyFund: Number(emergencyFund),
      creditScore: Number(creditScore),
      employmentType: employmentType as any,
      dependents: Number(dependents),
    });
    setIsSaving(false);
  };

  const netDisposable = Math.max(0, monthlyIncome - monthlyExpenses - existingEmi);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-2xl border border-white/10 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-2xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={() => setIsProfileModalOpen(false)}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6">
          <h3 className="text-lg font-bold text-white tracking-tight">Edit Financial Profile</h3>
          <p className="text-xs text-slate-400">
            Keep your profile accurate to receive precise affordability and health indicators.
          </p>
        </div>

        {/* Live Quick Stats Strip */}
        <div className="mb-6 grid grid-cols-2 gap-2 rounded-xl border border-white/10 bg-slate-950/60 p-3 text-xs">
          <div>
            <span className="text-[10px] text-slate-400">Net Disposable Surplus:</span>
            <p className="font-mono text-emerald-400 font-bold">₹{netDisposable.toLocaleString()}/mo</p>
          </div>
          <div>
            <span className="text-[10px] text-slate-400">Debt Burden (FOIR):</span>
            <p className="font-mono text-cyan-400 font-bold">
              {monthlyIncome > 0 ? Math.round((existingEmi / monthlyIncome) * 100) : 0}%
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg glass-input px-3 py-2 text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Employment Type</label>
              <select
                value={employmentType}
                onChange={(e) => setEmploymentType(e.target.value)}
                className="w-full rounded-lg glass-input px-3 py-2 text-xs bg-slate-900 text-white"
              >
                <option value="salaried">Salaried (Corporate / Govt)</option>
                <option value="self_employed">Self Employed Professional</option>
                <option value="business">Business Owner / MSME</option>
                <option value="freelancer">Freelancer / Contract</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Gross Monthly Income (₹)</label>
              <input
                type="number"
                min="0"
                step="1000"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                className="w-full rounded-lg glass-input px-3 py-2 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Monthly Living Expenses (₹)</label>
              <input
                type="number"
                min="0"
                step="1000"
                value={monthlyExpenses}
                onChange={(e) => setMonthlyExpenses(Number(e.target.value))}
                className="w-full rounded-lg glass-input px-3 py-2 text-xs font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Existing Monthly EMIs (₹)</label>
              <input
                type="number"
                min="0"
                step="500"
                value={existingEmi}
                onChange={(e) => setExistingEmi(Number(e.target.value))}
                className="w-full rounded-lg glass-input px-3 py-2 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Total Liquid Savings (₹)</label>
              <input
                type="number"
                min="0"
                step="5000"
                value={savings}
                onChange={(e) => setSavings(Number(e.target.value))}
                className="w-full rounded-lg glass-input px-3 py-2 text-xs font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Dedicated Emergency Fund (₹)</label>
              <input
                type="number"
                min="0"
                step="5000"
                value={emergencyFund}
                onChange={(e) => setEmergencyFund(Number(e.target.value))}
                className="w-full rounded-lg glass-input px-3 py-2 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Credit Score (300 - 900)</label>
              <input
                type="number"
                min="300"
                max="900"
                value={creditScore}
                onChange={(e) => setCreditScore(Number(e.target.value))}
                className="w-full rounded-lg glass-input px-3 py-2 text-xs font-mono"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-500 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/25 hover:bg-emerald-400 transition-all disabled:opacity-50 mt-4"
          >
            <Save className="h-4 w-4" />
            <span>{isSaving ? "Saving Changes..." : "Save Financial Profile"}</span>
          </button>
        </form>
      </div>
    </div>
  );
};
