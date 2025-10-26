export enum Channel {
  airbnbOfficial = 2018,
  homeaway = 2002,
  bookingcom = 2005,
  expedia = 2007,
  homeawayical = 2009,
  vrboical = 2010,
  direct = 2000,
  bookingengine = 2013,
  customIcal = 2015,
  tripadvisorical = 2016,
  wordpress = 2017,
  marriott = 2019,
  partner = 2020,
  gds = 2021,
  google = 2022,
}

export type CoreReview = {
  id?: number;
  rating: number;
  message: string;
  reviewerName: string;
};

export type Review = CoreReview & {
  //core
  listingId?: number;
  reviewCategory: ReviewCategory[];
  //info
  channel: Channel;
  type: "host-to-guest" | "guest-to-host";
  source: "hostaway" | "google";
  sourceId?: string;
  //status
  isPublic: boolean;
  status:
    | "awaiting"
    | "pending"
    | "submitted"
    | "published"
    | "scheduled"
    | "expired";

  //metadata
  createdAt: string;
  submittedAt: string;
};

export type ReviewCategory = {
  category: string;
  rating: number;
};

// New: describe query params used when requesting reviews (channel + sort/order)
export type ReviewsQuery = {
  channel?: string | Channel;
  // sort field: "recent" or "rating"
  sort?: "recent" | "rating";
  // order only applicable when sort === "rating"
  order?: "asc" | "desc";
};
