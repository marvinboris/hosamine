import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET() {
  const db = createServiceClient();
  const { data, error } = await db
    .from("admin_users")
    .select("id, name, email, role_id, created_at, admin_roles(name)")
    .order("created_at");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const { name, email, password, role_id } = await req.json();
  if (!name || !email || !password) {
    return NextResponse.json({ error: "name, email, password requis." }, { status: 400 });
  }
  const password_hash = await bcrypt.hash(password, 10);
  const db = createServiceClient();
  const { data, error } = await db
    .from("admin_users")
    .insert({ name, email: email.toLowerCase(), password_hash, role_id: role_id ?? null })
    .select("id, name, email, role_id, created_at, admin_roles(name)")
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
