import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import type { Stage } from "@/lib/db/types";

export async function GET() {
  const db = createServiceClient();
  const { data, error } = await db
    .from("crm_clients")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const db = createServiceClient();

  const { data, error } = await db
    .from("crm_clients")
    .insert({
      full_name:     body.full_name,
      location:      body.location ?? null,
      sector:        body.sector ?? null,
      contact_name:  body.contact_name ?? null,
      contact_phone: body.contact_phone ?? null,
      contact_email: body.contact_email ?? null,
      need_summary:  body.need_summary ?? null,
      stage:         (body.stage as Stage) ?? "new",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Auto-create 3 document records
  await db.from("crm_documents").insert([
    { client_id: data.id, type: "pv_traitement",      status: "pending" },
    { client_id: data.id, type: "bordereau_reception", status: "pending" },
    { client_id: data.id, type: "attestation",         status: "pending" },
  ]);

  // Log creation in history
  await db.from("crm_history").insert({
    client_id:  data.id,
    action:     "Client créé",
    created_by: body.created_by ?? "admin",
  });

  return NextResponse.json(data, { status: 201 });
}
