import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getUserFromRequest } from "@/lib/auth";
import { db } from "@/lib/db";
import { recordAuditLog } from "@/lib/audit";

const GoalUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  category: z.enum(["Emergency", "Home", "Vehicle", "Education", "Travel", "Debt", "Other"]).optional(),
  targetAmount: z.number().min(100).optional(),
  currentAmount: z.number().min(0).optional(),
  targetDate: z.string().optional(),
});

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getUserFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();
    const validated = GoalUpdateSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const goal = await db.financialGoal.findUnique({ where: { id } });
    if (!goal || goal.userId !== session.userId) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    const updated = await db.financialGoal.update({
      where: { id },
      data: {
        ...(validated.data.name && { name: validated.data.name }),
        ...(validated.data.category && { category: validated.data.category }),
        ...(validated.data.targetAmount !== undefined && { targetAmount: validated.data.targetAmount }),
        ...(validated.data.currentAmount !== undefined && { currentAmount: validated.data.currentAmount }),
        ...(validated.data.targetDate && { targetDate: new Date(validated.data.targetDate) }),
      },
    });

    await recordAuditLog("GOAL_UPDATED", session.userId, { goalId: id, currentAmount: updated.currentAmount });

    return NextResponse.json({ success: true, goal: updated });
  } catch (error) {
    console.error("Update goal error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getUserFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const goal = await db.financialGoal.findUnique({ where: { id } });
    if (!goal || goal.userId !== session.userId) {
      return NextResponse.json({ error: "Goal not found" }, { status: 404 });
    }

    await db.financialGoal.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Goal deleted" });
  } catch (error) {
    console.error("Delete goal error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
