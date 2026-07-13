import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const { User } = await import(path.join(root, "src/models/User"));
const { Store } = await import(path.join(root, "src/models/Store"));

// Find running mongod port from lock/process
import { execSync } from "child_process";
try {
  const out = execSync("ps aux | grep 'mongod-arm64.*dbpath' | grep -v grep | head -1").toString().trim();
  const portMatch = out.match(/--port (\d+)/);
  const uri = portMatch ? `mongodb://127.0.0.1:${portMatch[1]}/easyshop` : null;
  if (uri) {
    await mongoose.connect(uri);
    const users = await User.find({ role: "SHOP_OWNER" }).lean();
    const stores = await Store.find({}).lean();
    console.log("=== Shop Owners ===");
    for (const u of users) {
      console.log(`  Name: ${u.name}, Email: ${u.email}`);
    }
    console.log("=== Stores ===");
    for (const s of stores) {
      console.log(`  Name: ${s.name}, Slug: ${s.slug}, WhatsApp: ${s.whatsappNumber}, Active: ${s.isActive}`);
    }
    if (users.length === 0) console.log("No shop owners found - create one from /admin/stores/new");
    await mongoose.disconnect();
  } else {
    console.log("Could not find running mongod process");
  }
} catch (e) {
  console.log("Error:", e.message);
}
process.exit(0);
