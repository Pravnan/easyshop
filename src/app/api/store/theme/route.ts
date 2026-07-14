import { NextResponse } from "next/server";
import { connectDB } from "@/lib/database/mongoose";
import { Store } from "@/models/Store";

export async function PUT(req: Request) {
  try {
    const { auth } = await import("@/lib/auth/auth-options");
    const session = await auth();
    if (!session?.user?.storeId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { theme } = await req.json();
    const validThemes = ["ocean-blue", "midnight-noir", "forest-moss", "rose-blush"];
    if (!validThemes.includes(theme)) {
      return NextResponse.json({ error: "Invalid theme" }, { status: 400 });
    }

    await connectDB();
    await Store.findByIdAndUpdate(session.user.storeId, { theme });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to update theme" }, { status: 500 });
  }
}
