import { Card } from "@/components/ui/card";
import {
  Users,
  Bed,
  Bath,
  Clock,
  Tv,
  Wifi,
  UtensilsCrossed,
  Waves,
  Wind,
  MapPin,
  Cigarette,
  PawPrint,
  Music,
  Lock,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AggregatedListing } from "@/app/types/listing.type";

const renderStars = (rating: number) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${
            star <= Math.round(rating)
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

export default function ListingInfo({
  listing,
}: {
  listing: AggregatedListing;
}) {
  return (
    <>
      <h1 className="text-2xl md:text-3xl font-bold mb-4">{listing.title}</h1>

      <div className="flex flex-wrap gap-6 mb-8 text-sm md:text-base">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-[#5C5C5A]" />
          <span>{listing.guests ?? 1} Guests</span>
        </div>
        <div className="flex items-center gap-2">
          <Bed className="h-5 w-5 text-[#5C5C5A]" />
          <span>{listing.beds ?? listing.beds ?? 1} Bedrooms</span>
        </div>
        <div className="flex items-center gap-2">
          <Bath className="h-5 w-5 text-[#5C5C5A]" />
          <span>{listing.bathrooms ?? 1} Bathrooms</span>
        </div>
        <div className="flex items-center gap-2">
          <Bed className="h-5 w-5 text-[#5C5C5A]" />
          <span>{listing.beds ?? 1} beds</span>
        </div>
      </div>

      <Card className="mb-8 p-6 bg-white">
        <h2 className="text-xl font-bold mb-3">About this listing</h2>
        <p className="text-gray-700 leading-relaxed">
          {listing.description}
          <Button variant="link" className="text-blue-600 p-0 h-auto ml-1">
            Read more
          </Button>
        </p>
      </Card>

      <Card className="mb-8 p-6 bg-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Amenities</h2>
          <Button variant="link" className="text-blue-600 p-0 h-auto">
            View all amenities →
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { icon: Tv, label: "Cable TV" },
            { icon: Wifi, label: "Internet" },
            { icon: Wifi, label: "Wireless" },
            { icon: UtensilsCrossed, label: "Kitchen" },
            { icon: Waves, label: "Washing Machine" },
            { icon: Wind, label: "Elevator" },
          ].map((amenity, index) => {
            const Icon = amenity.icon;
            return (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
              >
                <Icon className="h-5 w-5 text-[#5C5C5A]" />
                <span className="text-sm">{amenity.label}</span>
              </div>
            );
          })}
        </div>
      </Card>

      <Card className="p-6 bg-white mb-8">
        <h2 className="text-xl font-bold mb-6">Stay Policies</h2>

        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-bold mb-4 flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Check-in & Check-out
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Check-in Time</p>
              <p className="font-bold text-lg">3:00 PM</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Check-out Time</p>
              <p className="font-bold text-lg">10:00 AM</p>
            </div>
          </div>
        </div>

        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-bold mb-4">House Rules</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Cigarette className="h-5 w-5 text-[#5C5C5A]" />
              <span className="text-sm">No smoking</span>
            </div>
            <div className="flex items-center gap-2">
              <PawPrint className="h-5 w-5 text-[#5C5C5A]" />
              <span className="text-sm">No pets</span>
            </div>
            <div className="flex items-center gap-2">
              <Music className="h-5 w-5 text-[#5C5C5A]" />
              <span className="text-sm">No parties or events</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-[#5C5C5A]" />
              <span className="text-sm">Security deposit required</span>
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg">
          <h3 className="font-bold mb-4">Cancellation Policy</h3>
          <div className="space-y-4">
            <div>
              <p className="font-semibold mb-2">For stays less than 28 days</p>
              <ul className="text-sm text-gray-700 space-y-1 ml-4">
                <li>• Full refund up to 14 days before check-in</li>
                <li>
                  • No refund for bookings less than 14 days before check-in
                </li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-2">For stays of 28 days or more</p>
              <ul className="text-sm text-gray-700 space-y-1 ml-4">
                <li>• Full refund up to 30 days before check-in</li>
                <li>
                  • No refund for bookings less than 30 days before check-in
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Card>

      <Card className="mt-8 p-6 bg-white mb-8">
        <div className="flex items-center gap-2 mb-4">
          <MapPin className="h-5 w-5 text-[#5C5C5A]" />
          <h2 className="text-xl font-bold">Location</h2>
        </div>
        <div className="w-full h-80 bg-gray-200 rounded-lg mb-4 flex items-center justify-center">
          <p className="text-gray-500">Map placeholder</p>
        </div>
      </Card>

      <Card className="p-6 bg-white">
        <h2 className="text-xl font-bold mb-6">Reviews</h2>
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Overall Rating</p>
              <div className="flex items-center gap-3 mt-2">
                {renderStars(listing.avgRating ?? 0)}
                <span className="text-2xl font-bold text-gray-900">
                  {(listing.avgRating ?? 0).toFixed(1)}/5
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Total Reviews</p>
              <p className="text-2xl font-bold text-gray-900">
                {listing.reviewsCount}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {listing.reviews.map((review) => (
            <div key={review.id} className="pb-6 border-b last:border-b-0">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-semibold text-gray-900">
                    {review.reviewerName}
                  </p>
                </div>
              </div>
              <div className="mb-3">{renderStars(review.rating)}</div>
              <p className="text-gray-700">{review.message}</p>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}
