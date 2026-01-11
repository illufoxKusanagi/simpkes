/**
 * This file is no longer needed - NextAuth handles authentication.
 * Login is handled by NextAuth at /api/auth/signin
 * To sign in programmatically, use: signIn('credentials', { identifier, password })
 *
 * This file can be safely deleted.
 */

import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error: "Use NextAuth for authentication",
      signInUrl: "/api/auth/signin",
    },
    { status: 410 }
  );
}
