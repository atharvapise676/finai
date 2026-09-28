import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getUserFromRequest } from "@/lib/auth";
import { db } from "@/lib/db";
import { recordAuditLog } from "@/lib/audit";
import { DEFAULT_ELIGIBILITY_RULES } from "@/lib/financial-engine";

const RuleUpdateSchema = z.object({
  ruleVersion: z.string().min(2),
  minIncome: z.number().min(5000),
  maxFOIR: z.number().min(0.1).max(0.9),
  minCreditScore: z.number().min(300).max(900),
  maxLoanTenure: z.number().min(12).max(480),
  maxMultiplier: z.number().min(1).max(120),
});

export async function GET() {
  try {
    const rules = await db.eligibilityRule.findMany({
      orderBy: { createdAt: "desc" },
    });

    const activeRule = rules.find((r) => r.isActive) || DEFAULT_ELIGIBILITY_RULES;

    return NextResponse.json({ success: true, activeRule, allVersions: rules });
  } catch (error) {
    console.error("Get rules error:", error);
    return NextResponse.json({ success: true, activeRule: DEFAULT_ELIGIBILITY_RULES, allVersions: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getUserFromRequest(req);
    const body = await req.json();
    const validated = RuleUpdateSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const data = validated.data;

    // Deactivate previous active rules
    await db.eligibilityRule.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });

    const newRule = await db.eligibilityRule.create({
      data: {
        ruleVersion: data.ruleVersion,
        minIncome: data.minIncome,
        maxFOIR: data.maxFOIR,
        minCreditScore: data.minCreditScore,
        maxLoanTenure: data.maxLoanTenure,
        maxMultiplier: data.maxMultiplier,
        isActive: true,
        updatedBy: session?.name || "Admin",
      },
    });

    await recordAuditLog("RULE_UPDATED", session?.userId, {
      version: data.ruleVersion,
      maxFOIR: data.maxFOIR,
      minCreditScore: data.minCreditScore,
    });

    return NextResponse.json({ success: true, rule: newRule });
  } catch (error) {
    console.error("Create rule error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
