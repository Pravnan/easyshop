import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const createStoreSchema = z.object({
  ownerName: z.string().min(1, "Owner name is required").max(100),
  email: z.string().email("Invalid email address").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(100),
  storeName: z.string().min(1, "Store name is required").max(100),
  storeSlug: z
    .string()
    .min(1, "Store slug is required")
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  whatsappNumber: z.string().min(1, "WhatsApp number is required").max(20),
});

export const storeSettingsSchema = z.object({
  name: z.string().min(1, "Store name is required").max(100),
  slug: z
    .string()
    .min(1, "Store slug is required")
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  description: z.string().max(1000).optional(),
  whatsappNumber: z.string().min(1, "WhatsApp number is required").max(20),
  phone: z.string().max(20).optional(),
  email: z.string().max(255).email("Invalid email").optional().or(z.literal("")),
  address: z.string().max(500).optional(),
  deliveryInformation: z.string().max(1000).optional(),
  facebookUrl: z.string().max(500).optional(),
  instagramUrl: z.string().max(500).optional(),
});

export const categorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(100),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  description: z.string().max(500).optional(),
  isActive: z.boolean().optional(),
});

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required").max(200),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  description: z.string().min(1, "Description is required").max(5000),
  categoryId: z.string().min(1, "Category is required"),
  regularPrice: z.coerce.number().min(0, "Price must be positive"),
  offerPrice: z.coerce.number().min(0).optional().or(z.literal("")),
  productCode: z.string().max(100).optional(),
  colors: z.array(z.string()).optional(),
  sizes: z.array(z.string()).optional(),
  variantGroups: z
    .array(
      z.object({
        name: z.string().min(1).max(100),
        options: z.array(z.string().min(1).max(100)),
      })
    )
    .optional(),
  inStock: z.boolean().optional(),
  isActive: z.boolean().optional(),
});

export const manualOrderSchema = z.object({
  externalOrderId: z.string().max(100).optional().or(z.literal("")),
  customerName: z.string().min(1, "Customer name is required").max(200),
  customerPhone: z.string().min(1, "Phone number is required").max(20),
  customerAddress: z.string().min(1, "Address is required").max(500),
  customerCity: z.string().max(100).optional().or(z.literal("")),
  customerEmail: z.string().max(255).email("Invalid email").optional().or(z.literal("")),
  customerNote: z.string().max(1000).optional().or(z.literal("")),
  productDescription: z.string().min(1, "Product description is required").max(2000),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
  totalAmount: z.coerce.number().min(0, "Total must be positive"),
  status: z.enum(["NEW", "CONTACTED", "CONFIRMED", "COMPLETED", "CANCELLED"]).optional(),
  internalNote: z.string().max(2000).optional().or(z.literal("")),
});

export const checkoutSchema = z.object({
  customerName: z.string().min(1, "Name is required").max(200),
  phone: z.string().min(1, "Phone is required").max(20),
  email: z.string().max(255).email("Invalid email").optional().or(z.literal("")),
  address: z.string().min(1, "Address is required").max(500),
  city: z.string().max(100).optional().or(z.literal("")),
  note: z.string().max(1000).optional().or(z.literal("")),
});

export const resetPasswordSchema = z.object({
  newPassword: z.string().min(6, "Password must be at least 6 characters").max(100),
});

export const registerSchema = z.object({
  ownerName: z.string().min(1, "Owner name is required").max(100),
  email: z.string().email("Invalid email address").max(255),
  password: z.string().min(6, "Password must be at least 6 characters").max(100),
  storeName: z.string().min(1, "Store name is required").max(100),
  storeSlug: z
    .string()
    .min(1, "Store slug is required")
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  whatsappNumber: z.string().min(1, "WhatsApp number is required").max(20),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type CreateStoreInput = z.infer<typeof createStoreSchema>;
export type StoreSettingsInput = z.infer<typeof storeSettingsSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type ManualOrderInput = z.infer<typeof manualOrderSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
