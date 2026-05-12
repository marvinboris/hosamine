// Session helpers — Web Crypto only (Edge + Node compatible)
const encoder = new TextEncoder();

function toBase64url(bytes: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(bytes)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

function strToBase64url(str: string): string {
  return btoa(unescape(encodeURIComponent(str)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

function base64urlToStr(b64: string): string {
  return decodeURIComponent(escape(atob(b64.replace(/-/g, "+").replace(/_/g, "/"))));
}

function base64urlToBytes(b64: string): Uint8Array {
  const binary = atob(b64.replace(/-/g, "+").replace(/_/g, "/"));
  return new Uint8Array([...binary].map((c) => c.charCodeAt(0)));
}

async function getKey(): Promise<CryptoKey> {
  const secret =
    process.env.ADMIN_SESSION_SECRET ??
    process.env.ADMIN_PASSWORD ??
    "hosamine2025";
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export interface SessionPayload {
  uid: string;
  role: string;
  name: string;
}

export async function signSession(payload: SessionPayload): Promise<string> {
  const encoded = strToBase64url(JSON.stringify(payload));
  const key = await getKey();
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(encoded));
  return `${encoded}.${toBase64url(sig)}`;
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const dot = token.lastIndexOf(".");
    if (dot === -1) return null;
    const encoded = token.slice(0, dot);
    const sigB64 = token.slice(dot + 1);
    const key = await getKey();
    const sigBytes = base64urlToBytes(sigB64);
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      sigBytes.buffer as ArrayBuffer,
      encoder.encode(encoded)
    );
    if (!valid) return null;
    return JSON.parse(base64urlToStr(encoded)) as SessionPayload;
  } catch {
    return null;
  }
}
