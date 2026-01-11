import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { devices } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import {
  withMiddleware,
  commonMiddleware,
  RequestWithValidation,
} from "@/middleware/api";

const updateDeviceSchema = z.object({
  name: z.string().min(1, "Nama alat harus diisi"),
});

async function handleUpdateDevice(
  request: RequestWithValidation<z.infer<typeof updateDeviceSchema>>,
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
      .from(devices)
      .where(eq(devices.id, id))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: "Alat tidak ditemukan" },
        { status: 404 }
      );
    }

    const [updated] = await db
      .update(devices)
      .set(request.validatedData!)
      .where(eq(devices.id, id))
      .returning();

    return NextResponse.json({
      success: true,
      message: "Alat berhasil diperbarui!",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating device:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui alat" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: RequestWithValidation<z.infer<typeof updateDeviceSchema>>,
  context: { params: Promise<{ id: string }> }
) {
  return withMiddleware(
    ...commonMiddleware.adminValidated(updateDeviceSchema, {
      maxRequests: 10,
      windowMs: 60000,
    })
  )(request, (req) => handleUpdateDevice(req, context));
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
      .from(devices)
      .where(eq(devices.id, id))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: "Alat tidak ditemukan" },
        { status: 404 }
      );
    }

    await db.delete(devices).where(eq(devices.id, id));

    return NextResponse.json({
      success: true,
      message: "Alat berhasil dihapus!",
    });
  } catch (error) {
    console.error("Error deleting device:", error);
    return NextResponse.json(
      { error: "Gagal menghapus alat" },
      { status: 500 }
    );
  }
}
