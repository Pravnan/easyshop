async function loadEnv() {
  try {
    const fs = await import("fs");
    const path = await import("path");
    const envPath = path.resolve(".env.local");
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, "utf-8");
      for (const line of content.split("\n")) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith("#")) {
          const eqIdx = trimmed.indexOf("=");
          if (eqIdx > 0) {
            const key = trimmed.slice(0, eqIdx).trim();
            const val = trimmed.slice(eqIdx + 1).trim();
            if (!process.env[key]) {
              process.env[key] = val;
            }
          }
        }
      }
    }
  } catch {
    // ignore
  }
}

async function seed() {
  await loadEnv();

  const { connectDB } = await import("../src/lib/database/mongoose");
  const { User } = await import("../src/models/User");
  const bcrypt = await import("bcryptjs");

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is not set in environment variables");
    process.exit(1);
  }

  const name = process.env.SEED_ADMIN_NAME || "EasyShop Admin";
  const email = process.env.SEED_ADMIN_EMAIL || "admin@example.com";
  const password = process.env.SEED_ADMIN_PASSWORD;

  if (!password) {
    console.error("SEED_ADMIN_PASSWORD is not set");
    process.exit(1);
  }

  console.log("Connecting to MongoDB...");
  await connectDB();

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    console.log(`Admin user "${email}" already exists. Skipping.`);
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await User.create({
    name,
    email: email.toLowerCase(),
    passwordHash,
    role: "ADMIN",
    isActive: true,
  });

  console.log("Admin account created successfully.");
  console.log(`  Name:  ${name}`);
  console.log(`  Email: ${email}`);
  console.log("Please keep your password safe.");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seed failed:", error.message);
  process.exit(1);
});
