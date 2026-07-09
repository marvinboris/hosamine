import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";
import { requireAuth } from "@/lib/auth";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, { params }: Params) {
  const guard = await requireAuth(req, "can_social");
  if (guard instanceof NextResponse) return guard;

  const { id } = await params;
  const body = await req.json();
  const db = createServiceClient();

  const allowed = ["content_fr", "content_en", "platforms", "media_urls", "scheduled_at", "status"];
  const updates: Record<string, unknown> = {};
  for (const k of allowed) {
    if (k in body) updates[k] = body[k];
  }

  const { data, error } = await db
    .from("social_posts")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const guard = await requireAuth(req, "can_social");
  if (guard instanceof NextResponse) return guard;

  const { id } = await params;
  const db = createServiceClient();
  const { error } = await db.from("social_posts").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return new NextResponse(null, { status: 204 });
}
