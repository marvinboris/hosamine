import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createServiceClient } from "@/lib/supabase/server";
import { signSession } from "@/lib/session";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Identifiants incorrects." }, { status: 401 });
  }

  const db = createServiceClient();
  const { data: user, error } = await db
    .from("admin_users")
    .select("id, name, password_hash, role_id, admin_roles(name)")
    .eq("email", email.toLowerCase())
    .single();

  if (error || !user) {
    return NextResponse.json({ error: "Identifiants incorrects." }, { status: 401 });
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    return NextResponse.json({ error: "Identifiants incorrects." }, { status: 401 });
  }

  const roleName = (user.admin_roles as { name: string } | null)?.name ?? "readonly";
  const session = await signSession({ uid: user.id, role: roleName, name: user.name });

  const res = NextResponse.json({ ok: true, role: roleName });
  res.cookies.set("admin_session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete("admin_session");
  return res;
}
