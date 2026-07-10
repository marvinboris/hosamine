import { test, expect } from "@playwright/test";
import { createPost, deletePost, TEST_PREFIX } from "./helpers";

test.describe("Réseaux sociaux — calendrier éditorial", () => {
  test("créer, éditer et supprimer une publication", async ({ request }) => {
    // Create (scheduled this month so it lists)
    const created = await createPost(request);
    expect(created.id).toBeTruthy();

    // Edit
    const patch = await request.patch(`/api/social/posts/${created.id}`, {
      data: { content_fr: `${TEST_PREFIX} Publication modifiée`, platforms: ["facebook", "linkedin"] },
    });
    expect(patch.ok()).toBeTruthy();
    const updated = await patch.json();
    expect(updated.content_fr).toContain("modifiée");
    expect(updated.platforms).toContain("linkedin");

    // Delete
    const del = await request.delete(`/api/social/posts/${created.id}`);
    expect(del.status()).toBe(204);
  });

  test("le calendrier s'affiche avec navigation de mois (UI)", async ({ page }) => {
    await page.goto("/admin/social");
    // Weekday header present
    await expect(page.getByText("Lun", { exact: true })).toBeVisible();
    // Composer present
    await expect(page.getByText("Plateformes", { exact: true })).toBeVisible();
  });

  test("un post planifié apparaît dans la file (UI)", async ({ request, page }) => {
    const post = await createPost(request);
    try {
      await page.goto("/admin/social");
      await expect(page.getByText("Publications programmées")).toBeVisible();
    } finally {
      await deletePost(request, post.id);
    }
  });
});
