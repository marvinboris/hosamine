import { test, expect } from "@playwright/test";
import { createClient, deleteClient, sweepTestData } from "./helpers";

test.afterAll(async ({ request }) => {
  await sweepTestData(request);
});

test.describe("CRM — fiche client", () => {
  test("créer un client crée aussi documents + historique", async ({ request }) => {
    const client = await createClient(request);
    try {
      const detail = await (await request.get(`/api/crm/clients/${client.id}`)).json();
      expect(detail.client.full_name).toBe(client.full_name);
      expect(detail.documents.length).toBe(3); // pv, bordereau, attestation
      expect(detail.history.length).toBeGreaterThanOrEqual(1); // "Client créé"
    } finally {
      await deleteClient(request, client.id);
    }
  });

  test("le client apparaît dans la liste (UI)", async ({ request, page }) => {
    const client = await createClient(request);
    try {
      await page.goto("/admin/crm");
      await expect(page.getByText(client.full_name)).toBeVisible();
    } finally {
      await deleteClient(request, client.id);
    }
  });

  test("éditer un champ", async ({ request }) => {
    const client = await createClient(request);
    try {
      const res = await request.patch(`/api/crm/clients/${client.id}`, {
        data: { contact_phone: "+237 600 000 000" },
      });
      expect(res.ok()).toBeTruthy();
      const updated = await res.json();
      expect(updated.contact_phone).toBe("+237 600 000 000");
    } finally {
      await deleteClient(request, client.id);
    }
  });

  test("ajouter une note d'historique", async ({ request }) => {
    const client = await createClient(request);
    try {
      const res = await request.post(`/api/crm/clients/${client.id}/history`, {
        data: { action: "Note ajoutée", note: "Appel de suivi", amount: 50000 },
      });
      expect(res.status()).toBe(201);
      const detail = await (await request.get(`/api/crm/clients/${client.id}`)).json();
      expect(detail.history.some((h: { note: string }) => h.note === "Appel de suivi")).toBeTruthy();
    } finally {
      await deleteClient(request, client.id);
    }
  });

  test("avancer d'étape journalise l'historique", async ({ request }) => {
    const client = await createClient(request, { stage: "new" });
    try {
      const res = await request.patch(`/api/crm/clients/${client.id}`, {
        data: { stage: "diagnostic", _prev_stage: "new" },
      });
      expect(res.ok()).toBeTruthy();
      expect((await res.json()).stage).toBe("diagnostic");
      const detail = await (await request.get(`/api/crm/clients/${client.id}`)).json();
      expect(detail.history.some((h: { action: string }) => h.action.includes("Étape"))).toBeTruthy();
    } finally {
      await deleteClient(request, client.id);
    }
  });

  test("marquer un document signé", async ({ request }) => {
    const client = await createClient(request);
    try {
      const detail = await (await request.get(`/api/crm/clients/${client.id}`)).json();
      const doc = detail.documents[0];
      const res = await request.patch(`/api/crm/documents/${doc.id}`, {
        data: { status: "signed", signed_at: new Date().toISOString() },
      });
      expect(res.ok()).toBeTruthy();
      expect((await res.json()).status).toBe("signed");
    } finally {
      await deleteClient(request, client.id);
    }
  });

  test("supprimer un client (cascade documents/historique)", async ({ request }) => {
    const client = await createClient(request);
    const del = await request.delete(`/api/crm/clients/${client.id}`);
    expect(del.status()).toBe(204);
    const after = await request.get(`/api/crm/clients/${client.id}`);
    expect(after.status()).toBe(404);
  });
});
