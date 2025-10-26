import fs from "node:fs/promises";
import path from "node:path";

import { getAccessToken } from "./auth";
import { normalizeReview } from "./normalize";
import { HostawayQuery, HostawayResponse, HostawayReview } from "./types";
import { fetchHostawayReviews } from "./client";
import { Review } from "@/app/types/review.type";

async function loadFallback(): Promise<HostawayReview[]> {
  const base = path.join(process.cwd(), "public", "jsons");
  const files = ["hostaway-mock-1.filled.json", "hostaway-mock-2.filled.json"];
  const payloads = await Promise.all(
    files.map(async (f) => {
      const raw = await fs.readFile(path.join(base, f), "utf-8");
      return JSON.parse(raw);
    })
  );
  // concat results fields if present
  const all = payloads.flatMap((p) =>
    Array.isArray(p?.result) ? p.result : []
  );
  return all;
}

export const retrieveReviews = async (): Promise<Review[]> => {
  const query: HostawayQuery = {
    statuses: ["published"],
    type: "guest-to-host",
    sortBy: "departureDate",
    sortOrder: "asc",
  };

  const token = await getAccessToken();

  const raw = (await fetchHostawayReviews(token, query)) as HostawayResponse;
  const hostawayResults = Array.isArray(raw?.result) ? raw.result : [];

  const result = hostawayResults.length
    ? hostawayResults
    : await loadFallback();

  return result.map(normalizeReview);
};
