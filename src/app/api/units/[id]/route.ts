import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { units } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  withMiddleware,
  commonMiddleware,
  RequestWithValidation,
} from "@/middleware/api";

const updateUnitSchema = z.object({
  name: z.string().min(1, "Nama unit harus diisi"),
});

async function handleUpdateUnit(
  request: RequestWithValidation<z.infer<typeof updateUnitSchema>>,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    const existing = await db
      .select()
      .from(units)
      .where(eq(units.id, id))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: "Unit tidak ditemukan" },
        { status: 404 }
      );
    }

    const [updated] = await db
      .update(units)
      .set(request.validatedData!)
      .where(eq(units.id, id))
      .returning();

    return NextResponse.json({
      success: true,
      message: "Unit berhasil diperbarui!",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating unit:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui unit" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: RequestWithValidation<z.infer<typeof updateUnitSchema>>,
  context: { params: Promise<{ id: string }> }
) {
  return withMiddleware(
    ...commonMiddleware.adminValidated(updateUnitSchema, {
      maxRequests: 10,
      windowMs: 60000,
    })
  )(request, (req) => handleUpdateUnit(req, context));
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const { id } = await context.params;

    const existing = await db
      .select()
      .from(units)
      .where(eq(units.id, id))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: "Unit tidak ditemukan" },
        { status: 404 }
      );
    }

    await db.delete(units).where(eq(units.id, id));

    return NextResponse.json({
      success: true,
      message: "Unit berhasil dihapus!",
    });
  } catch (error) {
    console.error("Error deleting unit:", error);
    return NextResponse.json(
      { error: "Gagal menghapus unit" },
      { status: 500 }
    );
  }
}
