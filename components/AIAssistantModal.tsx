"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Bot, Send, Sparkles, AlertCircle, ShieldAlert, User, CheckCircle2, ChevronRight } from "lucide-react";
import { AIAnalysisResponse } from "@/types";

interface Props {
  initialQuery?: string;
  contextData?: {
    affordability?: any;
    health?: any;
  };
}

interface MessageItem {
  id: string;
  role: "user" | "assistant";
  content: string;
  structured?: AIAnalysisResponse;
}

export const AIAssistantModal: React.FC<Props> = ({ initialQuery = "", contextData }) => {
  const { profile } = useAuth();
  const [query, setQuery] = useState(initialQuery);
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Hello! I am FinAI's Financial Education Assistant. I explain deterministic calculations, loan affordability scenarios, and budget trade-offs. I never invent numbers or guarantee bank approvals.",
      structured: {
        summary:
          "Welcome to FinAI's Educational Assistant. Ask questions regarding your loan eligibility, financial health indicators, or scenario stress testing.",
        insights: [
          "Calculations are strictly derived from deterministic application formulas.",
          "AI interpretations help you understand risk tradeoffs, not provide loan underwriting.",
        ],
        considerations: [
          "Always verify estimates against your actual bank sanction terms.",
        ],
        disclaimer:
          "FinAI provides educational guidance only and does not represent any lender or guarantee loan sanction.",
      },
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const promptStarters = [
    "Explain my financial health score.",
    "Can I afford this loan under current assumptions?",
    "What happens if interest rates rise by 2%?",
    "How can I improve my debt-to-income ratio?",
  ];

  const handleSend = async (userPrompt?: string) => {
    const textToSend = userPrompt || query;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: MessageItem = {
      id: Date.now().toString(),
      role: "user",
      content: textToSend,
    };

    setMessages((prev) => [...prev, userMsg]);
    setQuery("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: textToSend,
          profile: profile || undefined,
          affordability: contextData?.affordability,
          health: contextData?.health,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success && data.response) {
        const assistantMsg: MessageItem = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.response.summary,
          structured: data.response,
        };
        setMessages((prev) => [...prev, assistantMsg]);
      } else {
        throw new Error("Invalid response");
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            "I could not retrieve an analysis at this moment. Please verify your connection or review deterministic metrics directly on the dashboard.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 flex flex-col h-[700px] relative">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white tracking-tight">AI Financial Assistant</h3>
              <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-[9px] font-bold text-cyan-300 border border-cyan-500/30">
                Grounded Context
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Personalized financial education grounded strictly in your metrics.
            </p>
          </div>
        </div>
      </div>

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.map((m) => {
          const isUser = m.role === "user";

          return (
            <div
              key={m.id}
              className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
            >
              {!isUser && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 mt-1">
                  <Bot className="h-4 w-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                  isUser
                    ? "bg-emerald-500/20 text-emerald-100 border border-emerald-500/30"
                    : "bg-slate-900/80 text-slate-200 border border-white/10 shadow-glass"
                }`}
              >
                {isUser ? (
                  <p className="font-medium">{m.content}</p>
                ) : m.structured ? (
                  <div className="space-y-3">
                    <p className="font-medium text-white text-xs">{m.structured.summary}</p>

                    {m.structured.insights?.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                          Analytical Insights
                        </span>
                        <ul className="space-y-1 text-slate-300">
                          {m.structured.insights.map((ins, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-emerald-400 font-bold">•</span>
                              <span>{ins}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {m.structured.considerations?.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                          Risk Considerations
                        </span>
                        <ul className="space-y-1 text-slate-300">
                          {m.structured.considerations.map((c, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-amber-400 font-bold">⚠</span>
                              <span>{c}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="border-t border-white/5 pt-2 text-[10px] text-slate-500 italic">
                      {m.structured.disclaimer}
                    </div>
                  </div>
                ) : (
                  <p>{m.content}</p>
                )}
              </div>

              {isUser && (
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mt-1">
                  <User className="h-4 w-4" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-cyan-400 bg-slate-900/60 p-3 rounded-xl border border-white/5 w-fit">
            <Sparkles className="h-4 w-4 animate-spin" />
            <span>Analyzing calculations against risk rules...</span>
          </div>
        )}
      </div>

      {/* Prompt Starters */}
      <div className="mt-4 pt-3 border-t border-white/5">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {promptStarters.map((starter) => (
            <button
              key={starter}
              onClick={() => handleSend(starter)}
              disabled={isLoading}
              className="shrink-0 rounded-lg border border-white/10 bg-slate-950/60 px-2.5 py-1.5 text-[11px] text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300 transition-all text-left"
            >
              {starter}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2 mt-2"
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a question about your financial metrics, EMI, or credit profile..."
            disabled={isLoading}
            className="flex-1 rounded-xl glass-input px-4 py-2.5 text-xs text-white placeholder-slate-500"
          />
          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-all disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
