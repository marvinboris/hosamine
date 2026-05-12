import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/session";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("admin_session")?.value;
  if (!token) return NextResponse.json({ error: "Unauthenticated" }, { status: 401 });
  const payload = await verifySession(token);
  if (!payload) return NextResponse.json({ error: "Invalid session" }, { status: 401 });
  return NextResponse.json(payload);
}
