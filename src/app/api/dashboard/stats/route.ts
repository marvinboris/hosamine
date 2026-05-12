import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/server";

export async function GET() {
  const db = createServiceClient();
  const today = new Date().toISOString().slice(0, 10);

  const [clientsRes, followupRes, recoveryRes, postsRes] = await Promise.all([
    db.from("crm_clients").select("id, stage, quote_amount, advance_paid").neq("stage", "done"),
    db.from("crm_clients").select("id").lte("next_followup", today).not("next_followup", "is", null).neq("stage", "done"),
    db.from("crm_clients").select("quote_amount, advance_paid").eq("stage", "recovery"),
    db.from("social_posts").select("id").eq("status", "scheduled"),
  ]);

  const activeClients = clientsRes.data?.length ?? 0;
  const overdueFollowups = followupRes.data?.length ?? 0;
  const recoveryAmount = (recoveryRes.data ?? []).reduce(
    (sum: number, c: { quote_amount: number | null; advance_paid: number }) =>
      sum + ((c.quote_amount ?? 0) - (c.advance_paid ?? 0)),
    0
  );
  const scheduledPosts = postsRes.data?.length ?? 0;

  return NextResponse.json({ activeClients, overdueFollowups, recoveryAmount, scheduledPosts });
}
