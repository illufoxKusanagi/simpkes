import { DashboardCharts } from "@/components/dashboard/charts";
import { DashboardStats } from "@/components/dashboard/stat-cards";
import { db } from "@/lib/db";
import { maintenanceRequest } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const requests = await db.select().from(maintenanceRequest);

  const stats = {
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
    completed: requests.filter((r) => r.status === "completed").length,
  };

  const chartData = requests.map((r) => ({
    device_name: r.device_name,
    applicant_date: r.applicant_date.toString(),
  }));

  return (
    <div className="min-h-screen bg-background p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 md:mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tight uppercase">
              Dashboard
            </h1>
            <p className="text-sm font-medium text-muted-foreground mt-2">
              Sistem perbaikan dan perbaikan alat kesehatan
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-foreground">RSUD Caruban</p>
          </div>
        </div>

        {/* Stats Cards */}
        <DashboardStats stats={stats} />

        {/* Charts Section */}
        <DashboardCharts data={chartData} />

        {/* Note Section (Visual Match) */}
        <div className="bg-muted/50 rounded-lg p-6 border border-border">
          <h3 className="font-bold text-foreground mb-4">
            Status Pemeliharaan (Preview)
          </h3>
          <p className="text-sm text-muted-foreground">
            Table data is hidden as requested. Visit the full requests page for
            details.
          </p>
        </div>
      </div>
    </div>
  );
}
