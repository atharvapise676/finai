import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { analyzeCreditScore } from "@/lib/financial-engine";

const CreditSchema = z.object({
  score: z.number().min(300, "Credit score cannot be less than 300").max(900, "Credit score cannot exceed 900"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = CreditSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const analysis = analyzeCreditScore(validated.data.score);

    return NextResponse.json({ success: true, analysis });
  } catch (error) {
    console.error("Credit analysis error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
