"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { UploadCloud, FileText, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

export const DocumentAnalyzerCard: React.FC = () => {
  const { updateProfile } = useAuth();
  const [selectedDocType, setSelectedDocType] = useState("salary_slip");
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedResult, setExtractedResult] = useState<any>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSimulateUpload = async (docType = selectedDocType) => {
    setIsProcessing(true);
    setSuccessMessage(null);
    setExtractedResult(null);

    const formData = new FormData();
    const dummyBlob = new Blob(["dummy financial statement content"], { type: "application/pdf" });
    const dummyFile = new File([dummyBlob], `${docType}_august_2026.pdf`, { type: "application/pdf" });

    formData.append("file", dummyFile);
    formData.append("documentType", docType);

    try {
      const res = await fetch("/api/documents/analyze", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setExtractedResult(data.data);
      }
    } catch (err) {
      console.error("Document analysis error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplyToProfile = async () => {
    if (!extractedResult?.profileSuggestions) return;
    await updateProfile(extractedResult.profileSuggestions);
    setSuccessMessage("Extracted figures successfully applied to your active financial profile!");
  };

  return (
    <div className="glass-panel rounded-2xl p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
            Automated OCR & Extraction
          </span>
          <h3 className="text-xl font-bold text-white tracking-tight mt-0.5">
            Financial Document Statement Analyzer
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Zero Execution Sandbox</span>
        </div>
      </div>

      {/* Document Type Selector */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {[
          { id: "salary_slip", label: "Salary Slip", desc: "Extract Net Pay, Deductions & Employer" },
          { id: "bank_statement", label: "Bank Statement", desc: "Identify Recurring EMIs & Average Balance" },
          { id: "loan_sanction", label: "Loan Sanction Letter", desc: "Verify Rate, Tenure & Processing Fees" },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => {
              setSelectedDocType(t.id);
              handleSimulateUpload(t.id);
            }}
            className={`rounded-xl border p-4 text-left transition-all ${
              selectedDocType === t.id
                ? "border-emerald-500/40 bg-emerald-500/10 text-white"
                : "border-white/5 bg-slate-950/40 text-slate-400 hover:text-white"
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <FileText className={`h-4 w-4 ${selectedDocType === t.id ? "text-emerald-400" : "text-slate-400"}`} />
              <span className="text-xs font-bold text-white">{t.label}</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">{t.desc}</p>
          </button>
        ))}
      </div>

      {/* Upload Zone */}
      <div className="rounded-2xl border-2 border-dashed border-white/10 bg-slate-950/40 p-8 text-center mb-6 hover:border-emerald-500/40 transition-colors">
        <div className="flex flex-col items-center">
          <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-400 mb-3">
            <UploadCloud className="h-8 w-8" />
          </div>
          <h4 className="text-sm font-semibold text-white mb-1">
            Upload Financial Document (PDF, PNG, JPEG)
          </h4>
          <p className="text-xs text-slate-400 max-w-sm mb-4">
            Drag and drop your file or test with our pre-loaded statement simulations.
          </p>

          <button
            type="button"
            onClick={() => handleSimulateUpload(selectedDocType)}
            disabled={isProcessing}
            className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-all disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            <span>{isProcessing ? "Processing OCR Extraction..." : "Analyze Sample Statement"}</span>
          </button>
        </div>
      </div>

      {/* Extraction Verification Results */}
      {extractedResult && (
        <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">{extractedResult.documentName}</span>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-bold text-emerald-400">
                  {Math.round(extractedResult.confidenceScore * 100)}% Extraction Confidence
                </span>
              </div>
              <span className="text-[10px] text-slate-500">Document Type: {extractedResult.documentType}</span>
            </div>

            <button
              onClick={handleApplyToProfile}
              className="flex items-center gap-1.5 rounded-lg bg-cyan-500 px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-cyan-400 transition-all"
            >
              <span>Sync to Financial Profile</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {successMessage && (
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-xs text-emerald-300 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* Fields Table */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            {Object.entries(extractedResult.fields).map(([key, val]: [string, any]) => (
              <div key={key} className="rounded-xl border border-white/5 bg-slate-900/60 p-3">
                <span className="text-[10px] text-slate-400 font-medium capitalize">
                  {key.replace(/([A-Z])/g, " $1").trim()}
                </span>
                <div className="font-mono text-xs font-bold text-white mt-1">
                  {typeof val === "number" ? `₹${val.toLocaleString()}` : String(val)}
                </div>
              </div>
            ))}
          </div>

          <div className="text-[11px] text-slate-500 italic">
            Note: Never automatically trust extracted data without review. You have full edit control before applying.
          </div>
        </div>
      )}
    </div>
  );
};
