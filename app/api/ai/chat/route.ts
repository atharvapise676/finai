import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { queryClaudeAI } from "@/lib/ai-service";
import { getUserFromRequest } from "@/lib/auth";
import { db } from "@/lib/db";
import { recordAuditLog } from "@/lib/audit";

const AIChatSchema = z.object({
  query: z.string().min(1, "Question cannot be empty").max(1000, "Question too long"),
  profile: z.record(z.string(), z.any()).optional(),
  affordability: z.record(z.string(), z.any()).optional(),
  health: z.record(z.string(), z.any()).optional(),
  conversationId: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validated = AIChatSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: "Validation failed", details: validated.error.flatten() },
        { status: 400 }
      );
    }

    const { query, profile, affordability, health, conversationId } = validated.data;
    const session = await getUserFromRequest(req);

    // Call the Claude AI service layer with strict system prompt & fallback
    const aiResponse = await queryClaudeAI({
      profile,
      affordability,
      health,
      query,
    });

    // Save to conversation history if user is logged in
    if (session) {
      try {
        let convId = conversationId;
        if (!convId) {
          const conv = await db.aIConversation.create({
            data: {
              userId: session.userId,
              title: query.slice(0, 40) + "...",
            },
          });
          convId = conv.id;
        }

        await db.aIMessage.createMany({
          data: [
            {
              conversationId: convId,
              role: "user",
              content: query,
            },
            {
              conversationId: convId,
              role: "assistant",
              content: aiResponse.summary,
              structuredData: JSON.stringify(aiResponse),
            },
          ],
        });

        await recordAuditLog("AI_QUERY_DISPATCHED", session.userId, { querySnippet: query.slice(0, 50) });
      } catch (err) {
        console.warn("Could not persist AI message to database:", err);
      }
    }

    return NextResponse.json({
      success: true,
      response: aiResponse,
    });
  } catch (error) {
    console.error("AI Chat API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
