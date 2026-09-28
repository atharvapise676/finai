import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { detectTransactionAnomalies, TransactionRecord } from "@/lib/financial-engine";

const TransactionSchema = z.object({
  transactions: z.array(
    z.object({
      id: z.string(),
      date: z.string(),
      category: z.string(),
      description: z.string(),
      amount: z.number().min(0),
    })
  ).min(1),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = TransactionSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid transaction payload", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const anomalies = detectTransactionAnomalies(validated.data.transactions);

    return NextResponse.json({
      success: true,
      totalAnalyzed: validated.data.transactions.length,
      anomaliesFound: anomalies.length,
      anomalies,
      disclaimer:
        "FinAI anomaly detection identifies statistical outliers and duplicate billing patterns. It does not constitute formal bank fraud detection.",
    });
  } catch (error) {
    console.error("Transaction anomaly error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
