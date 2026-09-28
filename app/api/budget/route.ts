import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getUserFromRequest } from "@/lib/auth";
import { db } from "@/lib/db";
import { recordAuditLog } from "@/lib/audit";

const BudgetItemSchema = z.object({
  category: z.string().min(1),
  allocated: z.number().min(0),
  spent: z.number().min(0).optional().default(0),
});

const BudgetSaveSchema = z.object({
  month: z.string().min(4), // "YYYY-MM"
  income: z.number().min(0),
  items: z.array(BudgetItemSchema).min(1),
});

export async function GET(req: NextRequest) {
  try {
    const session = await getUserFromRequest(req);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const budget = await db.budget.findFirst({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" },
      include: { items: true },
    });

    return NextResponse.json({ success: true, budget });
  } catch (error) {
    console.error("Get budget error:", error);
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
    const validated = BudgetSaveSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const { month, income, items } = validated.data;

    // Check if budget exists for this month, or create new
    let budget = await db.budget.findFirst({
      where: { userId: session.userId, month },
    });

    if (budget) {
      await db.budgetItem.deleteMany({ where: { budgetId: budget.id } });
      budget = await db.budget.update({
        where: { id: budget.id },
        data: {
          income,
          items: {
            create: items.map((it) => ({
              category: it.category,
              allocated: it.allocated,
              spent: it.spent,
            })),
          },
        },
        include: { items: true },
      });
    } else {
      budget = await db.budget.create({
        data: {
          userId: session.userId,
          month,
          income,
          items: {
            create: items.map((it) => ({
              category: it.category,
              allocated: it.allocated,
              spent: it.spent,
            })),
          },
        },
        include: { items: true },
      });
    }

    await recordAuditLog("BUDGET_SAVED", session.userId, { month, totalItems: items.length });

    return NextResponse.json({ success: true, budget });
  } catch (error) {
    console.error("Save budget error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
