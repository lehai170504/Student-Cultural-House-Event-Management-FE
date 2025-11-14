export type RewardCategory = "voucher" | "gift";

export interface Reward {
  id: string;
  name: string;
  description: string;
  points: number;
  image: string;
  category: RewardCategory;
  inStock: boolean;
  createdAt: string; // ISO date string for sorting newest
  stock: number; // totalStock from API
}

export interface RedeemedProduct {
  id: string;
  type: string;
  title: string;
  description: string;
  unitCost: number;
  currency: string;
  totalStock: number;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
}

export const CATEGORY_LABEL: Record<RewardCategory, string> = {
  voucher: "🎫 Voucher ăn uống",
  gift: "🎁 Quà tặng",
};

export const CATEGORY_BADGE: Record<RewardCategory, string> = {
  voucher: "Voucher",
  gift: "Quà tặng",
};

