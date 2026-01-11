import { MaintenanceRequestForm } from "@/components/forms/maintenance-form";
import { DashboardLayout } from "@/components/layout/dashboard-layout";

export default function RequestPage() {
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-muted/30 py-10 px-4">
        <div className="max-w-3xl mx-auto mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Layanan Perbaikan Aset
          </h1>
          <p className="text-muted-foreground">
            Formulir pengajuan perbaikan dan perbaikan alat kesehatan.
          </p>
        </div>

        <MaintenanceRequestForm />
      </div>
    </DashboardLayout>
  );
}
