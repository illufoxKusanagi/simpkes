import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { hashPassword } from "@/lib/auth/password";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Schema for updating user (all fields optional for partial updates)
const updateUserSchema = z.object({
  username: z.string("Username tidak valid").optional(),
  email: z.email("Format email tidak valid").optional(),
  password: z.string().min(8, "Password minimal harus 8 karakter").optional(),
  role: z.enum(["admin", "user"]).optional(),
});

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // 1. Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Check if user is admin
    if (session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    // 3. Parse and validate request body
    const body = await request.json();
    const validatedData = updateUserSchema.parse(body);

    // 4. Get user ID from params
    const { id } = await context.params;

    // 5. Check if user exists
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!existingUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    // 6. Prepare update object (only include fields that were provided)
    const updateData: Partial<typeof users.$inferInsert> = {};

    if (validatedData.username) {
      updateData.email = validatedData.email;
    }
    if (validatedData.email) {
      updateData.email = validatedData.email;
    }

    if (validatedData.password) {
      updateData.password = await hashPassword(validatedData.password);
    }

    if (validatedData.role) {
      updateData.role = validatedData.role;
    }

    // 7. Update user
    await db.update(users).set(updateData).where(eq(users.id, id));

    // 8. Return success (don't expose password)
    return NextResponse.json(
      {
        success: true,
        message: "User berhasil diperbarui!",
        data: {
          id,
          username: updateData.username || existingUser.username,
          email: updateData.email || existingUser.email,
          role: updateData.role || existingUser.role,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation error",
          details: error,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Error dalam memperbarui user!" },
      { status: 500 }
    );
  }
}

// DELETE endpoint for removing users (admin only)
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    // Prevent admin from deleting themselves
    if (id === session.user.id) {
      return NextResponse.json(
        { success: false, error: "Cannot delete your own account" },
        { status: 400 }
      );
    }

    const result = await db.delete(users).where(eq(users.id, id));

    return NextResponse.json(
      { success: true, message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
