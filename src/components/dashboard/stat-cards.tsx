import { Card, CardContent } from "../ui/card";

interface StatCardProps {
  label: string;
  count: number;
  className?: string; // For background color
}

interface DashboardStatsProps {
  stats: {
    pending: number;
    approved: number;
    rejected: number;
    completed: number;
  };
}

function StatCard({ label, count, className }: StatCardProps) {
  return (
    <Card className={`border-none shadow-md text-white ${className}`}>
      <CardContent className="p-6">
        <div className="text-lg font-medium opacity-90">{label}</div>
        <div className="text-5xl font-bold mt-2">{count}</div>
      </CardContent>
    </Card>
  );
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Pengajuan (Requests) - Orange/Salmon */}
      <StatCard
        label="Pengajuan"
        count={stats.pending}
        className="bg-[#FFA07A]"
      />

      {/* Disetujui (Approved) - Green */}
      <StatCard
        label="Disetujui"
        count={stats.approved}
        className="bg-[#4CAF50]"
      />

      {/* Ditolak (Rejected) - Red */}
      <StatCard
        label="Ditolak"
        count={stats.rejected}
        className="bg-[#D32F2F]"
      />

      {/* Selesai (Completed) - Blue */}
      <StatCard
        label="Selesai"
        count={stats.completed}
        className="bg-[#42A5F5]"
      />
    </div>
  );
}
