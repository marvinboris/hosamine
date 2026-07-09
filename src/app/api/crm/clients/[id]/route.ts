import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth";
import type { Stage } from "@/lib/db/types";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const db = createServiceClient();

  const [client, history, documents] = await Promise.all([
    db.from("crm_clients").select("*").eq("id", id).single(),
    db.from("crm_history").select("*").eq("client_id", id).order("created_at", { ascending: false }),
    db.from("crm_documents").select("*").eq("client_id", id).order("created_at"),
  ]);

  if (client.error) return NextResponse.json({ error: client.error.message }, { status: 404 });

  return NextResponse.json({
    client: client.data,
    history: history.data ?? [],
    documents: documents.data ?? [],
  });
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const guard = await requireAuth(req, "can_crm");
  if (guard instanceof NextResponse) return guard;

  const { id } = await params;
  const body = await req.json();
  const db = createServiceClient();

  const updates: Record<string, unknown> = {};
  const allowed = [
    "full_name", "location", "sector", "contact_name", "contact_phone",
    "contact_email", "need_summary", "stage", "quote_ref", "quote_amount",
    "advance_paid", "recovery_delay", "next_followup", "service_date", "notes",
  ];
  for (const k of allowed) {
    if (k in body) updates[k] = body[k];
  }

  const { data, error } = await db
    .from("crm_clients")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Log stage change
  if (body.stage && body._prev_stage && body.stage !== body._prev_stage) {
    await db.from("crm_history").insert({
      client_id:  id,
      action:     `Étape changée : ${body._prev_stage} → ${body.stage}`,
      created_by: body._updated_by ?? "admin",
    });
  }

  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const guard = await requireAuth(req, "can_crm");
  if (guard instanceof NextResponse) return guard;

  const { id } = await params;
  const db = createServiceClient();

  // crm_history / crm_documents cascade via FK ON DELETE CASCADE (see migration 001).
  const { error } = await db.from("crm_clients").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return new NextResponse(null, { status: 204 });
}
