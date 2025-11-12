export type ProductType = "VOUCHER" | "MERCH" | "SERVICE" | "GIFT";

export interface Product {
  id: string;
  type: ProductType;
  title: string;
  description: string;
  unitCost: number;
  currency: "COIN";
  totalStock: number;
  imageUrl?: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface ProductMetadata {
  pageSize: number;
  totalItems: number;
  page: number;
}

export interface ProductListResponse {
  data: Product[];
  metadata: ProductMetadata;
}

export interface CreateProduct {
  type: ProductType;
  title: string;
  description: string;
  unitCost: number;
  totalStock: number;
  imageUrl?: string;
}

export type UpdateProduct = Partial<CreateProduct>;

export type ProductReponse = Product;
