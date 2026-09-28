"use client";

import React, { useState } from "react";
import { BudgetItemCategory } from "@/types";
import { PieChart, Plus, Trash2, Check, AlertCircle, Sparkles } from "lucide-react";

interface Props {
  monthlyIncome: number;
}

export const BudgetPlanner: React.FC<Props> = ({ monthlyIncome }) => {
  const [income, setIncome] = useState(monthlyIncome || 85000);
  const [categories, setCategories] = useState<BudgetItemCategory[]>([
    { category: "Housing (Rent / Maintenance)", allocated: 22000, spent: 22000 },
    { category: "Food & Groceries", allocated: 12000, spent: 10500 },
    { category: "Debt Obligations (EMIs)", allocated: 8000, spent: 8000 },
    { category: "Transport & Fuel", allocated: 6000, spent: 5400 },
    { category: "Utilities, Mobile & Bills", allocated: 5000, spent: 4800 },
    { category: "Savings & Investments", allocated: 25000, spent: 25000 },
    { category: "Entertainment & Dining Out", allocated: 7000, spent: 6200 },
  ]);

  const [newCatName, setNewCatName] = useState("");
  const [newCatAmount, setNewCatAmount] = useState("");

  const totalAllocated = categories.reduce((sum, c) => sum + c.allocated, 0);
  const totalSpent = categories.reduce((sum, c) => sum + c.spent, 0);
  const remainingCashflow = income - totalAllocated;

  // 50/30/20 Rule computation
  const targetNeeds = income * 0.5;
  const targetWants = income * 0.3;
  const targetSavings = income * 0.2;

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName || !newCatAmount) return;
    setCategories([
      ...categories,
      { category: newCatName, allocated: Number(newCatAmount), spent: 0 },
    ]);
    setNewCatName("");
    setNewCatAmount("");
  };

  const handleRemoveCategory = (index: number) => {
    setCategories(categories.filter((_, i) => i !== index));
  };

  const handleUpdate = (index: number, field: "allocated" | "spent", val: number) => {
    const updated = [...categories];
    updated[index][field] = Math.max(0, val);
    setCategories(updated);
  };

  return (
    <div className="glass-panel rounded-2xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Cashflow & Allocation Framework
          </span>
          <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
            Monthly Budget Planner
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">Total Monthly Income:</span>
          <span className="font-mono text-sm font-bold text-emerald-400">
            ₹{income.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        <div className="rounded-xl border border-white/5 bg-slate-950/40 p-4">
          <span className="text-[10px] text-slate-400 font-medium">Total Allocated Budget</span>
          <div className="mt-1 font-mono text-lg font-bold text-white">
            ₹{totalAllocated.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            {Math.round((totalAllocated / income) * 100)}% of income
          </span>
        </div>

        <div className="rounded-xl border border-white/5 bg-slate-950/40 p-4">
          <span className="text-[10px] text-slate-400 font-medium">Current Month Spent</span>
          <div className="mt-1 font-mono text-lg font-bold text-cyan-400">
            ₹{totalSpent.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-500 font-mono">
            {totalAllocated > 0 ? Math.round((totalSpent / totalAllocated) * 100) : 0}% of allocated
          </span>
        </div>

        <div className="rounded-xl border border-white/5 bg-slate-950/40 p-4">
          <span className="text-[10px] text-slate-400 font-medium">Unallocated Buffer</span>
          <div className={`mt-1 font-mono text-lg font-bold ${remainingCashflow >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
            ₹{remainingCashflow.toLocaleString()}
          </div>
          <span className="text-[10px] text-slate-500">
            {remainingCashflow >= 0 ? "Surplus available for savings" : "Budget deficit detected"}
          </span>
        </div>
      </div>

      {/* 50/30/20 Rule Comparison */}
      <div className="mb-6 rounded-xl border border-white/5 bg-slate-950/40 p-4">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            50 / 30 / 20 Rule Benchmark Guide
          </h4>
          <span className="text-[10px] text-slate-500">Industry Best Practice</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center text-xs">
          <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-2">
            <span className="text-[10px] text-emerald-400 font-bold">50% Needs</span>
            <p className="font-mono text-slate-200 mt-0.5">Target: ₹{targetNeeds.toLocaleString()}</p>
          </div>
          <div className="rounded-lg bg-cyan-500/10 border border-cyan-500/20 p-2">
            <span className="text-[10px] text-cyan-400 font-bold">30% Wants</span>
            <p className="font-mono text-slate-200 mt-0.5">Target: ₹{targetWants.toLocaleString()}</p>
          </div>
          <div className="rounded-lg bg-indigo-500/10 border border-indigo-500/20 p-2">
            <span className="text-[10px] text-indigo-400 font-bold">20% Savings / Debt</span>
            <p className="font-mono text-slate-200 mt-0.5">Target: ₹{targetSavings.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Category Progress Bars */}
      <div className="space-y-3 mb-6">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Category Allocations & Actuals
        </h4>
        {categories.map((cat, idx) => {
          const percentUsed = cat.allocated > 0 ? Math.min(100, Math.round((cat.spent / cat.allocated) * 100)) : 0;
          const isOver = cat.spent > cat.allocated;

          return (
            <div key={idx} className="rounded-xl border border-white/5 bg-slate-950/30 p-3">
              <div className="flex justify-between items-center text-xs mb-1.5">
                <span className="font-semibold text-slate-200">{cat.category}</span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 font-mono text-[11px]">
                    <span className="text-slate-400">Spent:</span>
                    <input
                      type="number"
                      value={cat.spent}
                      onChange={(e) => handleUpdate(idx, "spent", Number(e.target.value))}
                      className="w-16 bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-right text-cyan-300 focus:outline-none"
                    />
                    <span className="text-slate-500">/</span>
                    <input
                      type="number"
                      value={cat.allocated}
                      onChange={(e) => handleUpdate(idx, "allocated", Number(e.target.value))}
                      className="w-16 bg-slate-900 border border-white/10 rounded px-1.5 py-0.5 text-right text-white focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={() => handleRemoveCategory(idx)}
                    className="text-slate-500 hover:text-rose-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Progress bar */}
              <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    isOver
                      ? "bg-rose-500"
                      : percentUsed > 80
                      ? "bg-amber-400"
                      : "bg-emerald-400"
                  }`}
                  style={{ width: `${percentUsed}%` }}
                />
              </div>

              <div className="flex justify-between text-[10px] text-slate-500 mt-1 font-mono">
                <span>{percentUsed}% spent</span>
                <span>Remaining: ₹{Math.max(0, cat.allocated - cat.spent).toLocaleString()}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Category Form */}
      <form onSubmit={handleAddCategory} className="flex flex-col sm:flex-row gap-2 border-t border-white/5 pt-4">
        <input
          type="text"
          placeholder="New Category Name (e.g. Subscriptions)"
          value={newCatName}
          onChange={(e) => setNewCatName(e.target.value)}
          className="flex-1 rounded-lg glass-input px-3 py-2 text-xs"
        />
        <input
          type="number"
          placeholder="Monthly Budget (₹)"
          value={newCatAmount}
          onChange={(e) => setNewCatAmount(e.target.value)}
          className="w-full sm:w-36 rounded-lg glass-input px-3 py-2 text-xs font-mono"
        />
        <button
          type="submit"
          className="flex items-center justify-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add</span>
        </button>
      </form>
    </div>
  );
};
