import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Calendar, Users, CheckCircle2, Send } from "lucide-react";

export default function BookingSidebar() {
  const [guests, setGuests] = useState("1");

  return (
    <Card
      className="sticky top-24 p-6 rounded-lg shadow-lg"
      style={{ backgroundColor: "#2d5f5f" }}
    >
      <h3 className="text-white text-lg font-bold mb-2">Book Your Stay</h3>
      <p className="text-gray-200 text-sm mb-6">Select dates to see prices</p>

      <div className="mb-4">
        <Button className="w-full bg-white text-gray-700 hover:bg-gray-100 mb-3 flex items-center justify-center gap-2">
          <Calendar className="h-4 w-4" />
          Select dates
        </Button>
      </div>

      <div className="mb-6">
        <div className="flex items-center gap-2 text-white text-sm mb-2">
          <Users className="h-4 w-4" />
          <span>Guests</span>
        </div>
        <Select value={guests} onValueChange={setGuests}>
          <SelectTrigger className="w-full bg-white text-gray-700 border-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <SelectItem key={num} value={String(num)}>
                {num} {num === 1 ? "Guest" : "Guests"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white mb-3 flex items-center justify-center gap-2">
        <CheckCircle2 className="h-4 w-4" />
        Check availability
      </Button>

      <Button className="w-full bg-white text-gray-700 hover:bg-gray-100 mb-3 flex items-center justify-center gap-2">
        <Send className="h-4 w-4" />
        Send inquiry
      </Button>

      <div className="flex items-center justify-center gap-2 text-white text-sm">
        <CheckCircle2 className="h-4 w-4" />
        <span>Instant booking confirmation</span>
      </div>
    </Card>
  );
}
