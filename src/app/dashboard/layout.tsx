import { requireShopOwner } from "@/lib/permissions/authorize";
import Link from "next/link";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Tags,
  Settings,
  LogOut,
  Store,
  Palette,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { connectDB } from "@/lib/database/mongoose";
import { Store as StoreModel } from "@/models/Store";
import { checkAndDisableExpiredStores } from "@/actions/dashboard/trial";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireShopOwner();
  await connectDB();
  const store = await StoreModel.findById(session.user.storeId).lean();

  await checkAndDisableExpiredStores();

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 flex-col border-r bg-white lg:flex">
        <div className="border-b p-6">
          <Link href="/dashboard" className="text-xl font-bold text-[#1565C0]">
            {store?.name ?? "EasyShop"}
          </Link>
          <p className="text-xs text-muted-foreground">Shop Dashboard</p>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-[#EAF4FF] hover:text-[#1565C0]"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/dashboard/orders"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-[#EAF4FF] hover:text-[#1565C0]"
          >
            <ShoppingBag className="h-4 w-4" />
            Orders
          </Link>
          <Link
            href="/dashboard/products"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-[#EAF4FF] hover:text-[#1565C0]"
          >
            <Package className="h-4 w-4" />
            Products
          </Link>
          <Link
            href="/dashboard/categories"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-[#EAF4FF] hover:text-[#1565C0]"
          >
            <Tags className="h-4 w-4" />
            Categories
          </Link>
          <Link
            href="/dashboard/theme"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-[#EAF4FF] hover:text-[#1565C0]"
          >
            <Palette className="h-4 w-4" />
            Theme
          </Link>
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-[#EAF4FF] hover:text-[#1565C0]"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
          {store?.slug && (
            <Link
              href={`/store/${store.slug}`}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-[#EAF4FF] hover:text-[#1565C0]"
            >
              <Store className="h-4 w-4" />
              View Store
            </Link>
          )}
        </nav>
        <div className="border-t p-4">
          <Link
            href="/api/auth/signout"
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-transparent text-sm font-medium whitespace-nowrap transition-all outline-none select-none h-8 px-2.5 hover:bg-muted hover:text-foreground w-full justify-start text-muted-foreground"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Link>
        </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b bg-white px-6 lg:hidden">
          <Link
            href="/dashboard"
            className="text-lg font-bold text-[#1565C0]"
          >
            {store?.name ?? "EasyShop"}
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/api/auth/signout">
              <Button variant="ghost" size="sm">
                <LogOut className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
