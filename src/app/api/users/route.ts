import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  ApiError,
  withMiddleware,
  RequestWithValidation,
  commonMiddleware,
} from "@/middleware/api";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword } from "@/lib/auth/password";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const registerSchema = z.object({
  email: z.email("Invalid email format").toLowerCase(),
  password: z.string().min(8, "Password minimal 8 karakter"),
  username: z.string().min(3, "Username paling tidak harus 3 karakter"),
  role: z.enum(["admin", "user"]).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const allUsers = await db.select().from(users);
    return NextResponse.json(allUsers);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data pengguna" },
      { status: 500 }
    );
  }
}

async function addingUserHandler(
  request: RequestWithValidation<z.infer<typeof registerSchema>>
) {
  // 1. Authentication & Authorization checks
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  if (session.user.role !== "admin") {
    return NextResponse.json(
      { success: false, error: "Forbidden - Admin access required" },
      { status: 403 }
    );
  }

  // 2. Extract validated data (guaranteed to exist by middleware)
  const { email, password, username, role } = request.validatedData as z.infer<
    typeof registerSchema
  >;

  try {
    // 3. Check if user already exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    if (existingUser) {
      throw new ApiError("Email already registered", 409);
    }

    const [existingUsername] = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);

    if (existingUsername) {
      throw new ApiError("Username already taken", 409);
    }

    // 4. Hash password
    const hashedPassword = await hashPassword(password);

    // 5. Create new user
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        username,
        password: hashedPassword,
        role: "user",
      })
      .returning();

    // 6. Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Registration successful",
        data: {
          user: {
            id: newUser.id,
            email: newUser.email,
            role: newUser.role,
          },
        },
      },
      { status: 201 }
    );
  } catch (e: unknown) {
    // Handle database constraint errors
    const error = e as { code?: string };
    if (error?.code === "23505") {
      throw new ApiError(
        "Email or username already registered",
        409,
        "DUPLICATE_USER"
      );
    }
    throw e;
  }
}

export function POST(request: NextRequest) {
  return withMiddleware(
    ...commonMiddleware.adminValidated(registerSchema, {
      maxRequests: 3,
      windowMs: 600000,
    })
  )(request, addingUserHandler);
}
