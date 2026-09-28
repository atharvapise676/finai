"use client";

import React from "react";
import { DocumentAnalyzerCard } from "@/components/DocumentAnalyzerCard";
import { DisclaimerBanner } from "@/components/DisclaimerBanner";
import { FileText, ShieldCheck, Lock } from "lucide-react";

export default function DocumentsPage() {
  return (
    <div className="space-y-8 pb-12">
      <div className="border-b border-white/5 pb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Document Extraction Sandbox
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
          Financial Statement & Document Analyzer
        </h1>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl">
          Upload salary slips, bank statements, or sanction letters to simulate OCR extraction. Verify all figures before syncing to your active financial profile.
        </p>
      </div>

      <DocumentAnalyzerCard />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-400">
        <div className="glass-panel rounded-2xl p-4 space-y-1">
          <span className="font-semibold text-white">Client-Side Isolation</span>
          <p>Files are parsed in a secure sandbox. Uploaded documents are never stored permanently or shared with third parties.</p>
        </div>
        <div className="glass-panel rounded-2xl p-4 space-y-1">
          <span className="font-semibold text-white">User Verification</span>
          <p>Never rely blindly on automated OCR. FinAI displays extracted figures side-by-side for your final manual confirmation.</p>
        </div>
        <div className="glass-panel rounded-2xl p-4 space-y-1">
          <span className="font-semibold text-white">Format Support</span>
          <p>Supports PDF, PNG, and JPEG statements with automated resolution enhancement and field alignment.</p>
        </div>
      </div>

      <DisclaimerBanner />
    </div>
  );
}
