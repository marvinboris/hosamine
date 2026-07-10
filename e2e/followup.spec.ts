import { test, expect } from "@playwright/test";
import { createClient, deleteClient, sweepTestData } from "./helpers";

test.afterAll(async ({ request }) => {
  await sweepTestData(request);
});

test.describe("CRM — Suivi J+7", () => {
  test("client en retard apparaît dans Suivi J+7", async ({ request, page }) => {
    const past = new Date();
    past.setDate(past.getDate() - 3);
    const client = await createClient(request, {
      stage: "service",
      next_followup: past.toISOString().slice(0, 10),
    });
    try {
      await page.goto("/admin/crm/followup");
      await expect(page.getByText(client.full_name)).toBeVisible();
    } finally {
      await deleteClient(request, client.id);
    }
  });

  test("« Appelé » reprogramme le rappel à +7 jours", async ({ request }) => {
    const past = new Date();
    past.setDate(past.getDate() - 1);
    const client = await createClient(request, {
      stage: "service",
      next_followup: past.toISOString().slice(0, 10),
    });
    try {
      const next = new Date();
      next.setDate(next.getDate() + 7);
      const res = await request.patch(`/api/crm/clients/${client.id}`, {
        data: { next_followup: next.toISOString().slice(0, 10) },
      });
      expect(res.ok()).toBeTruthy();
      const updated = await res.json();
      expect(updated.next_followup).toBe(next.toISOString().slice(0, 10));
    } finally {
      await deleteClient(request, client.id);
    }
  });
});
