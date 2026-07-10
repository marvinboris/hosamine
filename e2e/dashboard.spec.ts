import { test, expect } from "@playwright/test";

test.describe("Tableau de bord", () => {
  test("les stat-cards et le pipeline s'affichent", async ({ page }) => {
    await page.goto("/admin");
    await expect(page.getByText("Clients actifs")).toBeVisible();
    await expect(page.getByText("Suivis en retard")).toBeVisible();
    await expect(page.getByText("Pipeline Commercial")).toBeVisible();
  });

  test("l'API stats renvoie les compteurs", async ({ request }) => {
    const res = await request.get("/api/dashboard/stats");
    expect(res.ok()).toBeTruthy();
    const stats = await res.json();
    expect(typeof stats.activeClients).toBe("number");
    expect(typeof stats.scheduledPosts).toBe("number");
  });
});
