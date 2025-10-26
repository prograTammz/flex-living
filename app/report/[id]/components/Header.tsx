import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header({
  listing,
}: {
  listing: { id: string; title: string };
}) {
  return (
    <div className="mb-8">
      <Link href="/">
        <Button variant="ghost" className="mb-4">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Properties
        </Button>
      </Link>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>
      <p className="text-gray-600">ID: {listing.id}</p>
    </div>
  );
}
