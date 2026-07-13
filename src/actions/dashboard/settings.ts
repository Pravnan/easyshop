"use server";

import { connectDB } from "@/lib/database/mongoose";
import { requireShopOwner } from "@/lib/permissions/authorize";
import { Store } from "@/models/Store";
import { uploadImage, deleteImage } from "@/lib/cloudinary/upload";
import { storeSettingsSchema, StoreSettingsInput } from "@/validations/schemas";
import { revalidatePath } from "next/cache";

export async function getStoreSettings() {
  const session = await requireShopOwner();
  await connectDB();

  const store = await Store.findById(session.user.storeId).lean();
  if (!store) throw new Error("Store not found");

  return {
    _id: (store._id as string).toString(),
    name: store.name,
    slug: store.slug,
    logo: store.logo,
    banner: store.banner,
    description: store.description ?? "",
    whatsappNumber: store.whatsappNumber,
    phone: store.phone ?? "",
    email: store.email ?? "",
    address: store.address ?? "",
    deliveryInformation: store.deliveryInformation ?? "",
    facebookUrl: store.facebookUrl ?? "",
    instagramUrl: store.instagramUrl ?? "",
  };
}

export async function updateStoreSettings(data: StoreSettingsInput) {
  const session = await requireShopOwner();
  await connectDB();

  const parsed = storeSettingsSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0].message);
  }

  const store = await Store.findById(session.user.storeId);
  if (!store) throw new Error("Store not found");

  if (parsed.data.slug !== store.slug) {
    const existing = await Store.findOne({ slug: parsed.data.slug, _id: { $ne: store._id } });
    if (existing) {
      throw new Error("This slug is already taken");
    }
  }

  store.name = parsed.data.name;
  store.slug = parsed.data.slug;
  store.description = parsed.data.description ?? store.description;
  store.whatsappNumber = parsed.data.whatsappNumber;
  store.phone = parsed.data.phone ?? store.phone;
  store.email = parsed.data.email || undefined;
  store.address = parsed.data.address ?? store.address;
  store.deliveryInformation = parsed.data.deliveryInformation ?? store.deliveryInformation;
  store.facebookUrl = parsed.data.facebookUrl || undefined;
  store.instagramUrl = parsed.data.instagramUrl || undefined;
  await store.save();

  revalidatePath("/dashboard/settings");
  return { success: true };
}

export async function updateLogo(file: File) {
  const session = await requireShopOwner();
  await connectDB();

  const store = await Store.findById(session.user.storeId);
  if (!store) throw new Error("Store not found");

  if (store.logo?.publicId) {
    await deleteImage(store.logo.publicId);
  }

  const result = await uploadImage(file, "easyshop/logos");
  if (result) {
    store.logo = result;
    await store.save();
  }
  revalidatePath("/dashboard/settings");

  return { success: true, uploaded: !!result };
}

export async function updateBanner(file: File) {
  const session = await requireShopOwner();
  await connectDB();

  const store = await Store.findById(session.user.storeId);
  if (!store) throw new Error("Store not found");

  if (store.banner?.publicId) {
    await deleteImage(store.banner.publicId);
  }

  const result = await uploadImage(file, "easyshop/banners");
  if (result) {
    store.banner = result;
    await store.save();
  }
  revalidatePath("/dashboard/settings");

  return { success: true, uploaded: !!result };
}
