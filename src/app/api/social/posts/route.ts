import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const month = searchParams.get("month"); // format: "2025-05"
  const db = createServiceClient();

  let query = db.from("social_posts").select("*").order("scheduled_at");

  if (month) {
    const start = `${month}-01`;
    const end = `${month}-31`;
    query = query.or(`scheduled_at.gte.${start},status.eq.draft`).lte("scheduled_at", end + "T23:59:59");
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const db = createServiceClient();

  const { data, error } = await db
    .from("social_posts")
    .insert({
      content_fr:   body.content_fr ?? null,
      content_en:   body.content_en ?? null,
      platforms:    body.platforms ?? [],
      media_urls:   body.media_urls ?? [],
      scheduled_at: body.scheduled_at ?? null,
      status:       body.status ?? "draft",
      created_by:   body.created_by ?? "admin",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
