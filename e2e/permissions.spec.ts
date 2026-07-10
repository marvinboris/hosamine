import { test, expect } from "@playwright/test";
import { createRole, deleteRole, createUser, deleteUser } from "./helpers";

const BASE = process.env.E2E_BASE_URL ?? "http://localhost:3000";

// A role without a given permission must be rejected server-side (403) on the
// corresponding mutating endpoint — even with a valid session.
test.describe("Paramètres — permissions par rôle", () => {
  test("un rôle sans can_social reçoit 403 sur POST /api/social/posts", async ({ request, playwright }) => {
    const role = await createRole(request, {
      can_crm: true,
      can_billing: false,
      can_social: false,
      can_content: false,
      can_settings: false,
    });
    const email = `test_perm_${Date.now()}@hosamine.test`;
    const password = "test-pw-123456";
    const user = await createUser(request, { email, password, role_id: role.id });

    // Fresh context authenticated AS the limited user (no shared cookies).
    const ctx = await playwright.request.newContext({ baseURL: BASE });
    try {
      const login = await ctx.post("/api/admin/auth", { data: { email, password } });
      expect(login.ok()).toBeTruthy();

      // Allowed: CRM read
      const crm = await ctx.get("/api/crm/clients");
      expect(crm.status()).toBe(200);

      // Forbidden: social create (no can_social)
      const social = await ctx.post("/api/social/posts", {
        data: { content_fr: "[TEST] nope", platforms: ["facebook"], status: "draft" },
      });
      expect(social.status()).toBe(403);
    } finally {
      await ctx.dispose();
      await deleteUser(request, user.id);
      await deleteRole(request, role.id);
    }
  });
});
