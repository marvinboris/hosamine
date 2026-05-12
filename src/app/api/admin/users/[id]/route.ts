import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createServiceClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await req.json();
  const db = createServiceClient();

  const updates: Record<string, unknown> = {};
  if (body.name)     updates.name = body.name;
  if (body.email)    updates.email = body.email.toLowerCase();
  if (body.role_id !== undefined) updates.role_id = body.role_id;
  if (body.password) updates.password_hash = await bcrypt.hash(body.password, 10);

  const { data, error } = await db
    .from("admin_users")
    .update(updates)
    .eq("id", id)
    .select("id, name, email, role_id, created_at, admin_roles(name)")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const db = createServiceClient();
  const { error } = await db.from("admin_users").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
