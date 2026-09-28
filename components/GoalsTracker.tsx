"use client";

import React, { useState } from "react";
import { FinancialGoalItem } from "@/types";
import { Target, Plus, Trash2, Calendar, CheckCircle2, TrendingUp, X } from "lucide-react";

interface Props {
  initialGoals?: FinancialGoalItem[];
}

export const GoalsTracker: React.FC<Props> = ({ initialGoals }) => {
  const [goals, setGoals] = useState<FinancialGoalItem[]>(
    initialGoals && initialGoals.length > 0
      ? initialGoals
      : [
          {
            id: "1",
            name: "Emergency Liquidity Cushion (6 Mo)",
            category: "Emergency",
            targetAmount: 200000,
            currentAmount: 150000,
            targetDate: "2026-12-31",
          },
          {
            id: "2",
            name: "Home Down Payment Reserve",
            category: "Home",
            targetAmount: 800000,
            currentAmount: 250000,
            targetDate: "2028-06-30",
          },
          {
            id: "3",
            name: "Electric Vehicle Purchase",
            category: "Vehicle",
            targetAmount: 300000,
            currentAmount: 95000,
            targetDate: "2027-03-31",
          },
        ]
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    name: "",
    category: "Home",
    targetAmount: "",
    currentAmount: "",
    targetDate: "",
  });

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoal.name || !newGoal.targetAmount) return;

    const goalItem: FinancialGoalItem = {
      id: Date.now().toString(),
      name: newGoal.name,
      category: newGoal.category as any,
      targetAmount: Number(newGoal.targetAmount),
      currentAmount: Number(newGoal.currentAmount) || 0,
      targetDate: newGoal.targetDate || "2027-12-31",
    };

    setGoals([...goals, goalItem]);
    setIsModalOpen(false);
    setNewGoal({ name: "", category: "Home", targetAmount: "", currentAmount: "", targetDate: "" });
  };

  const handleDelete = (id: string) => {
    setGoals(goals.filter((g) => g.id !== id));
  };

  const handleDeposit = (id: string, amount: number) => {
    setGoals(
      goals.map((g) =>
        g.id === id ? { ...g, currentAmount: Math.min(g.targetAmount, g.currentAmount + amount) } : g
      )
    );
  };

  return (
    <div className="glass-panel rounded-2xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Aspirations & Capital Roadmap
          </span>
          <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
            Financial Goals Planner
          </h3>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3.5 py-1.5 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/20 w-fit"
        >
          <Plus className="h-4 w-4" />
          <span>Add New Goal</span>
        </button>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {goals.map((goal) => {
          const progress = goal.targetAmount > 0 ? Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100)) : 0;
          const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);

          return (
            <div
              key={goal.id}
              className="rounded-2xl border border-white/5 bg-slate-950/60 p-5 flex flex-col justify-between hover:border-white/10 transition-all"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[9px] font-semibold text-emerald-400">
                    {goal.category}
                  </span>
                  <button
                    onClick={() => handleDelete(goal.id)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <h4 className="text-sm font-bold text-white tracking-tight mb-3 truncate">
                  {goal.name}
                </h4>

                <div className="space-y-1 mb-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Current Progress</span>
                    <span className="font-mono text-emerald-400 font-bold">{progress}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-700"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Saved:</span>
                    <span className="font-mono text-white font-semibold">₹{goal.currentAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Target:</span>
                    <span className="font-mono text-slate-300">₹{goal.targetAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Remaining Gap:</span>
                    <span className="font-mono text-cyan-400">₹{remaining.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] text-slate-500 flex items-center gap-1 font-mono">
                  <Calendar className="h-3 w-3" />
                  <span>Target: {goal.targetDate}</span>
                </span>
                <button
                  onClick={() => handleDeposit(goal.id, 5000)}
                  className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[10px] font-semibold text-emerald-300 hover:bg-emerald-500/20"
                >
                  +₹5,000 Deposit
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Goal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-lg font-bold text-white tracking-tight mb-4">Add Financial Goal</h3>

            <form onSubmit={handleAddGoal} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Goal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Higher Education Fund"
                  value={newGoal.name}
                  onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })}
                  className="w-full rounded-lg glass-input px-3 py-2 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                <select
                  value={newGoal.category}
                  onChange={(e) => setNewGoal({ ...newGoal, category: e.target.value })}
                  className="w-full rounded-lg glass-input px-3 py-2 text-xs bg-slate-900 text-white"
                >
                  <option value="Emergency">Emergency Buffer</option>
                  <option value="Home">Home Down Payment</option>
                  <option value="Vehicle">Vehicle Purchase</option>
                  <option value="Education">Education & Certifications</option>
                  <option value="Travel">Vacation & Travel</option>
                  <option value="Debt">Accelerated Debt Paydown</option>
                  <option value="Other">Other Savings</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Target Amount (₹)</label>
                  <input
                    type="number"
                    required
                    placeholder="500000"
                    value={newGoal.targetAmount}
                    onChange={(e) => setNewGoal({ ...newGoal, targetAmount: e.target.value })}
                    className="w-full rounded-lg glass-input px-3 py-2 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Current Saved (₹)</label>
                  <input
                    type="number"
                    placeholder="50000"
                    value={newGoal.currentAmount}
                    onChange={(e) => setNewGoal({ ...newGoal, currentAmount: e.target.value })}
                    className="w-full rounded-lg glass-input px-3 py-2 text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Target Date</label>
                <input
                  type="date"
                  value={newGoal.targetDate}
                  onChange={(e) => setNewGoal({ ...newGoal, targetDate: e.target.value })}
                  className="w-full rounded-lg glass-input px-3 py-2 text-xs font-mono bg-slate-900 text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-emerald-500 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/25 hover:bg-emerald-400 transition-all mt-4"
              >
                Create Goal
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
