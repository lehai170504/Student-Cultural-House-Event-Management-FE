import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import type { EventsSearchBarProps } from "@/features/events/types/events";

export default function EventsSearchBar({
  searchTerm,
  onSearchChange,
  selectedStatus,
  onStatusFilter,
}: EventsSearchBarProps) {
  return (
    <section className="py-8 mt-20 bg-white border-b">
      <div className="container mx-auto px-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
          <Input
            type="text"
            placeholder="Tìm kiếm sự kiện..."
            value={searchTerm}
            onChange={onSearchChange}
            className="pl-10 pr-4 py-3 rounded-lg border-gray-200 focus:border-orange-500 focus:ring-orange-500 transition"
          />
        </div>

        {/* Status Filters */}
        <div className="flex gap-2 mt-4 md:mt-0">
          <Button className="cursor-pointer"
            variant={selectedStatus === null ? "default" : "outline"}
            onClick={() => onStatusFilter(null)}
          >
            Tất cả trạng thái
          </Button>
          <Button className="cursor-pointer"
            variant={selectedStatus === "ACTIVE" ? "default" : "outline"}
            onClick={() => onStatusFilter("ACTIVE")}
          >
            Đang diễn ra
          </Button>
          <Button className="cursor-pointer"
            variant={selectedStatus === "FINISHED" ? "default" : "outline"}
            onClick={() => onStatusFilter("FINISHED")}
          >
            Đã kết thúc
          </Button>
        </div>
      </div>
    </section>
  );
}

