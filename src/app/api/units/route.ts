import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { units } from "@/lib/db/schema";
import {
  commonMiddleware,
  RequestWithValidation,
  withMiddleware,
} from "@/middleware/api";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const unitSchema = z.object({
  name: z.string().min(1, "Nama unit harus diisi"),
});

export async function GET(request: NextRequest) {
  try {
    const allUnits = await db.select().from(units);
    return NextResponse.json(allUnits);
  } catch (error) {
    console.error("Error fetching units:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data unit" },
      { status: 500 }
    );
  }
}

export async function handleCreateUnit(
  request: RequestWithValidation<z.infer<typeof unitSchema>>
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
      .insert(units)
      .values(request.validatedData as z.infer<typeof unitSchema>)
      .returning();

    return NextResponse.json(
      { success: true, message: "Unit berhasil ditambahkan!", data: result },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating unit:", error);
    return NextResponse.json(
      { error: "Gagal menambahkan unit!" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: RequestWithValidation<z.infer<typeof unitSchema>>
) {
  return withMiddleware(
    ...commonMiddleware.adminValidated(unitSchema, {
      maxRequests: 10,
      windowMs: 60000,
    })
  )(request, handleCreateUnit);
}
