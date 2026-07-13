import { auth } from "@/lib/auth/auth-options";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login");
  }
  return session;
}

export async function requireShopOwner() {
  const session = await auth();
  if (!session?.user || session.user.role !== "SHOP_OWNER") {
    redirect("/login");
  }
  return session;
}

export async function getSession() {
  const session = await auth();
  return session;
}
