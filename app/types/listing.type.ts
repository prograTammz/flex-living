import { CoreReview } from "./review.type";

export type Listing = {
  //core
  id: number;
  title: string;
  heroPhoto: string;
  gallery: Photo[];
  //status
  isActive: boolean;
  //info
  beds: number;
  bathrooms: number;
  guests: number;
  description: string;
  //location
  lat: number;
  lng: number;
  //integrations
  googlePlaceId: string;
  hostwayListingId: string;
  //metaData
  createdAt: string;
  updatedAt: string;
};

export type AggregatedListing = Listing & {
  reviews: CoreReview[];
  reviewsCount: number;
  avgRating: number | null;
  approvedReviews: number;
  approvalRate: number | null;
};

export type Photo = {
  imageId: number;
  url: string;
};
