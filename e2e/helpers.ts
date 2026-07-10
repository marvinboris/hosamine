import type { APIRequestContext } from "@playwright/test";

// All test data is prefixed so teardown can find and remove it, even if a
// test crashes mid-way.
export const TEST_PREFIX = "[TEST]";

interface Client {
  id: string;
  full_name: string;
  stage: string;
  [k: string]: unknown;
}

// POST /api/crm/clients only persists a subset of fields; the rest
// (quote_*, advance_paid, next_followup, …) must be set via PATCH.
const POST_FIELDS = new Set([
  "full_name", "location", "sector", "contact_name",
  "contact_phone", "contact_email", "need_summary", "stage",
]);

export async function createClient(
  request: APIRequestContext,
  overrides: Record<string, unknown> = {}
): Promise<Client> {
  const base: Record<string, unknown> = { full_name: `${TEST_PREFIX} Client ${Date.now()}`, sector: "Test", location: "Douala" };
  const extra: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(overrides)) {
    (POST_FIELDS.has(k) ? base : extra)[k] = v;
  }
  const res = await request.post("/api/crm/clients", { data: base });
  if (!res.ok()) throw new Error(`createClient failed: ${res.status()} ${await res.text()}`);
  let client: Client = await res.json();
  if (Object.keys(extra).length > 0) {
    const patch = await request.patch(`/api/crm/clients/${client.id}`, { data: extra });
    if (patch.ok()) client = await patch.json();
  }
  return client;
}

export async function deleteClient(request: APIRequestContext, id: string): Promise<void> {
  await request.delete(`/api/crm/clients/${id}`);
}

export async function createPost(
  request: APIRequestContext,
  overrides: Record<string, unknown> = {}
): Promise<{ id: string }> {
  const res = await request.post("/api/social/posts", {
    data: {
      content_fr: `${TEST_PREFIX} Publication ${Date.now()}`,
      platforms: ["facebook"],
      status: "scheduled",
      scheduled_at: new Date().toISOString(),
      ...overrides,
    },
  });
  if (!res.ok()) throw new Error(`createPost failed: ${res.status()}`);
  return res.json();
}

export async function deletePost(request: APIRequestContext, id: string): Promise<void> {
  await request.delete(`/api/social/posts/${id}`);
}

export async function createRole(
  request: APIRequestContext,
  overrides: Record<string, unknown> = {}
): Promise<{ id: string; name: string }> {
  const res = await request.post("/api/admin/roles", {
    data: { name: `${TEST_PREFIX} role ${Date.now()}`, ...overrides },
  });
  if (!res.ok()) throw new Error(`createRole failed: ${res.status()}`);
  return res.json();
}

export async function deleteRole(request: APIRequestContext, id: string): Promise<void> {
  await request.delete(`/api/admin/roles/${id}`);
}

export async function createUser(
  request: APIRequestContext,
  overrides: Record<string, unknown> = {}
): Promise<{ id: string }> {
  const res = await request.post("/api/admin/users", {
    data: {
      name: `${TEST_PREFIX} User`,
      email: `test_${Date.now()}@hosamine.test`,
      password: "test-pw-123456",
      ...overrides,
    },
  });
  if (!res.ok()) throw new Error(`createUser failed: ${res.status()}`);
  return res.json();
}

export async function deleteUser(request: APIRequestContext, id: string): Promise<void> {
  await request.delete(`/api/admin/users/${id}`);
}

// Sweep any leftover [TEST] records (defensive cleanup).
export async function sweepTestData(request: APIRequestContext): Promise<void> {
  const clients = await (await request.get("/api/crm/clients")).json();
  if (Array.isArray(clients)) {
    for (const c of clients) {
      if (typeof c.full_name === "string" && c.full_name.startsWith(TEST_PREFIX)) {
        await deleteClient(request, c.id);
      }
    }
  }
  const roles = await (await request.get("/api/admin/roles")).json();
  if (Array.isArray(roles)) {
    for (const r of roles) {
      if (typeof r.name === "string" && r.name.startsWith(TEST_PREFIX)) {
        await deleteRole(request, r.id);
      }
    }
  }
  const users = await (await request.get("/api/admin/users")).json();
  if (Array.isArray(users)) {
    for (const u of users) {
      if (typeof u.name === "string" && u.name.startsWith(TEST_PREFIX)) {
        await deleteUser(request, u.id);
      }
    }
  }
}
