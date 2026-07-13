import { auth } from "@/lib/auth/auth-middleware";
import { NextResponse } from "next/server";

export default auth((req) => {
  if (!req.auth) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const path = req.nextUrl.pathname;

  if (path.startsWith("/admin") && req.auth.user?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (path.startsWith("/dashboard") && req.auth.user?.role !== "SHOP_OWNER") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
