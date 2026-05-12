import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET() {
  const db = createServiceClient();
  const { data, error } = await db
    .from("content_blocks")
    .select("*")
    .order("section")
    .order("key");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
