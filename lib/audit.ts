import { db } from "./db";

export type AuditAction =
  | "LOGIN"
  | "SIGNUP"
  | "LOGOUT"
  | "PROFILE_UPDATE"
  | "EMI_CALCULATED"
  | "AFFORDABILITY_EVALUATED"
  | "STRESS_TEST_RUN"
  | "RULE_UPDATED"
  | "AI_QUERY_DISPATCHED"
  | "DOCUMENT_ANALYZED"
  | "GOAL_CREATED"
  | "GOAL_UPDATED"
  | "BUDGET_SAVED"
  | "EXPORT_DATA";

export async function recordAuditLog(
  action: AuditAction,
  userId?: string | null,
  metadata?: Record<string, unknown>,
  ipAddress?: string
) {
  try {
    // Sanitize metadata to prevent logging any passwords or tokens
    const cleanMeta = metadata ? { ...metadata } : {};
    delete (cleanMeta as Record<string, unknown>).password;
    delete (cleanMeta as Record<string, unknown>).token;
    delete (cleanMeta as Record<string, unknown>).secret;

    await db.auditLog.create({
      data: {
        userId: userId || null,
        action,
        metadata: JSON.stringify(cleanMeta),
        ipAddress: ipAddress || null,
      },
    });
  } catch (error) {
    // Non-blocking error handling for audit logs so main business logic is never blocked
    console.error("Audit log failed to record:", error);
  }
}
