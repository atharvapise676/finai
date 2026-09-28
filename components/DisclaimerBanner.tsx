"use client";

import React from "react";
import { AlertCircle, ShieldAlert } from "lucide-react";
import { useI18n } from "@/lib/i18n";

export const DisclaimerBanner: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { t } = useI18n();

  if (compact) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-[11px] text-amber-300/90">
        <ShieldAlert className="h-4 w-4 shrink-0 text-amber-400" />
        <span>
          <strong>Educational Notice:</strong> Mathematical estimates only. FinAI does not guarantee loan approval or represent bank underwriting.
        </span>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-amber-500/20 bg-gradient-to-r from-amber-500/10 via-slate-900/50 to-amber-500/5 p-4 text-xs text-amber-200/90 shadow-glass">
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-amber-500/20 p-2 text-amber-400 shrink-0 mt-0.5">
          <AlertCircle className="h-4 w-4" />
        </div>
        <div className="space-y-1">
          <h4 className="font-semibold text-amber-300">Mandatory Regulatory & Financial Education Notice</h4>
          <p className="text-amber-200/80 leading-relaxed">
            {t.disclaimerText} Actual loan interest rates, sanction limits, processing fees, documentation requirements, and underwriting decisions remain at the sole discretion of the respective regulated banks, NBFCs, and financial institutions.
          </p>
        </div>
      </div>
    </div>
  );
};
