import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import type { EventsSearchBarProps } from "@/features/events/types/events";

export default function EventsSearchBar({
  searchTerm,
  onSearchChange,
}: EventsSearchBarProps) {
  return (
    <section className="py-8 mt-20 bg-white border-b">
      <div className="container mx-auto px-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Tìm kiếm sự kiện..."
            value={searchTerm}
            onChange={onSearchChange}
            className="pl-10 pr-4 py-3 rounded-lg border-gray-200 focus:border-orange-500 focus:ring-orange-500 transition"
          />
        </div>
      </div>
    </section>
  );
}

