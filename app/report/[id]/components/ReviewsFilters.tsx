import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Channel } from "../../../types/review.type";

export default function ReviewsFilters({
  filterChannel,
  setFilterChannel,
  filterStatus,
  setFilterStatus,
  sortBy,
  setSortBy,
  uniqueChannels,
}: {
  filterChannel: string;
  setFilterChannel: (s: string) => void;
  filterStatus: string;
  setFilterStatus: (s: string) => void;
  sortBy: string;
  setSortBy: (s: string) => void;
  uniqueChannels: string[];
}) {
  const capitalize = (s: string) =>
    s && s.length ? s.charAt(0).toUpperCase() + s.slice(1) : s;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Channel
        </label>
        <Select value={filterChannel} onValueChange={setFilterChannel}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Channels</SelectItem>
            {uniqueChannels.map((channel) => {
              const chStr = String(channel).replace(/\+/g, " ").trim();
              // match "channel 2001" or "Channel2001" etc.
              const channelMatch = chStr.match(/channel[\s\-+]?(\d+)/i);
              const numericFromChannel = channelMatch
                ? channelMatch[1]
                : undefined;
              // numeric if it's just digits
              const numericDirect = /^\d+$/.test(chStr) ? chStr : undefined;
              // try enum key match (case-insensitive)
              const enumMatch = Object.entries(Channel).find(
                ([k, v]) =>
                  isNaN(Number(k)) && k.toLowerCase() === chStr.toLowerCase()
              );
              const numeric =
                numericFromChannel ??
                numericDirect ??
                (enumMatch ? String(enumMatch[1]) : undefined);
              const label = enumMatch
                ? capitalize(enumMatch[0])
                : numeric ?? chStr;
              const value = numeric ?? chStr;
              return (
                <SelectItem key={String(channel)} value={value || "direct"}>
                  {label || "Direct"}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Status
        </label>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="awaiting">Awaiting</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">
          Sort By
        </label>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most Recent</SelectItem>
            <SelectItem value="rating_desc">Highest Rating</SelectItem>
            <SelectItem value="rating_asc">Lowest Rating</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
