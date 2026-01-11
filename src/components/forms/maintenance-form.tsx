"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Textarea } from "../ui/textarea";
import { useRouter } from "next/navigation";

const reportSchema = z.object({
  fullName: z.string().min(2, {
    message: "Nama lengkap harus diisi (min 2 karakter).",
  }),
  unit: z.string("Silakan pilih unit/ruangan."),
  date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Tanggal tidak valid.",
  }),
  assetName: z.string().min(2, {
    message: "Nama alat harus diisi.",
  }),
  description: z.string().min(10, {
    message: "Jelaskan kerusakan minimal 10 karakter.",
  }),
  urgency: z.enum(
    ["low", "medium", "high", "critical"],
    "Pilih tingkat urgensi."
  ),
  photo: z.any().optional(),
});

export function MaintenanceRequestForm() {
  const [devices, setDevices] = useState<{ id: string; name: string }[]>([]);
  const [units, setUnits] = useState<{ id: string; name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [devicesRes, unitsRes] = await Promise.all([
          fetch("/api/devices"),
          fetch("/api/units"),
        ]);

        if (devicesRes.ok) {
          const devicesData = await devicesRes.json();
          setDevices(devicesData);
        }

        if (unitsRes.ok) {
          const unitsData = await unitsRes.json();
          setUnits(unitsData);
        }
      } catch (error) {
        console.error("Failed to fetch data", error);
        toast.error("Gagal memuat data.");
      }
    };
    fetchData();
  }, []);

  const form = useForm<z.infer<typeof reportSchema>>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      fullName: "",
      assetName: "",
      unit: "",
      urgency: "low",
      description: "",
      date: new Date().toISOString().split("T")[0],
    },
  });

  async function onSubmit(values: z.infer<typeof reportSchema>) {
    setIsLoading(true);
    try {
      const selectedDevice = devices.find((d) => d.id === values.assetName);

      const payload = {
        name: values.fullName,
        unit: values.unit,
        deviceName: selectedDevice?.name || values.assetName,
        damageDescription: values.description,
        imageUrl: "", // Placeholder until upload is implemented
      };

      const res = await fetch("/api/maintenance-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      toast.success("Laporan berhasil dikirim!", {
        description: "Admin akan segera memverifikasi laporan Anda.",
      });
      form.reset();
    } catch (error) {
      console.error(error);
      const errorMessage = error instanceof Error ? error.message : "Silakan coba lagi nanti.";
      toast.error("Gagal mengirim laporan", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader className="bg-muted/50 border-b">
        <CardTitle className="text-2xl font-bold text-foreground">
          Form Laporan Kerusakan
        </CardTitle>
        <CardDescription>
          Silakan isi detail kerusakan alat. Admin akan memverifikasi laporan
          Anda.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Pelapor</FormLabel>
                  <FormControl>
                    <Input placeholder="Nama Lengkap Anda" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit / Ruangan</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={units.length === 0}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih Unit" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {units.length === 0 ? (
                          <SelectItem value="loading" disabled>
                            Memuat data...
                          </SelectItem>
                        ) : (
                          units.map((unit) => (
                            <SelectItem key={unit.id} value={unit.name}>
                              {unit.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tanggal Kejadian</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="assetName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Alat / Aset</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={devices.length === 0}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Nama Alat" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-50">
                      {devices.length === 0 ? (
                        <SelectItem value="loading" disabled>
                          Memuat data...
                        </SelectItem>
                      ) : (
                        devices.map((device) => (
                          <SelectItem key={device.id} value={device.id}>
                            {device.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Pilih nama alat dari database.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="urgency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tingkat Urgensi</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seberapa mendesak?" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="low">
                        Rendah (Low) - Tidak Mengganggu Layanan
                      </SelectItem>
                      <SelectItem value="medium">
                        Sedang (Medium) - Layanan Terganggu Minor
                      </SelectItem>
                      <SelectItem value="high">
                        Tinggi (High) - Alat Vital / Layanan Terhenti
                      </SelectItem>
                      <SelectItem value="critical">
                        Kritis (Critical) - Membahayakan Pasien
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi Kerusakan / Keluhan</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Jelaskan secara detail masalah yang terjadi..."
                      className="min-h-30"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="photo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload Foto Bukti (Opsional)</FormLabel>
                  <FormControl>
                    <Input type="file" accept="image/*" />
                  </FormControl>
                  <FormDescription>
                    Ambil foto kerusakan alat untuk memudahkan verifikasi.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? "Mengirim..." : "Kirim Laporan"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
