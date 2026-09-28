import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { compareLoanOffers } from "@/lib/financial-engine";

const OfferSchema = z.object({
  id: z.string(),
  provider: z.string().min(1),
  principal: z.number().min(1000),
  annualRate: z.number().min(0).max(100),
  tenureMonths: z.number().min(1).max(600),
  processingFeePercent: z.number().min(0).max(15).optional().default(0),
  otherCharges: z.number().min(0).optional().default(0),
});

const CompareSchema = z.object({
  offers: z.array(OfferSchema).min(1).max(6),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = CompareSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const compared = compareLoanOffers(validated.data.offers);

    return NextResponse.json({ success: true, compared });
  } catch (error) {
    console.error("Comparison error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
