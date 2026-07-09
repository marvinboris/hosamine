import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const guard = await requireAuth(req, "can_settings");
  if (guard instanceof NextResponse) return guard;

  const { id } = await params;
  const body = await req.json();
  const db = createServiceClient();

  const updates: Record<string, unknown> = {};
  if (body.name !== undefined)         updates.name = body.name;
  if (body.can_crm !== undefined)      updates.can_crm = body.can_crm;
  if (body.can_billing !== undefined)  updates.can_billing = body.can_billing;
  if (body.can_social !== undefined)   updates.can_social = body.can_social;
  if (body.can_content !== undefined)  updates.can_content = body.can_content;
  if (body.can_settings !== undefined) updates.can_settings = body.can_settings;

  const { data, error } = await db
    .from("admin_roles")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const guard = await requireAuth(req, "can_settings");
  if (guard instanceof NextResponse) return guard;

  const { id } = await params;
  const db = createServiceClient();
  const { error } = await db.from("admin_roles").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
