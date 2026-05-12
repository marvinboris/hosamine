import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  const body = await req.json();
  const db = createServiceClient();

  const updates: Record<string, unknown> = {};
  if ("status" in body) updates.status = body.status;
  if ("signed_at" in body) updates.signed_at = body.signed_at;
  if ("file_url" in body) updates.file_url = body.file_url;

  const { data, error } = await db
    .from("crm_documents")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
