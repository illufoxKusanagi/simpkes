import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { maintenanceRequest } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import {
  withMiddleware,
  commonMiddleware,
  RequestWithValidation,
} from "@/middleware/api";

const updateMaintenanceRequestSchema = z.object({
  applicant_name: z.string().min(1, "Nama tidak valid!").optional(),
  unit: z.string().min(1, "Unit tidak valid!").optional(),
  device_name: z.string().min(1, "Nama peralatan tidak valid!").optional(),
  damage_description: z
    .string()
    .min(10, "Deskripsi kerusakan minimal 10 karakter!")
    .optional(),
  photo_url: z.string().optional(),
  status: z
    .enum(["approved", "in_progress", "completed", "cancelled"])
    .optional(),
});

async function handleUpdateMaintenanceRequest(
  request: RequestWithValidation<
    z.infer<typeof updateMaintenanceRequestSchema>
  >,
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
      .from(maintenanceRequest)
      .where(eq(maintenanceRequest.id, id))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: "Permintaan tidak ditemukan" },
        { status: 404 }
      );
    }

    const [updated] = await db
      .update(maintenanceRequest)
      .set(request.validatedData!)
      .where(eq(maintenanceRequest.id, id))
      .returning();

    return NextResponse.json({
      success: true,
      message: "Permintaan berhasil diperbarui!",
      data: updated,
    });
  } catch (error) {
    console.error("Error updating maintenance request:", error);
    return NextResponse.json(
      { error: "Gagal memperbarui permintaan" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: RequestWithValidation<
    z.infer<typeof updateMaintenanceRequestSchema>
  >,
  context: { params: Promise<{ id: string }> }
) {
  return withMiddleware(
    ...commonMiddleware.adminValidated(updateMaintenanceRequestSchema, {
      maxRequests: 10,
      windowMs: 60000,
    })
  )(request, (req) => handleUpdateMaintenanceRequest(req, context));
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
      .from(maintenanceRequest)
      .where(eq(maintenanceRequest.id, id))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { error: "Permintaan tidak ditemukan" },
        { status: 404 }
      );
    }

    await db.delete(maintenanceRequest).where(eq(maintenanceRequest.id, id));

    return NextResponse.json({
      success: true,
      message: "Permintaan berhasil dihapus!",
    });
  } catch (error) {
    console.error("Error deleting maintenance request:", error);
    return NextResponse.json(
      { error: "Gagal menghapus permintaan" },
      { status: 500 }
    );
  }
}
