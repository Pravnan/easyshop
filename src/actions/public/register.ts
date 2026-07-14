"use server";

import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/database/mongoose";
import { User } from "@/models/User";
import { Store } from "@/models/Store";
import { registerSchema } from "@/validations/schemas";

export async function registerStore(data: {
  ownerName: string;
  email: string;
  password: string;
  storeName: string;
  storeSlug: string;
  whatsappNumber: string;
}): Promise<{ success: boolean; error?: string; storeId?: string; ownerId?: string; trialEndsAt?: string }> {
  try {
    await connectDB();
  } catch {
    return { success: false, error: "Database connection failed. Please try again." };
  }

  const parsed = registerSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const existingEmail = await User.findOne({ email: parsed.data.email.toLowerCase() });
  if (existingEmail) {
    return { success: false, error: "A user with this email already exists" };
  }

  const existingSlug = await Store.findOne({ slug: parsed.data.storeSlug });
  if (existingSlug) {
    return { success: false, error: "This store slug is already taken" };
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 12);

  const trialEndsAt = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000);

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
    trialEndsAt,
    theme: "ocean-blue",
  });

  user.storeId = store._id;
  await user.save();

  return {
    success: true,
    storeId: store._id.toString(),
    ownerId: user._id.toString(),
    trialEndsAt: trialEndsAt.toISOString(),
  };
}
