import { db } from "@/lib/db";
import { maintenanceRequest } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";
import z, { success } from "zod";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const maintenanceRequestSchema = z.object({
  name: z.string().min(1, "Nama tidak valid!"),
  unit: z.string().min(1, "Unit tidak valid!"),
  deviceName: z.string().min(1, "Nama peralatan tidak valid!"),
  damageDescription: z
    .string()
    .min(10, "Deskripsi kerusakan minimal 10 karakter!"),
  imageUrl: z.string().optional(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const items = await db.select().from(maintenanceRequest);
    return NextResponse.json(items);
  } catch (error) {
    console.error("error fetching maintenance requests: ", error);
    return NextResponse.json(
      { error: "Gagal mengambil item!" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized - Please login" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validated = maintenanceRequestSchema.parse(body);

    const newMaintenanceRequest = {
      applicant_name: validated.name,
      unit: validated.unit,
      device_name: validated.deviceName,
      damage_description: validated.damageDescription,
      photo_url: validated.imageUrl || null,
      applicant_date: new Date().toISOString().split("T")[0], // YYYY-MM-DD
      status: "approved",
    };

    const result = await db
      .insert(maintenanceRequest)
      .values(newMaintenanceRequest);

    return NextResponse.json(
      { success: true, message: "Pengajuan berhasil dibuat!" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating request: ", error);
    return NextResponse.json(
      { error: "Gagal membuat pengajuan!" },
      { status: 400 }
    );
  }
}
