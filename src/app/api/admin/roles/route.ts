import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET() {
  const db = createServiceClient();
  const { data, error } = await db.from("admin_roles").select("*").order("name");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (!body.name) return NextResponse.json({ error: "name requis." }, { status: 400 });
  const db = createServiceClient();
  const { data, error } = await db
    .from("admin_roles")
    .insert({
      name:         body.name,
      can_crm:      body.can_crm      ?? true,
      can_billing:  body.can_billing  ?? false,
      can_social:   body.can_social   ?? false,
      can_content:  body.can_content  ?? false,
      can_settings: body.can_settings ?? false,
    })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
