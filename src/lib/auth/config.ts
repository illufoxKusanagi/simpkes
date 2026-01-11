// src/lib/auth/config.ts
const isProdLike = process.env.NODE_ENV !== "development";
const JWT_SECRET = process.env.JWT_SECRET;
if (isProdLike && !JWT_SECRET) {
  throw new Error("JWT_SECRET must be set in the environment");
}

export const authConfig = {
  JWT_SECRET: JWT_SECRET ?? "dev-insecure-secret",
  JWT_EXPIRES_IN: "7d",
  BCRYPT_ROUNDS: 12,
  COOKIE_NAME: "auth-token",
  COOKIE_OPTIONS: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/",
  },
};

// Public routes that don't require authentication
export const publicRoutes = ["/", "/auth/login", "/api/auth"];

// Routes accessible by all authenticated users
export const userRoutes = ["/request", "/api/maintenance-request"];

// Admin-only routes
export const adminRoutes = ["/dashboard", "/api/devices"];

// Helper to check if user can access a route
export function canAccessRoute(path: string, role?: string): boolean {
  // Public routes are accessible to everyone
  if (publicRoutes.some((route) => path.startsWith(route))) {
    return true;
  }

  // Not authenticated
  if (!role) {
    return false;
  }

  // Admin can access everything
  if (role === "admin") {
    return true;
  }

  // Regular users can only access user routes
  if (role === "user") {
    return userRoutes.some((route) => path.startsWith(route));
  }

  return false;
}
