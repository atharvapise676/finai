"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { DEMO_USERS } from "@/lib/demo-data";
import { Shield, X, User, Lock, Mail, Sparkles, CheckCircle2 } from "lucide-react";

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, login, signup, switchDemoUser } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [income, setIncome] = useState("60000");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      if (isSignUp) {
        const ok = await signup({
          name,
          email,
          password,
          monthlyIncome: Number(income) || 60000,
        });
        if (!ok) setError("Could not create account. Please check your credentials.");
      } else {
        const ok = await login(email, password);
        if (!ok) setError("Invalid email or password. You can also use 1-click demo personas below.");
      }
    } catch {
      setError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-slate-900/95 p-6 shadow-2xl backdrop-blur-2xl">
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              {isSignUp ? "Create FinAI Account" : "Sign In to FinAI"}
            </h3>
            <p className="text-xs text-slate-400">
              {isSignUp ? "Begin your financial health assessment" : "Access your financial dashboard and simulations"}
            </p>
          </div>
        </div>

        {/* 1-Click Demo Personas */}
        <div className="mb-5 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 mb-2">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Instant Demo Personas (No Password Needed)</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {DEMO_USERS.map((d) => (
              <button
                key={d.email}
                type="button"
                onClick={() => switchDemoUser(d.email)}
                className="flex flex-col items-center justify-center rounded-lg border border-white/10 bg-slate-900/80 p-2 text-center hover:border-emerald-500/40 hover:bg-emerald-500/10 transition-all group"
              >
                <span className="text-[11px] font-semibold text-white group-hover:text-emerald-300 truncate w-full">
                  {d.name.split(" ")[0]}
                </span>
                <span className="text-[9px] text-slate-400 font-mono">₹{(d.monthlyIncome / 1000).toFixed(0)}k/mo</span>
              </button>
            ))}
          </div>
        </div>

        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-white/10 w-full" />
          <span className="bg-slate-900 px-2 text-[10px] uppercase font-semibold text-slate-500 tracking-wider">
            Or credentials
          </span>
        </div>

        {error && (
          <div className="mb-4 rounded-lg border border-rose-500/30 bg-rose-500/10 p-2.5 text-xs text-rose-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {isSignUp && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full rounded-lg glass-input pl-9 pr-3 py-2 text-xs"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full rounded-lg glass-input pl-9 pr-3 py-2 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg glass-input pl-9 pr-3 py-2 text-xs"
              />
            </div>
          </div>

          {isSignUp && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Estimated Monthly Income (₹)</label>
              <input
                type="number"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                className="w-full rounded-lg glass-input px-3 py-2 text-xs font-mono"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-xl bg-emerald-500 py-2.5 text-xs font-bold text-slate-950 shadow-lg shadow-emerald-500/25 hover:bg-emerald-400 transition-all disabled:opacity-50 mt-2"
          >
            {isSubmitting ? "Processing..." : isSignUp ? "Create Account" : "Sign In"}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
            }}
            className="text-xs text-slate-400 hover:text-emerald-400 transition-colors"
          >
            {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Create One"}
          </button>
        </div>
      </div>
    </div>
  );
};
