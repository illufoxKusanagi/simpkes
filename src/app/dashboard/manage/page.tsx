"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DevicesManagement } from "@/components/admin/devices-management";
import { UsersManagement } from "@/components/admin/users-management";
import { UnitsManagement } from "@/components/admin/units-management";
import { RequestsManagement } from "@/components/admin/requests-management";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function ManagePage() {
  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Kelola Data</h1>
          <p className="text-muted-foreground">
            Kelola pengguna, alat, unit, dan permintaan maintenance
          </p>
        </div>

        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="requests">Pengajuan</TabsTrigger>
            <TabsTrigger value="users">Pengguna</TabsTrigger>
            <TabsTrigger value="devices">Alat</TabsTrigger>
            <TabsTrigger value="units">Unit</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>Manajemen Pengguna</CardTitle>
                <CardDescription>Kelola akun pengguna sistem</CardDescription>
              </CardHeader>
              <CardContent>
                <UsersManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="devices">
            <Card>
              <CardHeader>
                <CardTitle>Manajemen Alat</CardTitle>
                <CardDescription>Kelola daftar peralatan medis</CardDescription>
              </CardHeader>
              <CardContent>
                <DevicesManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="units">
            <Card>
              <CardHeader>
                <CardTitle>Manajemen Unit</CardTitle>
                <CardDescription>Kelola daftar unit/ruangan</CardDescription>
              </CardHeader>
              <CardContent>
                <UnitsManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requests">
            <Card>
              <CardHeader>
                <CardTitle>Manajemen Permintaan</CardTitle>
                <CardDescription>
                  Kelola permintaan maintenance dari pengguna
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RequestsManagement />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
