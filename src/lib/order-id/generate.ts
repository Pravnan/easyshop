import { connectDB } from "@/lib/database/mongoose";
import { Counter } from "@/models/Counter";

export async function generateOrderId(storeId: string, storeSlug: string): Promise<string> {
  await connectDB();

  const counter = await Counter.findOneAndUpdate(
    { storeId },
    { $inc: { sequence: 1 } },
    { new: true, upsert: true }
  );

  const seq = String(counter.sequence).padStart(6, "0");
  const slug = storeSlug.toUpperCase().replace(/[^A-Z0-9]/g, "");
  return `ES-${slug}-${seq}`;
}
