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

// Binary color - either read or not read
function getColorClass(hasReading: boolean): string {
  return hasReading
    ? "bg-primary hover:bg-primary/80"
    : "bg-muted hover:bg-muted/80";
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
        <div className="hidden sm:flex gap-[3px] mb-2 ml-8">
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

        <div className="flex gap-[2px] sm:gap-[3px]">
          {/* Day labels - hide on very small screens */}
          <div className="hidden sm:flex flex-col gap-[3px] text-xs text-muted-foreground mr-2">
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
            <div className="flex gap-[2px] sm:gap-[3px]">
              {weeks.map((week, weekIndex) => (
                <div
                  key={weekIndex}
                  className="flex flex-col gap-[2px] sm:gap-[3px]"
                >
                  {week.map((day, dayIndex) => {
                    if (!day.date) {
                      return (
                        <div
                          key={dayIndex}
                          className="w-[10px] h-[10px] sm:w-[12px] sm:h-[12px] rounded-sm"
                        />
                      );
                    }

                    const hasReading = day.count > 0;
                    const colorClass = getColorClass(hasReading);

                    return (
                      <Tooltip key={day.date}>
                        <TooltipTrigger asChild>
                          <button
                            className={`w-[10px] h-[10px] sm:w-[12px] sm:h-[12px] rounded-sm transition-colors ${colorClass}`}
                            aria-label={`${
                              hasReading ? "Read" : "No reading"
                            } on ${format(new Date(day.date), "MMM d, yyyy")}`}
                          />
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs">
                          <div className="space-y-1">
                            <p className="font-semibold">
                              {format(new Date(day.date), "EEEE, MMMM d, yyyy")}
                            </p>
                            {hasReading ? (
                              <div className="space-y-1">
                                <p className="text-xs text-muted-foreground">
                                  {day.count} reading
                                  {day.count !== 1 ? "s" : ""}
                                </p>
                                {day.readings.map((reading) => (
                                  <p key={reading.id} className="text-xs">
                                    {formatScriptureReferences(
                                      reading.scripture
                                    )}
                                  </p>
                                ))}
                              </div>
                            ) : (
                              <p className="text-xs text-muted-foreground">
                                No reading
                              </p>
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

        {/* Legend - Binary version */}
        <div className="flex items-center gap-2 mt-3 sm:mt-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div className="w-[10px] h-[10px] sm:w-[12px] sm:h-[12px] rounded-sm bg-muted" />
              <span>No reading</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-[10px] h-[10px] sm:w-[12px] sm:h-[12px] rounded-sm bg-primary" />
              <span>Read</span>
            </div>
          </div>
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
