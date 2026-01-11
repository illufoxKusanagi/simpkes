"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import {
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";

// --- Pie Chart Data: Alat Bermasalah ---
interface DashboardChartsProps {
  data: {
    device_name: string;
    applicant_date: string;
  }[];
}

export function DashboardCharts({ data }: DashboardChartsProps) {
  // --- Data Processing for Pie Chart ---
  const pieData = React.useMemo(() => {
    const counts: Record<string, number> = {};
    data.forEach((item) => {
      counts[item.device_name] = (counts[item.device_name] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([device, visitors], index) => ({
        device,
        visitors,
        fill: `var(--chart-${(index % 3) + 1})`,
      }))
      .sort((a, b) => b.visitors - a.visitors)
      .slice(0, 3);
  }, [data]);

  const pieConfig = React.useMemo(() => {
    const config: Record<string, { label: string; color: string }> = {
      visitors: { label: "Jumlah", color: "" },
    };
    pieData.forEach((item) => {
      config[item.device] = {
        label: item.device,
        color: item.fill,
      };
    });
    return config satisfies ChartConfig;
  }, [pieData]);

  const totalPieVisitors = React.useMemo(() => {
    return pieData.reduce((acc, curr) => acc + curr.visitors, 0);
  }, [pieData]);

  // --- Data Processing for Line Chart ---
  const lineData = React.useMemo(() => {
    // 1. Process raw data into a map by Month (YYYY-MM)
    const countsByMonth: Record<string, number> = {};

    data.forEach((item) => {
      const dateObj = new Date(item.applicant_date);
      if (!isNaN(dateObj.getTime())) {
        // Format: YYYY-MM
        const monthKey = dateObj.toISOString().slice(0, 7);
        countsByMonth[monthKey] = (countsByMonth[monthKey] || 0) + 1;
      }
    });

    // 2. Determine Date Range (Last 6 Months to Now)
    const result = [];
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(endDate.getMonth() - 5); // Go back 5 months (total 6 including current)
    startDate.setDate(1);

    // Loop through months
    const iterDate = new Date(startDate);
    // Be careful with loop condition to handle month wrapping correctly
    while (iterDate <= endDate || iterDate.getMonth() === endDate.getMonth()) {
      const monthKey = iterDate.toISOString().slice(0, 7);
      
      // Stop if we've gone past the current month (handled by loop condition, but double check)
      if (iterDate > endDate && iterDate.getMonth() !== endDate.getMonth()) break;

      result.push({
        date: monthKey, // "2024-01"
        requests: countsByMonth[monthKey] || 0,
      });
      
      // Increment month
      iterDate.setMonth(iterDate.getMonth() + 1);
    }

    return result;
  }, [data]);

  const lineConfig = {
    requests: {
      label: "Permohonan",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  const totalRequests = React.useMemo(() => {
    return lineData.reduce((acc, curr) => acc + curr.requests, 0);
  }, [lineData]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* --- Pie Chart Section --- */}
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle>Alat Bermasalah Aktif</CardTitle>
          <CardDescription>Distribusi berdasarkan jenis alat</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          {pieData.length > 0 ? (
            <ChartContainer
              config={pieConfig}
              className="mx-auto aspect-square max-h-75 [&_.recharts-text]:fill-background"
            >
              <PieChart>
                <ChartTooltip
                  content={<ChartTooltipContent nameKey="visitors" hideLabel />}
                />
                <Pie data={pieData} dataKey="visitors">
                  <LabelList
                    dataKey="device"
                    className="fill-background"
                    stroke="none"
                    fontSize={12}
                    formatter={(value: keyof typeof pieConfig) =>
                      pieConfig[value]?.label
                    }
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          ) : (
            <div className="flex h-62.5 items-center justify-center text-muted-foreground">
              Belum ada data
            </div>
          )}
        </CardContent>
        <CardFooter className="flex-col gap-2 text-sm">
          <div className="flex items-center gap-2 leading-none font-medium">
            Total {totalPieVisitors} alat dalam pemantauan{" "}
            <TrendingUp className="h-4 w-4" />
          </div>
          <div className="text-muted-foreground leading-none">
            5 Alat Teratas
          </div>
        </CardFooter>
      </Card>

      {/* --- Line Chart Section --- */}
      <Card className="flex flex-col">
        <CardHeader className="flex flex-col items-stretch border-b p-0! sm:flex-row">
          <div className="flex flex-1 flex-col justify-center gap-1 px-6 pb-3 sm:pb-0">
            <CardTitle>Tren Pengajuan</CardTitle>
            <CardDescription>Jumlah permohonan bulanan</CardDescription>
          </div>
          <div className="flex">
            <div className="flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left sm:border-t-0 sm:border-l sm:px-8 sm:py-6 bg-muted/50">
              <span className="text-muted-foreground text-xs">
                {lineConfig.requests.label}
              </span>
              <span className="text-lg leading-none font-bold sm:text-3xl">
                {totalRequests.toLocaleString()}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-2 sm:p-6">
          <ChartContainer
            config={lineConfig}
            className="aspect-auto h-62.5 w-full"
          >
            <LineChart
              accessibilityLayer
              data={lineData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value + "-01"); // Append day to make parsing consistent
                  return date.toLocaleDateString("id-ID", {
                    month: "short",
                    year: "numeric"
                  });
                }}
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-37.5"
                    nameKey="requests"
                    labelFormatter={(value) => {
                      return new Date(value + "-01").toLocaleDateString("id-ID", {
                        month: "long",
                        year: "numeric",
                      });
                    }}
                  />
                }
              />
              <Line
                dataKey="requests"
                type="monotone"
                stroke={lineConfig.requests.color}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
