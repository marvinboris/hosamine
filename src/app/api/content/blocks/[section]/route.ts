import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ section: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { section } = await params;
  const db = createServiceClient();
  const { data, error } = await db
    .from("content_blocks")
    .select("*")
    .eq("section", section)
    .order("key");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { section } = await params;
  const updates: Array<{ key: string; fr?: string; en?: string }> = await req.json();
  const db = createServiceClient();

  const results = await Promise.all(
    updates.map(({ key, fr, en }) => {
      const payload: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (fr !== undefined) payload.fr = fr;
      if (en !== undefined) payload.en = en;
      return db
        .from("content_blocks")
        .update(payload)
        .eq("section", section)
        .eq("key", key)
        .select()
        .single();
    })
  );

  const failed = results.find((r) => r.error);
  if (failed?.error) return NextResponse.json({ error: failed.error.message }, { status: 500 });

  return NextResponse.json(results.map((r) => r.data));
}
