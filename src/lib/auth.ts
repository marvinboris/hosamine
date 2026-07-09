import { NextRequest, NextResponse } from "next/server";
import { verifySession, type SessionPayload } from "@/lib/session";
import { createServiceClient } from "@/lib/supabase/server";

export type Permission =
  | "can_crm"
  | "can_billing"
  | "can_social"
  | "can_content"
  | "can_settings";

/**
 * Verify the admin_session cookie. Returns the session payload or null.
 */
export async function getSession(req: NextRequest): Promise<SessionPayload | null> {
  const token = req.cookies.get("admin_session")?.value;
  if (!token) return null;
  return verifySession(token);
}

/**
 * Guard an API route: require a valid session AND (optionally) a role permission.
 * Returns the session on success, or a NextResponse (401/403) to return directly.
 *
 *   const guard = await requireAuth(req, "can_crm");
 *   if (guard instanceof NextResponse) return guard;
 *   // guard is the SessionPayload
 */
export async function requireAuth(
  req: NextRequest,
  permission?: Permission
): Promise<SessionPayload | NextResponse> {
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ error: "Non authentifié." }, { status: 401 });
  }

  if (permission) {
    // Look up the role's permission flags by role name.
    const db = createServiceClient();
    const { data: role } = await db
      .from("admin_roles")
      .select(permission)
      .eq("name", session.role)
      .single();

    const allowed = (role as Record<Permission, boolean> | null)?.[permission] === true;
    if (!allowed) {
      return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
    }
  }

  return session;
}
