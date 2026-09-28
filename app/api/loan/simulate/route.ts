import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { simulateWhatIfScenarios } from "@/lib/financial-engine";

const SimulateSchema = z.object({
  principal: z.number().min(1000),
  annualRate: z.number().min(0).max(100),
  tenuresInYears: z.array(z.number().min(1).max(40)).optional().default([5, 7, 10, 15, 20]),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = SimulateSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const { principal, annualRate, tenuresInYears } = validated.data;
    const scenarios = simulateWhatIfScenarios(principal, annualRate, tenuresInYears);

    return NextResponse.json({ success: true, scenarios });
  } catch (error) {
    console.error("Simulation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
