"use client";

import { format, startOfWeek, addDays } from "date-fns";
import type { BibleReading } from "@/lib/types";
import { formatScriptureReferences } from "@/lib/scripture-utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface WeekViewProps {
  readings: BibleReading[];
  weekStart?: Date; // Defaults to current week
}

interface DayData {
  date: Date;
  dayName: string;
  dayLetter: string;
  hasReading: boolean;
  readings: BibleReading[];
}

export function WeekView({ readings, weekStart }: WeekViewProps) {
  // Get the start of the week (Sunday)
  const weekStartDate =
    weekStart || startOfWeek(new Date(), { weekStartsOn: 0 });

  // Generate 7 days of data
  const weekDays: DayData[] = [];
  for (let i = 0; i < 7; i++) {
    const currentDate = addDays(weekStartDate, i);
    const dateString = format(currentDate, "yyyy-MM-dd");

    // Find readings for this day
    const dayReadings = readings.filter((r) => r.reading_date === dateString);

    weekDays.push({
      date: currentDate,
      dayName: format(currentDate, "EEE"), // Sun, Mon, etc.
      dayLetter: format(currentDate, "EEEEE"), // S, M, T, etc.
      hasReading: dayReadings.length > 0,
      readings: dayReadings,
    });
  }

  return (
    <TooltipProvider delayDuration={100}>
      <div className="flex justify-center gap-2 sm:gap-4 py-4 sm:py-6">
        {weekDays.map((day) => (
          <Tooltip key={day.date.toISOString()}>
            <TooltipTrigger asChild>
              <button
                className="flex flex-col items-center gap-1.5 sm:gap-2 transition-transform hover:scale-110"
                aria-label={`${format(day.date, "MMMM d")}: ${
                  day.hasReading ? "Reading completed" : "No reading"
                }`}
              >
                {/* Circle - responsive sizing */}
                <div
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold transition-colors ${
                    day.hasReading
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {day.hasReading && "✓"}
                </div>

                {/* Day label - smaller on mobile */}
                <span className="text-xs font-medium text-muted-foreground">
                  {day.dayName}
                </span>
              </button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs">
              <div className="space-y-1.5">
                <p className="font-semibold text-sm">
                  {format(day.date, "EEEE, MMMM d")}
                </p>
                {day.hasReading ? (
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">
                      {day.readings.length} reading
                      {day.readings.length !== 1 ? "s" : ""}
                    </p>
                    {day.readings.map((reading) => (
                      <p key={reading.id} className="text-sm">
                        {formatScriptureReferences(reading.scripture)}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">
                    No reading yet
                  </p>
                )}
              </div>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
}
