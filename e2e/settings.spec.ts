import { test, expect } from "@playwright/test";
import { createRole, deleteRole, createUser, deleteUser, sweepTestData } from "./helpers";

test.afterAll(async ({ request }) => {
  await sweepTestData(request);
});

test.describe("Paramètres — rôles & utilisateurs", () => {
  test("créer un rôle et basculer une permission", async ({ request }) => {
    const role = await createRole(request, { can_billing: false });
    try {
      const patch = await request.patch(`/api/admin/roles/${role.id}`, {
        data: { can_billing: true },
      });
      expect(patch.ok()).toBeTruthy();
      const updated = await patch.json();
      expect(updated.can_billing).toBe(true);
    } finally {
      await deleteRole(request, role.id);
    }
  });

  test("créer un utilisateur, changer son rôle, le supprimer", async ({ request }) => {
    const role = await createRole(request);
    const user = await createUser(request, { role_id: role.id });
    try {
      expect(user.id).toBeTruthy();
      // change role to none
      const patch = await request.patch(`/api/admin/users/${user.id}`, { data: { role_id: null } });
      expect(patch.ok()).toBeTruthy();
    } finally {
      await deleteUser(request, user.id);
      await deleteRole(request, role.id);
    }
  });

  test("les pages Utilisateurs et Rôles s'affichent (UI)", async ({ page }) => {
    await page.goto("/admin/settings/users");
    await expect(page.getByText("Utilisateurs", { exact: true }).first()).toBeVisible();
    await page.goto("/admin/settings/roles");
    await expect(page.getByText("Rôles & permissions")).toBeVisible();
  });
});
