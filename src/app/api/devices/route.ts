import { db } from "@/lib/db";
import { devices } from "@/lib/db/schema";
import {
  commonMiddleware,
  RequestWithValidation,
  withMiddleware,
} from "@/middleware/api";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { authOptions } from "@/lib/auth";

const deviceSchema = z.object({
  name: z.string().min(1, "Nama alat harus diisi"),
});

export async function GET(request: NextRequest) {
  try {
    const items = await db.select().from(devices);
    return NextResponse.json(items);
  } catch (error) {
    console.error("error fetching devices: ", error);
    return NextResponse.json(
      { error: "Gagal mengambil peralatan!" },
      { status: 500 }
    );
  }
}

async function handleCreateDevice(
  request: RequestWithValidation<z.infer<typeof deviceSchema>>
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    const [result] = await db
      .insert(devices)
      .values(request.validatedData as z.infer<typeof deviceSchema>)
      .returning();

    return NextResponse.json(
      { success: true, message: "Alat berhasil ditambahkan!", data: result },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating device:", error);
    return NextResponse.json(
      { error: "Gagal menambahkan alat!" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: RequestWithValidation<z.infer<typeof deviceSchema>>
) {
  return withMiddleware(
    ...commonMiddleware.adminValidated(deviceSchema, {
      maxRequests: 10,
      windowMs: 60000,
    })
  )(request, handleCreateDevice);
}
