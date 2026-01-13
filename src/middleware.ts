import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  // 1. Define Route Groups
  const authRoutes = ["/auth/login", "/auth/register"];
  const publicRoutes = ["/", ...authRoutes]; // Landing and Auth
  const adminRoutes = [
    "/dashboard/manage",
    "/manage", // Just in case
    "/api/users",
  ];

  // 2. Helper Functions
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  const isPublicRoute =
    publicRoutes.some((route) =>
      route === "/" ? pathname === route : pathname.startsWith(route)
    ) || pathname.startsWith("/api/auth"); // NextAuth endpoints are always public
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  // 3. Logic Flow

  // A. Redirect Authenticated Users away from Auth pages
  if (token && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // B. Protect Private Routes (Redirect Unauthenticated to Login)
  if (!token && !isPublicRoute) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // C. Role-Based Access Control (Admin Routes)
  if (token && isAdminRoute && token.role !== "admin") {
    // If it's an API call, return 403
    if (pathname.startsWith("/api/")) {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }
    // If it's a page, redirect to dashboard with error param
    const url = new URL("/dashboard", request.url);
    url.searchParams.set("error", "unauthorized");
    return NextResponse.redirect(url);
  }

  // Allow access
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder content
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
