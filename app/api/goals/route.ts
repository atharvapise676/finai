import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getUserFromRequest } from "@/lib/auth";
import { db } from "@/lib/db";
import { recordAuditLog } from "@/lib/audit";

const GoalCreateSchema = z.object({
  name: z.string().min(2, "Goal name must be at least 2 characters"),
  category: z.enum(["Emergency", "Home", "Vehicle", "Education", "Travel", "Debt", "Other"]),
  targetAmount: z.number().min(100, "Target amount must be at least 100"),
  currentAmount: z.number().min(0).optional().default(0),
  targetDate: z.string().min(4), // ISO string or YYYY-MM-DD
});

export async function GET(req: NextRequest) {
  try {
    const session = await getUserFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const goals = await db.financialGoal.findMany({
      where: { userId: session.userId },
      orderBy: { targetDate: "asc" },
    });

    return NextResponse.json({ success: true, goals });
  } catch (error) {
    console.error("Get goals error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getUserFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validated = GoalCreateSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const { name, category, targetAmount, currentAmount, targetDate } = validated.data;

    const goal = await db.financialGoal.create({
      data: {
        userId: session.userId,
        name,
        category,
        targetAmount,
        currentAmount: currentAmount || 0,
        targetDate: new Date(targetDate),
      },
    });

    await recordAuditLog("GOAL_CREATED", session.userId, { goalId: goal.id, name: goal.name });

    return NextResponse.json({ success: true, goal });
  } catch (error) {
    console.error("Create goal error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
