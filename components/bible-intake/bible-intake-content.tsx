"use client";

import { format } from "date-fns";
import { BookOpen, Trash2 } from "lucide-react";
import { useBibleReading } from "@/lib/bible-reading-context";
import { formatScriptureReferences } from "@/lib/scripture-utils";
import { LogReadingDialog } from "@/components/bible-intake/log-reading-dialog";
import { ReadingHeatmap } from "@/components/bible-intake/reading-heatmap";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import type { ReadingHeatmapDay } from "@/lib/types";

export function BibleIntakeContent() {
  const { readings, heatmapData, isLoading, deleteReading } = useBibleReading();

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">
            Loading your Bible readings...
          </p>
        </div>
      </div>
    );
  }

  // Calculate stats
  const totalReadings = readings.length;
  const uniqueDays = new Set(readings.map((r) => r.reading_date)).size;
  const currentStreak = calculateStreak(heatmapData);
  const last30Days = readings.filter((r) => {
    const readingDate = new Date(r.reading_date);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return readingDate >= thirtyDaysAgo;
  }).length;

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-foreground mb-2">
            Bible Intake
          </h1>
          <p className="text-muted-foreground">
            Track your daily Bible reading and build a consistent habit
          </p>
        </div>
        <LogReadingDialog />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-semibold text-foreground">
              {totalReadings}
            </div>
            <p className="text-xs text-muted-foreground">Total Readings</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-semibold text-foreground">
              {uniqueDays}
            </div>
            <p className="text-xs text-muted-foreground">Days Read</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-semibold text-foreground">
              {currentStreak}
            </div>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-semibold text-foreground">
              {last30Days}
            </div>
            <p className="text-xs text-muted-foreground">Last 30 Days</p>
          </CardContent>
        </Card>
      </div>

      {/* Heatmap - Full Width */}
      <Card>
        <CardHeader>
          <CardTitle>Reading Activity</CardTitle>
          <p className="text-sm text-muted-foreground">
            Your Bible reading over the last 365 days
          </p>
        </CardHeader>
        <CardContent>
          <ReadingHeatmap data={heatmapData} />
        </CardContent>
      </Card>

      {/* Recent Readings */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Readings</CardTitle>
        </CardHeader>
        <CardContent>
          {readings.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-2">
                No readings logged yet
              </p>
              <p className="text-sm text-muted-foreground">
                Start by logging what you read today!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {readings.slice(0, 10).map((reading) => (
                <div
                  key={reading.id}
                  className="flex items-start justify-between gap-4 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary" className="text-xs">
                        {format(new Date(reading.reading_date), "MMM d, yyyy")}
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground">
                      {formatScriptureReferences(reading.scripture)}
                    </p>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="shrink-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Reading?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this Bible reading?
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteReading(reading.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Calculate current streak of consecutive days with readings
function calculateStreak(heatmapData: ReadingHeatmapDay[]): number {
  let streak = 0;
  const reversedData = [...heatmapData].reverse(); // Start from today

  for (const day of reversedData) {
    if (day.count > 0) {
      streak++;
    } else if (streak > 0) {
      // Only break if we've already started counting
      break;
    }
  }

  return streak;
}
