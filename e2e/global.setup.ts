import { test as setup, expect } from "@playwright/test";
import { mkdirSync } from "node:fs";

const STORAGE = "e2e/.auth/admin.json";
const EMAIL = process.env.E2E_ADMIN_EMAIL ?? "admin@hosamine.net";
const PASSWORD = process.env.E2E_ADMIN_PASSWORD ?? "hosamine2025";

// Authenticate once via the API and persist the session cookie for reuse.
setup("authenticate", async ({ request }) => {
  mkdirSync("e2e/.auth", { recursive: true });
  const res = await request.post("/api/admin/auth", {
    data: { email: EMAIL, password: PASSWORD },
  });
  expect(res.ok(), `login failed (${res.status()})`).toBeTruthy();
  await request.storageState({ path: STORAGE });
});
