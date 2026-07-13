import { requireAdmin } from "@/lib/permissions/authorize";
import Link from "next/link";
import {
  LayoutDashboard,
  Store,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 flex-col border-r bg-white lg:flex">
        <div className="border-b p-6">
          <Link href="/admin" className="text-xl font-bold text-[#1565C0]">
            EasyShop
          </Link>
          <p className="text-xs text-muted-foreground">Admin Panel</p>
        </div>
        <nav className="flex-1 space-y-1 p-4">
          <Link
            href="/admin"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-[#EAF4FF] hover:text-[#1565C0]"
          >
            <LayoutDashboard className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/admin/stores"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-[#EAF4FF] hover:text-[#1565C0]"
          >
            <Store className="h-4 w-4" />
            Stores
          </Link>
        </nav>
        <div className="border-t p-4">
          <form action="/api/auth/signout" method="POST">
            <Link href="/api/auth/signout" className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-transparent text-sm font-medium whitespace-nowrap transition-all outline-none select-none h-8 px-2.5 hover:bg-muted hover:text-foreground w-full justify-start text-muted-foreground">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Link>
          </form>
        </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b bg-white px-6 lg:hidden">
          <Link href="/admin" className="text-lg font-bold text-[#1565C0]">
            EasyShop
          </Link>
          <div className="flex items-center gap-2">
            <Link href="/admin/stores">
              <Button variant="ghost" size="sm">
                <Store className="h-4 w-4" />
              </Button>
            </Link>
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
