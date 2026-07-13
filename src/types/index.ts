export type { IUser } from "@/models/User";
export type { IStore } from "@/models/Store";
export type { ICategory } from "@/models/Category";
export type { IProduct } from "@/models/Product";
export type { IOrder, OrderStatus, OrderSource } from "@/models/Order";

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  image: string;
  regularPrice: number;
  offerPrice?: number;
  selectedColor?: string;
  selectedSize?: string;
  selectedVariants?: Record<string, string>;
  quantity: number;
}
