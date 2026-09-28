import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { recordAuditLog } from "@/lib/audit";

export async function POST(req: NextRequest) {
  const user = await getUserFromRequest(req);
  if (user) {
    await recordAuditLog("LOGOUT", user.userId);
  }

  const response = NextResponse.json({ success: true, message: "Logged out successfully" });
  response.cookies.delete("finai_session");
  return response;
}
