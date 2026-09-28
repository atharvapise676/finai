import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { calculateEMI } from "@/lib/financial-engine";
import { getUserFromRequest } from "@/lib/auth";
import { db } from "@/lib/db";
import { recordAuditLog } from "@/lib/audit";

const EMISchema = z.object({
  principal: z.number().min(0, "Principal cannot be negative"),
  annualRate: z.number().min(0, "Annual interest rate cannot be negative").max(100, "Interest rate cannot exceed 100%"),
  tenureMonths: z.number().min(1, "Tenure must be at least 1 month").max(600, "Tenure cannot exceed 600 months"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = EMISchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Invalid calculation input", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const result = calculateEMI(validated.data);

    // Record calculation if authenticated
    const user = await getUserFromRequest(req);
    if (user) {
      await db.calculation.create({
        data: {
          userId: user.userId,
          type: "emi",
          inputData: JSON.stringify(validated.data),
          outputData: JSON.stringify({
            monthlyEmi: result.monthlyEmi,
            totalInterest: result.totalInterest,
            totalRepayment: result.totalRepayment,
          }),
        },
      });
      await recordAuditLog("EMI_CALCULATED", user.userId, { principal: validated.data.principal });
    }

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error("EMI calculation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
