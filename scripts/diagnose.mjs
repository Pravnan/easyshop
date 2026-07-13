import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
config({ path: path.join(root, ".env.local") });

// Connect to Atlas
const mongoose = await import("mongoose");
await mongoose.default.connect(process.env.MONGODB_URI);

const { User } = await import(path.join(root, "src/models/User"));
const { Store } = await import(path.join(root, "src/models/Store"));

const allUsers = await User.find({}).lean();
const stores = await Store.find({}).lean();

console.log("=== ALL USERS ===");
for (const u of allUsers) {
  console.log(`  Name: ${u.name}, Email: ${u.email}, Role: ${u.role}, Active: ${u.isActive}, Has storeId: ${!!u.storeId}`);
}

console.log("\n=== ALL STORES ===");
for (const s of stores) {
  console.log(`  Name: ${s.name}, Slug: ${s.slug}, Active: ${s.isActive}, OwnerId: ${s.ownerId}`);
}

await mongoose.default.disconnect();
process.exit(0);
