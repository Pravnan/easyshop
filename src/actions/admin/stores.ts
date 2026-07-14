"use server";

import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/database/mongoose";
import { requireAdmin } from "@/lib/permissions/authorize";
import { User } from "@/models/User";
import { Store } from "@/models/Store";
import { createStoreSchema, resetPasswordSchema, CreateStoreInput } from "@/validations/schemas";

export async function createStore(data: CreateStoreInput) {
  await requireAdmin();
  await connectDB();

  const parsed = createStoreSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }

  const existingEmail = await User.findOne({ email: parsed.data.email.toLowerCase() });
  if (existingEmail) {
    throw new Error("A user with this email already exists");
  }

  const existingSlug = await Store.findOne({ slug: parsed.data.storeSlug });
  if (existingSlug) {
    throw new Error("This store slug is already taken");
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  const user = await User.create({
    name: parsed.data.ownerName,
    email: parsed.data.email.toLowerCase(),
    passwordHash,
    role: "SHOP_OWNER",
    isActive: true,
  });

  const store = await Store.create({
    ownerId: user._id,
    name: parsed.data.storeName,
    slug: parsed.data.storeSlug,
    whatsappNumber: parsed.data.whatsappNumber,
    isActive: true,
  });

  user.storeId = store._id;
  await user.save();

  return {
    success: true,
    storeId: store._id.toString(),
    ownerId: user._id.toString(),
  };
}

export async function resetShopOwnerPassword(storeId: string, newPassword: string) {
  await requireAdmin();
  await connectDB();

  const parsed = resetPasswordSchema.safeParse({ newPassword });
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }

  const store = await Store.findById(storeId);
  if (!store) throw new Error("Store not found");

  const user = await User.findById(store.ownerId);
  if (!user) throw new Error("Shop owner not found");
  if (user.role !== "SHOP_OWNER") throw new Error("User is not a shop owner");

  const passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);
  user.passwordHash = passwordHash;
  await user.save();

  return { success: true, ownerName: user.name, ownerEmail: user.email };
}

export async function markStoreAsPaid(storeId: string) {
  await requireAdmin();
  await connectDB();

  const store = await Store.findById(storeId);
  if (!store) throw new Error("Store not found");

  store.paidAt = new Date();
  store.paymentPending = true;
  store.isActive = true;
  await store.save();

  return { success: true, paidAt: store.paidAt.toISOString() };
}

export async function getStores(search?: string, status?: string) {
  await requireAdmin();
  await connectDB();

  const filter: Record<string, unknown> = {};

  if (status === "active") filter.isActive = true;
  if (status === "inactive") filter.isActive = false;

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { slug: { $regex: search, $options: "i" } },
    ];
  }

  const stores = await Store.find(filter)
    .populate("ownerId", "name email")
    .sort({ createdAt: -1 })
    .lean();

  return stores.map((store) => ({
    _id: (store._id as string).toString(),
    name: store.name,
    slug: store.slug,
    whatsappNumber: store.whatsappNumber,
    ownerName: (store.ownerId as unknown as { name: string })?.name ?? "",
    ownerEmail: (store.ownerId as unknown as { email: string })?.email ?? "",
    isActive: store.isActive,
    createdAt: store.createdAt?.toISOString() ?? "",
  }));
}

export async function getStoreById(storeId: string) {
  await requireAdmin();
  await connectDB();

  const store = await Store.findById(storeId)
    .populate("ownerId", "name email isActive")
    .lean();

  if (!store) throw new Error("Store not found");

  return {
    _id: (store._id as string).toString(),
    name: store.name,
    slug: store.slug,
    whatsappNumber: store.whatsappNumber,
    description: store.description,
    phone: store.phone,
    email: store.email,
    address: store.address,
    isActive: store.isActive,
    trialEndsAt: store.trialEndsAt?.toISOString(),
    paidAt: store.paidAt?.toISOString(),
    paymentPending: store.paymentPending,
    createdAt: store.createdAt?.toISOString() ?? "",
    owner: {
      name: (store.ownerId as unknown as { name: string })?.name ?? "",
      email: (store.ownerId as unknown as { email: string })?.email ?? "",
      isActive: (store.ownerId as unknown as { isActive: boolean })?.isActive ?? false,
    },
  };
}

export async function toggleStoreStatus(storeId: string) {
  await requireAdmin();
  await connectDB();

  const store = await Store.findById(storeId);
  if (!store) throw new Error("Store not found");

  store.isActive = !store.isActive;
  await store.save();

  return { isActive: store.isActive };
}

export async function getAdminStats() {
  await requireAdmin();
  await connectDB();

  const [totalStores, activeStores, inactiveStores, totalOwners, recentStores] =
    await Promise.all([
      Store.countDocuments(),
      Store.countDocuments({ isActive: true }),
      Store.countDocuments({ isActive: false }),
      User.countDocuments({ role: "SHOP_OWNER" }),
      Store.find()
        .populate("ownerId", "name email")
        .sort({ createdAt: -1 })
        .limit(5)
        .lean(),
    ]);

  return {
    totalStores,
    activeStores,
    inactiveStores,
    totalOwners,
    recentStores: recentStores.map((s) => ({
      _id: (s._id as string).toString(),
      name: s.name,
      slug: s.slug,
      ownerName: (s.ownerId as unknown as { name: string })?.name ?? "",
      isActive: s.isActive,
      createdAt: s.createdAt?.toISOString() ?? "",
    })),
  };
}
