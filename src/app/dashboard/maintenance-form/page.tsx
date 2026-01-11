"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { MaintenanceRequestForm } from "@/components/forms/maintenance-form";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MaintenanceFormPage() {
  const { data: session, status } = useSession();
  // Auth handled by middleware

  if (status === "loading") {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Memuat...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <MaintenanceRequestForm />
      </div>
    </DashboardLayout>
  );
}
