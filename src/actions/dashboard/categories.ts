"use server";

import { connectDB } from "@/lib/database/mongoose";
import { requireShopOwner } from "@/lib/permissions/authorize";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";
import { categorySchema, CategoryInput } from "@/validations/schemas";
import { revalidatePath } from "next/cache";

export async function getCategories() {
  const session = await requireShopOwner();
  await connectDB();

  const categories = await Category.find({
    storeId: session.user.storeId,
  })
    .sort({ name: 1 })
    .lean();

  return categories.map((c) => ({
    _id: (c._id as string).toString(),
    name: c.name,
    slug: c.slug,
    description: c.description,
    isActive: c.isActive,
    productCount: 0,
  }));
}

export async function createCategory(data: CategoryInput) {
  const session = await requireShopOwner();
  await connectDB();

  const parsed = categorySchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }

  const count = await Category.countDocuments({ storeId: session.user.storeId });
  if (count >= 5) {
    throw new Error("Maximum 5 categories allowed per store");
  }

  const existing = await Category.findOne({
    storeId: session.user.storeId,
    slug: parsed.data.slug,
  });
  if (existing) {
    throw new Error("A category with this slug already exists");
  }

  await Category.create({
    storeId: session.user.storeId,
    name: parsed.data.name,
    slug: parsed.data.slug,
    description: parsed.data.description,
    isActive: parsed.data.isActive ?? true,
  });

  revalidatePath("/dashboard/categories");
}

export async function updateCategory(id: string, data: CategoryInput) {
  const session = await requireShopOwner();
  await connectDB();

  const parsed = categorySchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }

  const category = await Category.findOne({
    _id: id,
    storeId: session.user.storeId,
  });
  if (!category) throw new Error("Category not found");

  const duplicate = await Category.findOne({
    storeId: session.user.storeId,
    slug: parsed.data.slug,
    _id: { $ne: id },
  });
  if (duplicate) {
    throw new Error("A category with this slug already exists");
  }

  category.name = parsed.data.name;
  category.slug = parsed.data.slug;
  category.description = parsed.data.description ?? category.description;
  if (parsed.data.isActive !== undefined) category.isActive = parsed.data.isActive;
  await category.save();

  revalidatePath("/dashboard/categories");
}

export async function deleteCategory(id: string) {
  const session = await requireShopOwner();
  await connectDB();

  const category = await Category.findOne({
    _id: id,
    storeId: session.user.storeId,
  });
  if (!category) throw new Error("Category not found");

  const productCount = await Product.countDocuments({ categoryId: id });
  if (productCount > 0) {
    throw new Error(
      `Cannot delete "${category.name}" because it contains ${productCount} product(s). Remove them first.`
    );
  }

  await Category.deleteOne({ _id: id });
  revalidatePath("/dashboard/categories");
}

export async function toggleCategoryStatus(id: string) {
  const session = await requireShopOwner();
  await connectDB();

  const category = await Category.findOne({
    _id: id,
    storeId: session.user.storeId,
  });
  if (!category) throw new Error("Category not found");

  category.isActive = !category.isActive;
  await category.save();
  revalidatePath("/dashboard/categories");

  return { isActive: category.isActive };
}
