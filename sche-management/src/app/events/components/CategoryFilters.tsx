import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface Category {
  id: string;
  name: string;
}

interface CategoryFiltersProps {
  categories: Category[];
  selectedCategory: string | null;
  categoryIdToCount: Record<string, number>;
  totalCount: number;
  onCategoryFilter: (categoryId: string | null) => void;
}

export default function CategoryFilters({
  categories,
  selectedCategory,
  categoryIdToCount,
  totalCount,
  onCategoryFilter,
}: CategoryFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <motion.div whileHover={{ scale: 1.05 }}>
        <Button
          variant={selectedCategory === null ? "default" : "outline"}
          onClick={() => onCategoryFilter(null)}
        >
          Tất cả ({totalCount})
        </Button>
      </motion.div>

      {categories.map((cat) => (
        <motion.div key={cat.id} whileHover={{ scale: 1.05 }}>
          <Button className="cursor-pointer"
            variant={selectedCategory === cat.id ? "default" : "outline"}
            onClick={() => onCategoryFilter(cat.id)}
          >
            {cat.name} ({categoryIdToCount[cat.id] || 0})
          </Button>
        </motion.div>
      ))}
    </div>
  );
}

