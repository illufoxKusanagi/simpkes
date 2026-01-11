import { db } from "@/lib/db";
import { devices } from "@/lib/db/schema";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const deviceSchema = z.object({
  deviceName: z.string("Nama barang tidak boleh kosong!"),
});

export async function GET(request: NextRequest) {
  try {
    const items = await db.select().from(devices);
    return NextResponse.json(items);
  } catch (error) {
    console.error("errro fetching devices: ", error);
    return NextResponse.json(
      { error: "Gagal mengambil peralatan!" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validated = body.parse(deviceSchema);

    const result = await db.insert(devices).values(validated);

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
