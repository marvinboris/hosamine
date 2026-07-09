import { createServiceClient } from "@/lib/supabase/server";

type Messages = Record<string, Record<string, unknown>>;

/**
 * Fetch CMS overrides from content_blocks and deep-merge them over the
 * next-intl JSON messages (DB wins per section/key). Falls back silently to
 * the JSON messages if Supabase is unavailable (e.g. placeholder credentials).
 */
export async function mergeContentOverrides(
  messages: Messages,
  locale: string
): Promise<Messages> {
  try {
    const db = createServiceClient();
    const { data } = await db.from("content_blocks").select("section, key, fr, en");
    if (!data || data.length === 0) return messages;

    const merged: Messages = { ...messages };
    for (const row of data as Array<{ section: string; key: string; fr: string | null; en: string | null }>) {
      const value = locale === "en" ? row.en : row.fr;
      if (value == null) continue;
      merged[row.section] = { ...(merged[row.section] ?? {}), [row.key]: value };
    }
    return merged;
  } catch {
    return messages;
  }
}
