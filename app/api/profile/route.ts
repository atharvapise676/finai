import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getUserFromRequest } from "@/lib/auth";
import { db } from "@/lib/db";
import { recordAuditLog } from "@/lib/audit";

const ProfileUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  monthlyIncome: z.number().min(0),
  monthlyExpenses: z.number().min(0),
  existingEmi: z.number().min(0),
  savings: z.number().min(0),
  emergencyFund: z.number().min(0).optional(),
  creditScore: z.number().min(300).max(900),
  employmentType: z.enum(["salaried", "self_employed", "business", "freelancer"]).optional(),
  age: z.number().min(18).max(100).optional(),
  dependents: z.number().min(0).max(20).optional(),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getUserFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await db.financialProfile.findUnique({
      where: { userId: session.userId },
      include: { user: { select: { name: true, email: true, role: true } } },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getUserFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validated = ProfileUpdateSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const data = validated.data;

    if (data.name) {
      await db.user.update({
        where: { id: session.userId },
        data: { name: data.name },
      });
    }

    const updatedProfile = await db.financialProfile.upsert({
      where: { userId: session.userId },
      update: {
        monthlyIncome: data.monthlyIncome,
        monthlyExpenses: data.monthlyExpenses,
        existingEmi: data.existingEmi,
        savings: data.savings,
        emergencyFund: data.emergencyFund !== undefined ? data.emergencyFund : data.savings * 0.6,
        creditScore: data.creditScore,
        employmentType: data.employmentType || "salaried",
        age: data.age || 30,
        dependents: data.dependents !== undefined ? data.dependents : 1,
      },
      create: {
        userId: session.userId,
        monthlyIncome: data.monthlyIncome,
        monthlyExpenses: data.monthlyExpenses,
        existingEmi: data.existingEmi,
        savings: data.savings,
        emergencyFund: data.emergencyFund !== undefined ? data.emergencyFund : data.savings * 0.6,
        creditScore: data.creditScore,
        employmentType: data.employmentType || "salaried",
        age: data.age || 30,
        dependents: data.dependents !== undefined ? data.dependents : 1,
      },
    });

    await recordAuditLog("PROFILE_UPDATE", session.userId, {
      income: data.monthlyIncome,
      creditScore: data.creditScore,
    });

    return NextResponse.json({ success: true, profile: updatedProfile });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
