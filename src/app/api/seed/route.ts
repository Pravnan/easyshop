import { connectDB } from "@/lib/database/mongoose";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const name = process.env.SEED_ADMIN_NAME || "EasyShop Admin";
    const email = process.env.SEED_ADMIN_EMAIL || "admin@example.com";
    const password = process.env.SEED_ADMIN_PASSWORD;

    if (!password) {
      return NextResponse.json(
        { error: "SEED_ADMIN_PASSWORD not set" },
        { status: 400 }
      );
    }

    await connectDB();

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ message: "Admin already exists", email });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: "ADMIN",
      isActive: true,
    });

    return NextResponse.json({
      message: "Admin created successfully",
      name,
      email,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Seed failed" },
      { status: 500 }
    );
  }
}
