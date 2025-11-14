"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, Filter } from "lucide-react";
import type { RewardCategory } from "../types";
import { CATEGORY_LABEL } from "../types";

interface GiftsSearchFilterProps {
  query: string;
  onQueryChange: (query: string) => void;
  sortBy: "pointsAsc" | "pointsDesc" | "newest";
  onSortChange: (sortBy: "pointsAsc" | "pointsDesc" | "newest") => void;
  pointsFilter: "all" | "0-100" | "100-500" | "500-1000" | "1000+";
  onPointsFilterChange: (filter: "all" | "0-100" | "100-500" | "500-1000" | "1000+") => void;
  selectedCategories: Record<RewardCategory, boolean>;
  onCategoryToggle: (key: RewardCategory, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  isAllSelected: boolean;
}

export default function GiftsSearchFilter({
  query,
  onQueryChange,
  sortBy,
  onSortChange,
  pointsFilter,
  onPointsFilterChange,
  selectedCategories,
  onCategoryToggle,
  onSelectAll,
  isAllSelected,
}: GiftsSearchFilterProps) {
  return (
    <section className="py-6 mt-25 bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* Search */}
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                value={query}
                onChange={(e) => onQueryChange(e.target.value)}
                placeholder="Tìm theo tên quà..."
                className="pl-10 pr-4 py-3 rounded-lg border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                suppressHydrationWarning
              />
            </div>
          </div>

          {/* Sort & Filter */}
          <div className="flex items-center justify-between md:justify-end gap-2 flex-wrap">
            <Select value={sortBy} onValueChange={(v) => onSortChange(v as any)}>
              <SelectTrigger
                className="w-full sm:w-[190px]"
                suppressHydrationWarning
              >
                <SelectValue placeholder="Sắp xếp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pointsAsc">Ít điểm → Nhiều điểm</SelectItem>
                <SelectItem value="pointsDesc">Nhiều điểm → Ít điểm</SelectItem>
                <SelectItem value="newest">Mới nhất</SelectItem>
              </SelectContent>
            </Select>

            <Select value={pointsFilter} onValueChange={(v) => onPointsFilterChange(v as any)}>
              <SelectTrigger
                className="w-full sm:w-[190px]"
                suppressHydrationWarning
              >
                <SelectValue placeholder="Khoảng điểm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả điểm</SelectItem>
                <SelectItem value="0-100">0 - 100 điểm</SelectItem>
                <SelectItem value="100-500">100 - 500 điểm</SelectItem>
                <SelectItem value="500-1000">500 - 1000 điểm</SelectItem>
                <SelectItem value="1000+">Trên 1000 điểm</SelectItem>
              </SelectContent>
            </Select>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 w-full sm:w-auto">
                  <Filter className="h-4 w-4" />Bộ lọc
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuCheckboxItem
                  checked={isAllSelected}
                  onCheckedChange={onSelectAll}
                >
                  Tất cả
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={selectedCategories.voucher}
                  onCheckedChange={(c) => onCategoryToggle("voucher", Boolean(c))}
                >
                  {CATEGORY_LABEL.voucher}
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={selectedCategories.gift}
                  onCheckedChange={(c) => onCategoryToggle("gift", Boolean(c))}
                >
                  {CATEGORY_LABEL.gift}
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </section>
  );
}

