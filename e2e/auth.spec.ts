import { test, expect } from "@playwright/test";

const EMAIL = process.env.E2E_ADMIN_EMAIL ?? "admin@hosamine.net";
const PASSWORD = process.env.E2E_ADMIN_PASSWORD ?? "hosamine2025";

// Guest project: no stored session.
test.describe("Authentification & enforcement", () => {
  test("API protégée renvoie 401 sans session", async ({ request }) => {
    const res = await request.get("/api/crm/clients");
    expect(res.status()).toBe(401);
  });

  test("page admin redirige vers login sans session", async ({ page }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin\/login/);
  });

  test("cookie forgé est rejeté", async ({ request }) => {
    const res = await request.get("/api/crm/clients", {
      headers: { Cookie: "admin_session=forged.payload.badsignature" },
    });
    expect(res.status()).toBe(401);
  });

  test("login valide puis logout efface la session", async ({ request }) => {
    const login = await request.post("/api/admin/auth", { data: { email: EMAIL, password: PASSWORD } });
    expect(login.ok()).toBeTruthy();

    // Authenticated within this request context now.
    const ok = await request.get("/api/crm/clients");
    expect(ok.status()).toBe(200);

    await request.delete("/api/admin/auth");
    const after = await request.get("/api/crm/clients");
    expect(after.status()).toBe(401);
  });

  test("identifiants incorrects → 401", async ({ request }) => {
    const res = await request.post("/api/admin/auth", { data: { email: EMAIL, password: "wrong" } });
    expect(res.status()).toBe(401);
  });
});
