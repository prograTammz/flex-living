import { HostawayToken } from "./types";

let cachedToken: { value: HostawayToken; expiresAt: number } | null = null;

export async function getAccessToken(): Promise<string> {
  // reuse in-memory token until it expires (best-effort)
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.value.access_token;
  }

  const base = process.env.HOSTAWAY_BASE_URL ?? "https://api.hostaway.com/v1";
  const res = await fetch(`${base}/accessTokens`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    // Required body: grant_type, client_id, client_secret, scope
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: String(process.env.CLIENT_ID_HOSTAWAY ?? ""),
      client_secret: String(process.env.CLIENT_SECRET_HOSTAWAY ?? ""),
      scope: "general",
    }).toString(),
    // Make sure we don't accidentally cache auth responses at the edge
    cache: "no-store",
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Hostaway token error: ${res.status} ${txt}`);
  }

  const json = (await res.json()) as HostawayToken;
  const ttlMs = (json.expires_in ?? 300) * 1000; // default 5 min if missing
  cachedToken = { value: json, expiresAt: Date.now() + ttlMs - 10_000 }; // 10s skew

  return json.access_token;
}
