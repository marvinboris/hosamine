import { test, expect } from "@playwright/test";

test.describe("Documentation intégrée", () => {
  test("le centre d'aide liste les guides", async ({ page }) => {
    await page.goto("/admin/docs");
    await expect(page.getByPlaceholder("Rechercher un guide...")).toBeVisible();
    await expect(page.getByText("Pipeline commercial")).toBeVisible();
  });

  test("un guide s'ouvre et affiche ses sections", async ({ page }) => {
    await page.goto("/admin/docs/pipeline-crm");
    await expect(page.getByRole("heading", { name: "Pipeline commercial" })).toBeVisible();
    await expect(page.getByText("À quoi ça sert")).toBeVisible();
    await expect(page.getByText("Articles liés")).toBeVisible();
  });

  test("la recherche filtre les guides", async ({ page }) => {
    await page.goto("/admin/docs");
    await page.getByPlaceholder("Rechercher un guide...").fill("recouvrement");
    await expect(page.locator('a[href="/admin/docs/recouvrement"]')).toBeVisible();
    await expect(page.locator('a[href="/admin/docs/pipeline-crm"]')).toHaveCount(0);
  });
});
