"use client";

import { useState } from "react";
import { format, getDay } from "date-fns";
import type { ReadingHeatmapDay } from "@/lib/types";
import { formatScriptureReferences } from "@/lib/scripture-utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ReadingHeatmapProps {
  data: ReadingHeatmapDay[];
}

// Get intensity level based on reading count
function getIntensityLevel(count: number): number {
  if (count === 0) return 0;
  if (count === 1) return 1;
  if (count === 2) return 2;
  if (count === 3) return 3;
  return 4; // 4+ readings
}

// Get color class based on intensity
function getColorClass(level: number): string {
  switch (level) {
    case 0:
      return "bg-muted hover:bg-muted/80";
    case 1:
      return "bg-emerald-200 dark:bg-emerald-900 hover:bg-emerald-300 dark:hover:bg-emerald-800";
    case 2:
      return "bg-emerald-400 dark:bg-emerald-700 hover:bg-emerald-500 dark:hover:bg-emerald-600";
    case 3:
      return "bg-emerald-600 dark:bg-emerald-600 hover:bg-emerald-700 dark:hover:bg-emerald-500";
    case 4:
      return "bg-emerald-800 dark:bg-emerald-400 hover:bg-emerald-900 dark:hover:bg-emerald-300";
    default:
      return "bg-muted";
  }
}

export function ReadingHeatmap({ data }: ReadingHeatmapProps) {
  // Group data into weeks (starting on Sunday)
  const weeks: ReadingHeatmapDay[][] = [];
  let currentWeek: ReadingHeatmapDay[] = [];

  // Pad beginning to start on Sunday
  const firstDayOfWeek = getDay(new Date(data[0].date));
  for (let i = 0; i < firstDayOfWeek; i++) {
    currentWeek.push({
      date: "",
      count: 0,
      readings: [],
    });
  }

  data.forEach((day, index) => {
    currentWeek.push(day);

    // If Sunday (or last day), start new week
    if (getDay(new Date(day.date)) === 6 || index === data.length - 1) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
  });

  const monthLabels = getMonthLabels(data);

  return (
    <div className="w-full overflow-x-auto">
      <div className="inline-block min-w-full">
        {/* Month labels */}
        <div className="flex gap-[3px] mb-2 ml-8">
          {monthLabels.map((label, i) => (
            <div
              key={i}
              className="text-xs text-muted-foreground"
              style={{ width: label.width }}
            >
              {label.name}
            </div>
          ))}
        </div>

        <div className="flex gap-[3px]">
          {/* Day labels */}
          <div className="flex flex-col gap-[3px] text-xs text-muted-foreground mr-2">
            <div className="h-[12px]"></div>
            <div className="h-[12px]">Mon</div>
            <div className="h-[12px]"></div>
            <div className="h-[12px]">Wed</div>
            <div className="h-[12px]"></div>
            <div className="h-[12px]">Fri</div>
            <div className="h-[12px]"></div>
          </div>

          {/* Heatmap grid */}
          <TooltipProvider delayDuration={0}>
            <div className="flex gap-[3px]">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-[3px]">
                  {week.map((day, dayIndex) => {
                    if (!day.date) {
                      return (
                        <div
                          key={dayIndex}
                          className="w-[12px] h-[12px] rounded-sm"
                        />
                      );
                    }

                    const intensity = getIntensityLevel(day.count);
                    const colorClass = getColorClass(intensity);

                    return (
                      <Tooltip key={day.date}>
                        <TooltipTrigger asChild>
                          <button
                            className={`w-[12px] h-[12px] rounded-sm transition-colors ${colorClass}`}
                            aria-label={`${day.count} reading${
                              day.count !== 1 ? "s" : ""
                            } on ${format(new Date(day.date), "MMM d, yyyy")}`}
                          />
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs">
                          <div className="space-y-1">
                            <p className="font-semibold">
                              {format(new Date(day.date), "EEEE, MMMM d, yyyy")}
                            </p>
                            {day.count === 0 ? (
                              <p className="text-xs text-muted-foreground">
                                No readings
                              </p>
                            ) : (
                              <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">
                                  {day.count} reading
                                  {day.count !== 1 ? "s" : ""}
                                </p>
                                {day.readings.map((reading, idx) => (
                                  <p key={reading.id} className="text-xs">
                                    {formatScriptureReferences(
                                      reading.scripture
                                    )}
                                  </p>
                                ))}
                              </div>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    );
                  })}
                </div>
              ))}
            </div>
          </TooltipProvider>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
          <span>Less</span>
          <div className="flex gap-1">
            {[0, 1, 2, 3, 4].map((level) => (
              <div
                key={level}
                className={`w-[12px] h-[12px] rounded-sm ${getColorClass(
                  level
                )}`}
              />
            ))}
          </div>
          <span>More</span>
        </div>
      </div>
    </div>
  );
}

// Helper to generate month labels
function getMonthLabels(data: ReadingHeatmapDay[]) {
  const labels: Array<{ name: string; width: string }> = [];
  let currentMonth = "";
  let weekCount = 0;

  data.forEach((day, index) => {
    const month = format(new Date(day.date), "MMM");
    const dayOfWeek = getDay(new Date(day.date));

    if (dayOfWeek === 0) weekCount++; // Count weeks on Sundays

    if (month !== currentMonth) {
      if (currentMonth && weekCount > 0) {
        labels.push({
          name: currentMonth,
          width: `${weekCount * 15}px`, // 12px cell + 3px gap
        });
      }
      currentMonth = month;
      weekCount = 0;
    }
  });

  // Add last month
  if (currentMonth && weekCount > 0) {
    labels.push({
      name: currentMonth,
      width: `${weekCount * 15}px`,
    });
  }

  return labels;
}
