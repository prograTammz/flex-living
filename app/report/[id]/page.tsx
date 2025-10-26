"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import Header from "./components/Header";
import PerformanceMetrics from "./components/PerformanceMetrics";
import SourceChart from "./components/SourceChart";
import CategoryAverages from "./components/CategoryAverages";
import RecurringIssues from "./components/RecurringIssues";
import ReviewsFilters from "./components/ReviewsFilters";
import ReviewsList from "./components/ReviewsList";
import { Channel } from "../../types/review.type";

function normalizeChannelValue(val?: string | null) {
  if (!val) return "all";
  // decode pluses if any and trim
  const raw = String(val).replace(/\+/g, " ").trim();
  // match "channel 2001" or "Channel2001" etc.
  const m = raw.match(/channel[\s\-+]?(\d+)/i);
  if (m) return m[1];
  // already numeric
  if (/^\d+$/.test(raw)) return raw;
  // try enum key match (case-insensitive)
  const match = Object.entries(Channel).find(
    ([k, v]) => isNaN(Number(k)) && k.toLowerCase() === raw.toLowerCase()
  );
  if (match) return String(match[1]);
  return raw;
}

const COLORS = [
  "#2d5f5f",
  "#4a8f8f",
  "#6ba9a9",
  "#8bc3c3",
  "#abc0c0",
  "#cdd9d9",
];

export default function ManagerDashboard() {
  const params = useParams();
  const propertyId = params?.id;

  const searchParams = useSearchParams();
  const router = useRouter();

  // if propertyId is not available yet, you can show loading/early return

  // New state for API-driven data
  const [listing, setListing] = useState<{ id: string; title: string } | null>(
    null
  );
  const [performance, setPerformance] = useState<any>({
    avgRating: 0,
    totalReviews: 0,
    publishedReviews: 0,
    approvalRate: 0,
    categoryAverages: {},
    recurringIssues: [],
    sourceBreakdown: {},
  });
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // UI state (init from query params if present)
  const [filterChannel, setFilterChannel] = useState<string>(() =>
    normalizeChannelValue(searchParams?.get("channel"))
  );
  // sort values: "recent" | "rating_asc" | "rating_desc"
  const [sortBy, setSortBy] = useState<string>(
    () => searchParams?.get("sort") ?? "recent"
  );
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Keep URL in sync when user changes filters
  useEffect(() => {
    // build search params preserving other params if needed
    const sp = new URLSearchParams();
    const channelForUrl = normalizeChannelValue(filterChannel);
    if (channelForUrl && channelForUrl !== "all")
      sp.set("channel", channelForUrl);
    if (sortBy && sortBy !== "recent") sp.set("sort", sortBy);
    const qs = sp.toString();
    const pathname =
      typeof window !== "undefined" ? window.location.pathname : "/";
    // replace to avoid adding history entries on each change
    router.replace(`${pathname}${qs ? `?${qs}` : ""}`);
  }, [filterChannel, sortBy, router]);

  // Fetch listing performance and reviews from real endpoints
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    async function load() {
      try {
        if (!propertyId) return;

        // Build reviews URL with query params from current filter state so the server can sort/filter
        const reviewsUrlBase = `/api/dashboard/listings/${propertyId}/reviews`;
        const revParams = new URLSearchParams();
        if (filterChannel && filterChannel !== "all") {
          revParams.set("channel", filterChannel);
        }
        if (sortBy && sortBy !== "recent") {
          // sortBy like "rating_asc" or "rating_desc"
          const [field, order] = sortBy.split("_");
          revParams.set("sort", field);
          if (order) revParams.set("order", order);
        }

        const reviewsUrl = revParams.toString()
          ? `${reviewsUrlBase}?${revParams.toString()}`
          : reviewsUrlBase;

        const [perfRes, reviewsRes] = await Promise.all([
          fetch(`/api/dashboard/listings/${propertyId}`),
          fetch(reviewsUrl),
        ]);
        const perfJson = await perfRes.json();
        const reviewsJson = await reviewsRes.json();

        if (!mounted) return;

        setListing(perfJson.listing ?? null);
        // Normalize performance into the shape used by the UI; remove trends mapping
        interface CategoryAverage {
          category: string;
          avgRating: number;
        }

        interface RecurringIssue {
          issue: string;
          mentions: number;
          averageRating: number;
          recentMentions: string[];
        }

        interface PerformanceJson {
          performance?: {
            avgRating?: number;
            totalReviews?: number;
            publishedReviews?: number;
            approvalRate?: number;
          };
          categories?: CategoryAverage[];
          channelBreakdown?: Record<string, number>;
          issues?: Array<{
            category?: string;
            issue?: string;
            mentions?: number;
            avgRating?: number;
            averageRating?: number;
            recentQuotes?: string[];
          }>;
        }

        interface PerformanceState {
          avgRating: number;
          totalReviews: number;
          publishedReviews: number;
          approvalRate: number;
          categoryAverages: Record<string, number>;
          recurringIssues: RecurringIssue[];
          sourceBreakdown: Record<string, number>;
        }

        setPerformance((prev: PerformanceState) => ({
          ...prev,
          avgRating: (perfJson as PerformanceJson).performance?.avgRating ?? 0,
          totalReviews:
            (perfJson as PerformanceJson).performance?.totalReviews ?? 0,
          publishedReviews:
            (perfJson as PerformanceJson).performance?.publishedReviews ?? 0,
          approvalRate:
            ((perfJson as PerformanceJson).performance?.approvalRate ?? 0) *
            100,
          categoryAverages: (
            (perfJson as PerformanceJson).categories ?? []
          ).reduce((acc: Record<string, number>, c: CategoryAverage) => {
            acc[c.category] = c.avgRating;
            return acc;
          }, {}),
          // no trends property anymore
          sourceBreakdown: (perfJson as PerformanceJson).channelBreakdown ?? {},
          recurringIssues:
            ((perfJson as PerformanceJson).issues ?? []).map(
              (iss): RecurringIssue => ({
                issue: iss.category ?? iss.issue ?? "unknown",
                mentions: iss.mentions ?? 0,
                averageRating: iss.avgRating ?? iss.averageRating ?? 0,
                recentMentions: iss.recentQuotes ?? [],
              })
            ) ?? [],
        }));

        const items = reviewsJson.items ?? [];
        const mapped = items.map((r: any) => ({
          id: r.id,
          reviewerName: r.reviewerName,
          message: r.message,
          rating: r.rating,
          isPublic: !!r.isPublic,
          channel: r.channel,
          categories: r.reviewCategory ?? [],
          submittedAt: r.submittedAt,
          status: r.status ?? (r.isPublic ? "published" : "awaiting"),
        }));
        setReviews(mapped);
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
    // re-fetch when property or filters change
  }, [propertyId, filterChannel, sortBy]);

  // Auto-fill channels dropdown from server-provided sourceBreakdown if available
  const uniqueChannels = useMemo(() => {
    const fromPerf = Object.keys(performance.sourceBreakdown || {}).filter(
      Boolean
    );
    if (fromPerf.length > 0) return fromPerf;
    return Array.from(new Set(reviews.map((r) => r.channel).filter(Boolean)));
  }, [performance.sourceBreakdown, reviews]);

  // Filter and sort reviews (client-side fallback)
  const filteredReviews = useMemo(() => {
    let filtered = [...reviews];

    if (filterChannel !== "all") {
      filtered = filtered.filter((r) => String(r.channel) === filterChannel);
    }

    if (filterStatus !== "all") {
      filtered = filtered.filter((r) => r.status === filterStatus);
    }

    // Sort client-side when API didn't handle it (or as an additional guarantee)
    if (sortBy === "recent") {
      filtered.sort(
        (a, b) =>
          new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
      );
    } else if (sortBy === "rating_asc") {
      filtered.sort((a, b) => (a.rating || 0) - (b.rating || 0));
    } else if (sortBy === "rating_desc") {
      filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return filtered;
  }, [reviews, filterChannel, filterStatus, sortBy]);

  const renderStars = (rating: number) => {
    const five = Math.max(0, Math.min(5, rating ?? 0));
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`h-4 w-4 ${
              star <= Math.round(five)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          >
            {/* using unicode star for simplicity */}★
          </span>
        ))}
      </div>
    );
  };

  // Convert sourceBreakdown map to recharts data
  const sourceData = Object.entries(performance.sourceBreakdown || {}).map(
    ([name, value]) => ({
      name,
      value,
    })
  );

  // Toggle visibility handler
  async function toggleVisibility(reviewId: number, nextVal: boolean) {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, isPublic: nextVal } : r))
    );
    try {
      const res = await fetch(`/api/reviews/${reviewId}/visibility`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublic: nextVal }),
      });
      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json?.error || "Failed to update visibility");
      }
    } catch (err) {
      console.error("Visibility update failed", err);
      setReviews((prev) =>
        prev.map((r) => (r.id === reviewId ? { ...r, isPublic: !nextVal } : r))
      );
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8">
          <p className="text-gray-600">Loading...</p>
        </Card>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8">
          <p className="text-gray-600">Property not found</p>
        </Card>
      </div>
    );
  }

  if (!propertyId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8">
          <p className="text-gray-600">Property id missing</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <Header listing={listing} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <PerformanceMetrics
            performance={performance}
            renderStars={renderStars}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <SourceChart sourceData={sourceData} COLORS={COLORS} />
          <CategoryAverages categoryAverages={performance.categoryAverages} />
        </div>

        {performance.recurringIssues.length > 0 && (
          <RecurringIssues
            issues={performance.recurringIssues}
            renderStars={renderStars}
          />
        )}

        <Card className="p-6 bg-white">
          <h3 className="font-bold text-lg mb-6">Reviews Management</h3>

          <ReviewsFilters
            filterChannel={filterChannel}
            setFilterChannel={setFilterChannel}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            sortBy={sortBy}
            setSortBy={setSortBy}
            uniqueChannels={uniqueChannels}
          />

          <ReviewsList
            reviews={filteredReviews}
            toggleVisibility={toggleVisibility}
            renderStars={renderStars}
          />
        </Card>
      </div>
    </div>
  );
}
