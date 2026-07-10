import { test, expect } from "@playwright/test";

// Edits a real content block, verifies the public site reflects it via the
// CMS bridge, then restores the original value.
test.describe("Contenu — CMS → site", () => {
  test("éditer hero.headline_1 se reflète sur le site public", async ({ request }) => {
    test.setTimeout(90_000); // dev compiles /fr on first hit

    // Capture original
    const before = await (await request.get("/api/content/blocks/hero")).json();
    const original = before.find((b: { key: string }) => b.key === "headline_1");
    expect(original, "hero.headline_1 introuvable — reseed content_blocks").toBeTruthy();
    const originalFr = original.fr as string;
    const originalEn = original.en as string;

    const marker = `E2E_${Date.now()}`;
    try {
      const patch = await request.patch("/api/content/blocks/hero", {
        data: [{ key: "headline_1", fr: marker, en: marker }],
      });
      expect(patch.ok()).toBeTruthy();

      // API reflects the write
      const after = await (await request.get("/api/content/blocks/hero")).json();
      expect(after.find((b: { key: string }) => b.key === "headline_1").fr).toBe(marker);

      // Public FR page reflects it via the CMS bridge. Asserted at the HTTP
      // level (no browser cache) with a poll for dev's on-demand compilation.
      await expect(async () => {
        const html = await (await request.get(`/fr?_=${Date.now()}`)).text();
        expect(html).toContain(marker);
      }).toPass({ timeout: 30_000 });
    } finally {
      // Restore
      await request.patch("/api/content/blocks/hero", {
        data: [{ key: "headline_1", fr: originalFr, en: originalEn }],
      });
    }
  });

  test("la liste des sections de contenu s'affiche (UI)", async ({ page }) => {
    await page.goto("/admin/content");
    await expect(page.getByText("Hero — Bannière principale")).toBeVisible();
  });
});
