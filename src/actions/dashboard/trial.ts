"use server";

import { connectDB } from "@/lib/database/mongoose";
import { Store } from "@/models/Store";

export async function checkAndDisableExpiredStores() {
  await connectDB();
  const now = new Date();
  const graceEnd = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  const result = await Store.updateMany(
    {
      trialEndsAt: { $lte: graceEnd },
      paidAt: null,
      isActive: true,
    },
    { $set: { isActive: false } }
  );
  return result.modifiedCount;
}

export async function getStoreTrialInfo(storeId: string) {
  await connectDB();
  const store = await Store.findById(storeId).lean();
  if (!store) return null;
  return {
    trialEndsAt: store.trialEndsAt?.toISOString(),
    paidAt: store.paidAt?.toISOString(),
    isActive: store.isActive,
    theme: store.theme,
  };
}
