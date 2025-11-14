import type { Product } from "@/features/products/types/product";
import type { Reward, RewardCategory } from "./types";

// Map Product type to RewardCategory
export const mapProductTypeToCategory = (type: string): RewardCategory => {
  switch (type) {
    case "VOUCHER":
      return "voucher";
    case "GIFT":
      return "gift";
    default:
      return "gift"; // Default to gift for unknown types
  }
};

export const normalizeProductImage = (imageUrl?: string | null) => {
  if (!imageUrl) return null;
  const trimmed = imageUrl.trim();
  if (
    !trimmed ||
    trimmed.toLowerCase() === "string" ||
    trimmed.toLowerCase().startsWith("http://localhost:3000/string")
  ) {
    return null;
  }
  return trimmed;
};

// Convert Product to Reward
export const convertProductToReward = (product: Product): Reward => {
  const normalizedImage = normalizeProductImage(product.imageUrl);
  const defaultImageSvg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23f1f5f9"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%2394a3b8" font-family="Arial, sans-serif" font-size="24">No Image</text></svg>';
  const DEFAULT_REWARD_IMAGE = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(
    defaultImageSvg
  )}`;
  return {
    id: product.id, // ID từ API /products
    name: product.title,
    description: product.description,
    points: product.unitCost,
    image:
      normalizedImage || DEFAULT_REWARD_IMAGE,
    category: mapProductTypeToCategory(product.type),
    inStock: product.isActive && product.totalStock > 0,
    createdAt: product.createdAt,
    stock: product.totalStock,
  };
};

