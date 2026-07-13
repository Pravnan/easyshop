"use server";

import { connectDB } from "@/lib/database/mongoose";
import { requireShopOwner } from "@/lib/permissions/authorize";
import { Product } from "@/models/Product";
import { Category } from "@/models/Category";
import { uploadImage, deleteImage } from "@/lib/cloudinary/upload";
import { productSchema, ProductInput } from "@/validations/schemas";
import { revalidatePath } from "next/cache";

export async function getProducts(categoryId?: string, search?: string) {
  const session = await requireShopOwner();
  await connectDB();

  const filter: Record<string, unknown> = {
    storeId: session.user.storeId,
  };

  if (categoryId && categoryId !== "all") filter.categoryId = categoryId;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { slug: { $regex: search, $options: "i" } },
      { productCode: { $regex: search, $options: "i" } },
    ];
  }

  const products = await Product.find(filter)
    .populate("categoryId", "name")
    .sort({ createdAt: -1 })
    .lean();

  return products.map((p) => ({
    _id: (p._id as string).toString(),
    name: p.name,
    slug: p.slug,
    regularPrice: p.regularPrice,
    offerPrice: p.offerPrice,
    productCode: p.productCode,
    images: p.images,
    inStock: p.inStock,
    isActive: p.isActive,
    categoryName: (p.categoryId as unknown as { name: string })?.name ?? "",
    createdAt: p.createdAt?.toISOString() ?? "",
  }));
}

export async function getProductById(id: string) {
  const session = await requireShopOwner();
  await connectDB();

  const product = await Product.findOne({
    _id: id,
    storeId: session.user.storeId,
  }).lean();

  if (!product) throw new Error("Product not found");

  return {
    _id: (product._id as string).toString(),
    storeId: (product.storeId as string).toString(),
    categoryId: (product.categoryId as string).toString(),
    name: product.name,
    slug: product.slug,
    description: product.description,
    regularPrice: product.regularPrice,
    offerPrice: product.offerPrice,
    productCode: product.productCode,
    images: product.images,
    colors: product.colors,
    sizes: product.sizes,
    variantGroups: product.variantGroups,
    inStock: product.inStock,
    isActive: product.isActive,
  };
}

export async function createProduct(data: ProductInput, images: File[]) {
  const session = await requireShopOwner();
  await connectDB();

  const parsed = productSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }

  if (images.length > 2) {
    throw new Error("Maximum 2 images allowed");
  }

  const count = await Product.countDocuments({ storeId: session.user.storeId });
  if (count >= 25) {
    throw new Error("Maximum 25 products allowed per store");
  }

  const category = await Category.findOne({
    _id: parsed.data.categoryId,
    storeId: session.user.storeId,
  });
  if (!category) throw new Error("Category not found");

  const existing = await Product.findOne({
    storeId: session.user.storeId,
    slug: parsed.data.slug,
  });
  if (existing) {
    throw new Error("A product with this slug already exists");
  }

  const uploadedImages = [];
  for (const file of images) {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      throw new Error("Images must be JPEG, PNG, or WebP");
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("Images must be less than 5MB");
    }
    try {
      const result = await uploadImage(file, "easyshop/products");
      uploadedImages.push(result);
    } catch {
      console.warn("Image upload failed, skipping. Configure Cloudinary to enable image uploads.");
    }
  }

  const product = await Product.create({
    storeId: session.user.storeId,
    categoryId: parsed.data.categoryId,
    name: parsed.data.name,
    slug: parsed.data.slug,
    description: parsed.data.description,
    regularPrice: parsed.data.regularPrice,
    offerPrice: parsed.data.offerPrice || undefined,
    productCode: parsed.data.productCode || undefined,
    images: uploadedImages,
    colors: parsed.data.colors ?? [],
    sizes: parsed.data.sizes ?? [],
    variantGroups: parsed.data.variantGroups ?? [],
    inStock: parsed.data.inStock ?? true,
    isActive: parsed.data.isActive ?? true,
  });

  revalidatePath("/dashboard/products");
  return { success: true, productId: product._id.toString() };
}

export async function updateProduct(
  id: string,
  data: ProductInput,
  newImages: File[],
  existingImages: { url: string; publicId: string }[],
  removedPublicIds: string[]
) {
  const session = await requireShopOwner();
  await connectDB();

  const parsed = productSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }

  const product = await Product.findOne({
    _id: id,
    storeId: session.user.storeId,
  });
  if (!product) throw new Error("Product not found");

  const totalImages = existingImages.length + newImages.length;
  if (totalImages > 2) {
    throw new Error("Maximum 2 images allowed");
  }

  const duplicate = await Product.findOne({
    storeId: session.user.storeId,
    slug: parsed.data.slug,
    _id: { $ne: id },
  });
  if (duplicate) {
    throw new Error("A product with this slug already exists");
  }

  for (const publicId of removedPublicIds) {
    await deleteImage(publicId);
  }

  const uploadedImages = [...existingImages];
  for (const file of newImages) {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      throw new Error("Images must be JPEG, PNG, or WebP");
    }
    if (file.size > 5 * 1024 * 1024) {
      throw new Error("Images must be less than 5MB");
    }
    const result = await uploadImage(file, "easyshop/products");
    uploadedImages.push(result);
  }

  product.name = parsed.data.name;
  product.slug = parsed.data.slug;
  product.description = parsed.data.description;
  product.categoryId = parsed.data.categoryId;
  product.regularPrice = parsed.data.regularPrice;
  product.offerPrice = parsed.data.offerPrice || undefined;
  product.productCode = parsed.data.productCode || undefined;
  product.images = uploadedImages;
  product.colors = parsed.data.colors ?? [];
  product.sizes = parsed.data.sizes ?? [];
  product.variantGroups = parsed.data.variantGroups ?? [];
  product.inStock = parsed.data.inStock ?? true;
  product.isActive = parsed.data.isActive ?? true;
  await product.save();

  revalidatePath("/dashboard/products");
  return { success: true };
}

export async function deleteProduct(id: string) {
  const session = await requireShopOwner();
  await connectDB();

  const product = await Product.findOne({
    _id: id,
    storeId: session.user.storeId,
  });
  if (!product) throw new Error("Product not found");

  for (const img of product.images) {
    await deleteImage(img.publicId);
  }

  await Product.deleteOne({ _id: id });
  revalidatePath("/dashboard/products");
}

export async function toggleProductStatus(id: string) {
  const session = await requireShopOwner();
  await connectDB();

  const product = await Product.findOne({
    _id: id,
    storeId: session.user.storeId,
  });
  if (!product) throw new Error("Product not found");

  product.isActive = !product.isActive;
  await product.save();
  revalidatePath("/dashboard/products");

  return { isActive: product.isActive };
}
