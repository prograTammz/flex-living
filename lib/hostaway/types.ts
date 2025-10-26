import { ReviewCategory } from "@/app/types/review.type";

export type HostawayToken = {
  access_token: string;
  token_type: "Bearer";
  expires_in?: number;
};

export type HostawayQuery = {
  limit?: number;
  offset?: number;
  sortBy?: "id" | "guestName" | "arrivalDate" | "departureDate";
  sortOrder?: "asc" | "desc";
  reservationId?: number;
  type?: "guest-to-host" | "host-to-guest";
  statuses?: (
    | "awaiting"
    | "pending"
    | "scheduled"
    | "submitted"
    | "published"
    | "expired"
  )[];
  departureDateStart?: string;
  departureDateEnd?: string;
};

export type HostawayResponse = {
  status: string;
  result: HostawayReview[];
  count: number;
  offset: number;
};

export type HostawayReview = {
  id: number;
  type: string;
  status: string;
  rating: number | null;
  publicReview: string;
  reviewCategory: ReviewCategory[];
  submittedAt: string;
  channelId: number;
  listingMapId: number;
  departureDate: string;
  arrivalDate: string;
  guestName: string;
  listingName: string;
};

export type SyncCursor = {
  source: string;
  lastDate: string;
  lastId: string;
  updatedAt?: string | null;
};
