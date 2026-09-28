"use client";

import React from "react";
import { AIAssistantModal } from "@/components/AIAssistantModal";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { Bot, Sparkles, ShieldCheck } from "lucide-react";

export default function AssistantPage() {
  return (
    <div className="space-y-6 pb-12">
      <div className="border-b border-white/5 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            <span>AI Reasoning & Explanation</span>
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
          AI Financial Assistant
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl">
          Powered by Claude AI. Grounded strictly in your deterministic calculation outputs. Ask questions about your loan affordability, health indicators, and scenario tradeoffs.
        </p>
      </div>

      <AIAssistantModal />

      <DisclaimerBanner />
    </div>
  );
}
