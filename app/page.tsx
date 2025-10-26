"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Star, TrendingUp, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type SortField = "title" | "avgRating" | "reviewsCount" | "approvalRate";
type SortOrder = "asc" | "desc";

const SortIcon = ({
  sortOrder,
  sortField,
  field,
}: {
  sortOrder: SortOrder;
  sortField: SortField;
  field: SortField;
}) => {
  if (sortField !== field) return <div className="w-4 h-4" />;
  return sortOrder === "asc" ? (
    <ChevronUp className="w-4 h-4" />
  ) : (
    <ChevronDown className="w-4 h-4" />
  );
};

// Add Listing type and state for fetched data
interface Listing {
  id: string | number;
  title: string;
  guests: number;
  beds: number;
  bathrooms: number;
  avgRating: number;
  reviewsCount: number;
  approvalRate: number; // normalized as fraction (0..1) or percent (>1)
  approvedReviews?: number;
}

export default function ListingsPage() {
  const [sortField, setSortField] = useState<SortField>("title");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  // new state for fetched listings
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // helper: format approval rate as percentage string
  const formatApprovalRate = (rate: number) => {
    const r = Number.isFinite(rate) ? rate : 0;
    const percent = r <= 1 ? r * 100 : r;
    return percent.toFixed(0);
  };

  // Fetch listings from API on mount
  useEffect(() => {
    const ac = new AbortController();

    const fetchListings = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/dashboard/report", {
          signal: ac.signal,
        });
        if (!res.ok) {
          throw new Error(`Failed to fetch: ${res.status}`);
        }
        const payload = await res.json();

        // accept either array or { listings: [...] }
        const rawItems = Array.isArray(payload)
          ? payload
          : payload?.listings ?? [];

        // normalize fields and provide safe defaults
        const normalized: Listing[] = rawItems.map((it: any) => ({
          id: it.id ?? it.listingId ?? Math.random(),
          title: it.title ?? "Untitled listing",
          guests: Number.isFinite(it.guests) ? Number(it.guests) : 1,
          beds: Number.isFinite(it.beds) ? Number(it.beds) : 0,
          bathrooms: Number.isFinite(it.bathrooms) ? Number(it.bathrooms) : 0,
          avgRating: Number.isFinite(it.avgRating) ? Number(it.avgRating) : 0,
          reviewsCount: Number.isFinite(it.reviewsCount)
            ? Number(it.reviewsCount)
            : 0,
          approvalRate: Number.isFinite(it.approvalRate)
            ? Number(it.approvalRate)
            : 0,
          approvedReviews: Number.isFinite(it.approvedReviews)
            ? Number(it.approvedReviews)
            : 0,
        }));

        setListings(normalized);
      } catch (err: any) {
        if (err.name === "AbortError") return;
        setError(err.message || "Failed to load listings");
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
    return () => ac.abort();
  }, []);

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3 w-3 ${
              star <= Math.round(rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  // use fetched listings for sorting (replaces previous listingsData usage)
  const sortedListings = [...listings].sort((a, b) => {
    let compareValue = 0;

    switch (sortField) {
      case "title":
        compareValue = a.title.localeCompare(b.title);
        break;
      case "avgRating":
        compareValue = a.avgRating - b.avgRating;
        break;
      case "reviewsCount":
        compareValue = a.reviewsCount - b.reviewsCount;
        break;
      case "approvalRate":
        compareValue = a.approvalRate - b.approvalRate;
        break;
    }

    return sortOrder === "asc" ? compareValue : -compareValue;
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Listings Dashboard
          </h1>
          <p className="text-gray-600">
            Manage and monitor your listing properties
          </p>
        </div>

        {/* Table or status messages */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
            <div className="p-8 text-center text-gray-600">
              Loading listings...
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-600">Error: {error}</div>
          ) : sortedListings.length === 0 ? (
            <div className="p-8 text-center text-gray-600">
              No listings found.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 border-b">
                  <TableHead>
                    <button
                      onClick={() => handleSort("title")}
                      className="flex items-center gap-2 font-semibold text-gray-900 hover:text-gray-700"
                    >
                      Listing Name
                      <SortIcon
                        sortField={sortField}
                        sortOrder={sortOrder}
                        field="title"
                      />
                    </button>
                  </TableHead>
                  <TableHead className="text-center">Guests</TableHead>
                  <TableHead className="text-center">Beds</TableHead>
                  <TableHead className="text-center">Baths</TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort("avgRating")}
                      className="flex items-center gap-2 font-semibold text-gray-900 hover:text-gray-700"
                    >
                      Rating
                      <SortIcon
                        sortField={sortField}
                        sortOrder={sortOrder}
                        field="avgRating"
                      />
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort("reviewsCount")}
                      className="flex items-center gap-2 font-semibold text-gray-900 hover:text-gray-700"
                    >
                      Reviews
                      <SortIcon
                        sortField={sortField}
                        sortOrder={sortOrder}
                        field="reviewsCount"
                      />
                    </button>
                  </TableHead>
                  <TableHead>
                    <button
                      onClick={() => handleSort("approvalRate")}
                      className="flex items-center gap-2 font-semibold text-gray-900 hover:text-gray-700"
                    >
                      Approval
                      <SortIcon
                        sortField={sortField}
                        sortOrder={sortOrder}
                        field="approvalRate"
                      />
                    </button>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedListings.map((listing) => {
                  const avg = Number.isFinite(listing.avgRating)
                    ? listing.avgRating
                    : 0;
                  const approvalPct = formatApprovalRate(listing.approvalRate);
                  return (
                    <TableRow
                      key={listing.id}
                      className="hover:bg-gray-50 border-b"
                    >
                      <TableCell className="font-semibold text-gray-900">
                        {listing.title}
                      </TableCell>
                      <TableCell className="text-center text-gray-600">
                        {listing.guests}
                      </TableCell>
                      <TableCell className="text-center text-gray-600">
                        {listing.beds}
                      </TableCell>
                      <TableCell className="text-center text-gray-600">
                        {listing.bathrooms}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {renderStars(avg)}
                          <span className="font-semibold text-gray-900">
                            {avg.toFixed(1)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-gray-900">
                        {listing.reviewsCount}
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-green-600">
                          {approvalPct}%
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex gap-2 justify-end">
                          <Link href={`/report/${String(listing.id)}`}>
                            <Button
                              size="sm"
                              className="bg-teal-600 hover:bg-teal-700 text-white"
                            >
                              <TrendingUp className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href={`/listing/${String(listing.id)}`}>
                            <Button size="sm" variant="outline">
                              View
                            </Button>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </div>
  );
}
