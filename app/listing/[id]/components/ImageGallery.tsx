import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  images: string[];
};

export default function ImageGallery({ images }: Props) {
  const [index, setIndex] = useState(0);
  const len = Math.max(images.length, 1);

  const next = () => setIndex((i) => (i + 1) % len);
  const prev = () => setIndex((i) => (i - 1 + len) % len);

  return (
    <>
      {/* Mobile carousel */}
      <div className="md:hidden">
        <div className="relative">
          <div className="relative w-full overflow-hidden rounded-2xl">
            <img
              src={images[index] || "/placeholder.svg"}
              alt={`Listing image ${index + 1}`}
              className="w-full h-auto object-cover"
              style={{ aspectRatio: "4/3" }}
            />
          </div>

          <Button
            onClick={prev}
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 text-black rounded-full shadow-lg"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            onClick={next}
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white hover:bg-gray-100 text-black rounded-full shadow-lg"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          <div className="absolute bottom-3 left-3 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
            {index + 1} / {len}
          </div>
        </div>

        <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
          {images.map((src, i) => (
            <Button
              key={i}
              onClick={() => setIndex(i)}
              variant="outline"
              className={`flex-shrink-0 w-16 h-16 p-0 rounded-lg overflow-hidden border-2 transition-all ${
                i === index ? "border-[#2d5f5f]" : "border-gray-300"
              }`}
            >
              <img
                src={src || "/placeholder.svg"}
                alt={`Thumb ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </Button>
          ))}
        </div>
      </div>

      {/* Desktop grid */}
      <div className="hidden md:grid grid-cols-4 gap-2">
        <div className="col-span-2 row-span-2 rounded-2xl overflow-hidden">
          <img
            src={images[0] || "/placeholder.svg"}
            alt="Main listing image"
            className="w-full h-full object-cover"
          />
        </div>
        {images.slice(1, 5).map((img, i) => (
          <div key={i} className="rounded-2xl overflow-hidden">
            <img
              src={img || "/placeholder.svg"}
              alt={`Listing image ${i + 2}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </>
  );
}
