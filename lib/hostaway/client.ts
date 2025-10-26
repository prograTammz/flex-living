import { HostawayQuery } from "./types";

export function buildQuery(q: HostawayQuery): string {
  const sp = new URLSearchParams();

  if (q.limit != null) sp.set("limit", String(q.limit));
  if (q.offset != null) sp.set("offset", String(q.offset));
  if (q.sortBy) sp.set("sortBy", q.sortBy);
  if (q.sortOrder) sp.set("sortOrder", q.sortOrder);
  if (q.reservationId != null) sp.set("reservationId", String(q.reservationId));
  if (q.type) sp.set("type", q.type);
  if (q.statuses?.length) q.statuses.forEach((s) => sp.append("statuses[]", s));
  if (q.departureDateStart) sp.set("departureDateStart", q.departureDateStart);
  if (q.departureDateEnd) sp.set("departureDateEnd", q.departureDateEnd);

  return sp.toString();
}

export async function fetchHostawayReviews(
  accessToken: string,
  q: HostawayQuery
) {
  const base = process.env.HOSTAWAY_BASE_URL ?? "https://api.hostaway.com/v1";
  const qs = buildQuery(q);
  const url = `${base}/reviews${qs ? `?${qs}` : ""}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Hostaway reviews error: ${res.status} ${txt}`);
  }

  return res.json();
}
