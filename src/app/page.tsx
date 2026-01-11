import Link from "next/link";
import { ArrowRight, LayoutDashboard, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
      <div className="max-w-4xl w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl text-foreground">
            SIMPKES RSUD Caruban
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Sistem Informasi Manajemen Pemeliharaan Alat Kesehatan
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          <Link href="/dashboard" className="group">
            <Card className="h-full hover:shadow-xl transition-all hover:border-blue-400 dark:hover:border-blue-700">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-3 text-2xl">
                  <LayoutDashboard className="w-8 h-8 text-blue-600" />
                  Dashboard
                </CardTitle>
                <CardDescription>
                  Pantau statistik pengajuan, dan status perbaikan.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full group-hover:bg-blue-50"
                >
                  Buka Dashboard <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </Link>

          <Link href="/request" className="group">
            <Card className="h-full hover:shadow-xl transition-all border-slate-200 group-hover:border-orange-400">
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-3 text-2xl">
                  <Wrench className="w-8 h-8 text-orange-600" />
                  Lapor Kerusakan
                </CardTitle>
                <CardDescription>
                  Ajukan perbaikan aset atau keluhan kerusakan alat.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full group-hover:bg-orange-50"
                >
                  Buat Laporan <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
