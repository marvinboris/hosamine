import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

// List all documents across clients, with the client name for display.
export async function GET() {
  const db = createServiceClient();
  const { data, error } = await db
    .from("crm_documents")
    .select("*, crm_clients(full_name)")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
