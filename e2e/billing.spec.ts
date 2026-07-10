import { test, expect } from "@playwright/test";
import { createClient, deleteClient, sweepTestData } from "./helpers";

test.afterAll(async ({ request }) => {
  await sweepTestData(request);
});

test.describe("Facturation", () => {
  test("un devis apparaît dans Devis Challenge (UI)", async ({ request, page }) => {
    const client = await createClient(request, {
      stage: "quote",
      quote_ref: "TEST-DEV-001",
      quote_amount: 1_000_000,
      advance_paid: 400_000,
    });
    try {
      await page.goto("/admin/billing/quotes");
      await expect(page.getByText(client.full_name)).toBeVisible();
      await expect(page.getByText("TEST-DEV-001")).toBeVisible();
    } finally {
      await deleteClient(request, client.id);
    }
  });

  test("un dossier en recouvrement avec solde apparaît dans Recouvrement (UI)", async ({ request, page }) => {
    const client = await createClient(request, {
      stage: "recovery",
      quote_amount: 800_000,
      advance_paid: 300_000, // solde 500k > 0
    });
    try {
      await page.goto("/admin/billing/recovery");
      await expect(page.getByText(client.full_name)).toBeVisible();
    } finally {
      await deleteClient(request, client.id);
    }
  });
});
