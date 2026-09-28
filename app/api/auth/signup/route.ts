import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { hashPassword, signToken } from "@/lib/auth";
import { recordAuditLog } from "@/lib/audit";

const SignupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  monthlyIncome: z.number().min(0).optional().default(60000),
  monthlyExpenses: z.number().min(0).optional().default(25000),
  existingEmi: z.number().min(0).optional().default(5000),
  savings: z.number().min(0).optional().default(80000),
  creditScore: z.number().min(300).max(900).optional().default(750),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = SignupSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const { email, password, name, monthlyIncome, monthlyExpenses, existingEmi, savings, creditScore } = validated.data;

    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const passwordHash = await hashPassword(password);

    const user = await db.user.create({
      data: {
        email,
        name,
        passwordHash,
        role: "user",
        profile: {
          create: {
            monthlyIncome,
            monthlyExpenses,
            existingEmi,
            savings,
            emergencyFund: savings * 0.6,
            creditScore,
            employmentType: "salaried",
            age: 30,
            dependents: 1,
          },
        },
      },
      include: {
        profile: true,
      },
    });

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    await recordAuditLog("SIGNUP", user.id, { email: user.email });

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profile: user.profile,
      },
      token,
    });

    response.cookies.set("finai_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
