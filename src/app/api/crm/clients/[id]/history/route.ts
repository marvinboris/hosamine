import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

// Add a manual history entry (note / payment) to a client timeline.
export async function POST(req: NextRequest, { params }: Params) {
  const guard = await requireAuth(req, "can_crm");
  if (guard instanceof NextResponse) return guard;

  const { id } = await params;
  const body = await req.json();

  if (!body.action) {
    return NextResponse.json({ error: "action requise." }, { status: 400 });
  }

  const db = createServiceClient();
  const { data, error } = await db
    .from("crm_history")
    .insert({
      client_id:  id,
      action:     body.action,
      note:       body.note ?? null,
      amount:     body.amount ?? null,
      created_by: guard.name,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
