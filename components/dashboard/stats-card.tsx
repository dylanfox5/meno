"use client";

import { BookOpen, Calendar, Flame, PenLine } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  totalEntries: number;
  thisWeek: number;
  streak: number;
  scriptureCount: number;
}

export function StatsCard({ totalEntries, thisWeek, streak, scriptureCount }: StatsCardProps) {
  const stats = [
    {
      label: "Total Entries",
      value: totalEntries,
      icon: PenLine,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "This Week",
      value: thisWeek,
      icon: Calendar,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      label: "Day Streak",
      value: streak,
      icon: Flame,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
    {
      label: "With Scripture",
      value: scriptureCount,
      icon: BookOpen,
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-border shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
