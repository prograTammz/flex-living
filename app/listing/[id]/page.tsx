"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import type {
  AggregatedListing,
  Listing,
  Photo,
} from "@/app/types/listing.type";
// Component imports
import ImageGallery from "./components/ImageGallery";
import ListingInfo from "./components/ListingInfo";
import BookingSidebar from "./components/BookingSidebar";

export default function ListingPage() {
  const routeParams = useParams();
  const listingId = parseInt(routeParams.id as string);

  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    // Start loading and clear error only when listingId changes
    setLoading(true);
    setError(null);

    fetch(`/api/listings/${encodeURIComponent(listingId)}`)
      .then(async (res) => {
        if (!res.ok) {
          const json = await res.json().catch(() => ({}));
          throw new Error(json?.error ?? `Failed to fetch listing`);
        }
        return res.json();
      })
      .then((data) => {
        const listing: AggregatedListing = data?.listing ?? data;
        if (!mounted) return;
        setListing(listing);
        setLoading(false);
      })
      .catch((err: Error) => {
        if (!mounted) return;
        setError(err.message);
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [listingId]);

  // If no id is available from either source, show a helpful message
  if (!listingId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8">
          <p className="text-gray-600">Listing ID is missing from the route.</p>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8">
          <p className="text-gray-600">Loading listing…</p>
        </Card>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8">
          <p className="text-gray-600">
            {error ? `Error: ${error}` : "Listing not found"}
          </p>
        </Card>
      </div>
    );
  }

  // Prepare images array for the gallery
  const images = (listing.gallery ?? []).map((p: Photo) => p.url || "");

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "rgb(255, 253, 246)" }}
    >
      <div style={{ paddingTop: "88px" }}></div>

      <main className="flex-grow">
        <div className="container mx-auto max-w-7xl px-3 md:px-4">
          <div className="relative mb-8 md:mb-12">
            {/* Image gallery component */}
            <ImageGallery images={images} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-2">
              {/* Main listing info component */}
              <ListingInfo listing={listing} />
            </div>

            <div className="lg:col-span-1">
              {/* Booking sidebar component */}
              <BookingSidebar />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
