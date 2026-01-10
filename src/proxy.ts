import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export default async function proxy(request: NextRequest) {
  const session = await auth();
  const path = request.nextUrl.pathname;

  // Public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/auth/login",
    "/auth/register",
    "/auth/verify",
    "/auth/reset-password",
  ];

  // Check if route is public
  if (publicRoutes.includes(path)) {
    return NextResponse.next();
  }

  // Protected routes require authentication
  const protectedRoutes = ["/dashboard", "/profile", "/family-tree", "/admin"];

  const isProtectedRoute = protectedRoutes.some((route) =>
    path.startsWith(route)
  );

  if (isProtectedRoute) {
    // Check if user is authenticated
    if (!session || !session.user) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("callbackUrl", path);
      return NextResponse.redirect(loginUrl);
    }

    // Check if user is approved (for non-admin routes)
    if (
      !path.startsWith("/admin") &&
      !session.user.isApprovedByAdmin &&
      !path.includes("/pending-approval")
    ) {
      return NextResponse.redirect(new URL("/pending-approval", request.url));
    }

    // Check admin routes
    if (path.startsWith("/admin") && session.user.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/(dashboard|profile|family-tree|admin)/:path*"],
};
