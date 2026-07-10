import { defineConfig, devices } from "@playwright/test";

// E2E functional tests for the Hosamine admin. Run locally against the dev
// server (which loads .env.local, unlike `next start`). Tests mutate the live
// Supabase DB but clean up their own [TEST]-prefixed data.
const BASE_URL = process.env.E2E_BASE_URL ?? "http://localhost:3000";
const STORAGE = "e2e/.auth/admin.json";

export default defineConfig({
  testDir: "e2e",
  fullyParallel: false, // shared DB → avoid cross-test interference
  workers: 1,
  retries: 0,
  reporter: [["list"]],
  timeout: 30_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL: BASE_URL,
    trace: "on-first-retry",
  },
  projects: [
    { name: "setup", testMatch: /global\.setup\.ts/ },
    {
      name: "guest",
      testMatch: /auth\.spec\.ts/,
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "authenticated",
      testIgnore: /auth\.spec\.ts/,
      dependencies: ["setup"],
      use: { ...devices["Desktop Chrome"], storageState: STORAGE },
    },
  ],
  webServer: {
    // This project's Next build does not auto-load .env.local at runtime,
    // so source it explicitly before starting the dev server.
    command: "sh -c 'set -a && [ -f .env.local ] && . ./.env.local; set +a; exec npm run dev'",
    url: BASE_URL,
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
