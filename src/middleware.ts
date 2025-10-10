export { auth as middleware } from "@/lib/auth";

export const config = {
  matcher: [
    "/(dashboard|profile|family-tree|admin)/:path*",
  ]
};
