"use client";

import Link from "next/link";
import { useMemo } from "react";
import { format } from "date-fns";
import {
  Book,
  PenLine,
  Sun,
  Flame,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useJournal } from "@/lib/journal-context";
import { useBibleReading } from "@/lib/bible-reading-context";
import { usePrayer } from "@/lib/prayer-context";
import { LogReadingDialog } from "@/components/bible-intake/log-reading-dialog";
import { formatScriptureReferences } from "@/lib/scripture-utils";

const verses = [
  { text: "Be still, and know that I am God.", reference: "Psalm 46:10" },
  {
    text: "Your word is a lamp to my feet and a light to my path.",
    reference: "Psalm 119:105",
  },
  {
    text: "Draw near to God, and he will draw near to you.",
    reference: "James 4:8",
  },
  { text: "Trust in the Lord with all your heart.", reference: "Proverbs 3:5" },
  {
    text: "The Lord is my shepherd; I shall not want.",
    reference: "Psalm 23:1",
  },
];

function getTimeOfDay(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

function localDateString(date: Date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function calculateReadingStreak(readingDates: Set<string>): number {
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    if (readingDates.has(localDateString(d))) {
      streak++;
    } else if (streak > 0) {
      break;
    }
  }
  return streak;
}

export function DashboardContent() {
  const { entries, isLoading: journalLoading, openEditor } = useJournal();
  const { readings, isLoading: bibleLoading } = useBibleReading();
  const { requests, isLoading: prayerLoading } = usePrayer();

  const isLoading = journalLoading || bibleLoading || prayerLoading;

  const { todaysReadings, todaysEntries, activeRequests, groupsActive, stats, today } =
    useMemo(() => {
      const today = new Date();
      const todayStr = localDateString(today);

      const todaysReadings = readings.filter((r) => r.reading_date === todayStr);

      const todayStart = new Date(today);
      todayStart.setHours(0, 0, 0, 0);
      const todaysEntries = entries.filter((e) => {
        const d = new Date(e.created_at);
        d.setHours(0, 0, 0, 0);
        return d.getTime() === todayStart.getTime();
      });

      const activeRequests = requests.filter((r) => !r.is_answered);
      const groupsActive = [
        ...new Set(activeRequests.map((r) => r.group_name)),
      ];

      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      const readingsThisWeek = readings.filter(
        (r) => new Date(r.reading_date + "T00:00:00") >= weekAgo
      ).length;
      const journalThisWeek = entries.filter(
        (e) => new Date(e.created_at) >= weekAgo
      ).length;
      const readingDates = new Set(readings.map((r) => r.reading_date));
      const readingStreak = calculateReadingStreak(readingDates);
      const answeredCount = requests.filter((r) => r.is_answered).length;

      return {
        today,
        todaysReadings,
        todaysEntries,
        activeRequests,
        groupsActive,
        stats: { readingsThisWeek, journalThisWeek, readingStreak, answeredCount },
      };
    }, [readings, entries, requests]);

  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );
  const verse = verses[dayOfYear % verses.length];

  const hasReadToday = todaysReadings.length > 0;
  const hasJournaledToday = todaysEntries.length > 0;

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
        <div className="rounded-xl p-6">
          <Skeleton className="h-4 w-40 mb-2" />
          <Skeleton className="h-8 w-56 mb-2" />
          <Skeleton className="h-4 w-80" />
          <div className="mt-5 pt-5 border-t border-border">
            <Skeleton className="h-6 w-full max-w-lg mb-2" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
        <div>
          <Skeleton className="h-4 w-32 mb-3" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-36 rounded-xl" />
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-lg" />
                  <div className="space-y-1.5">
                    <Skeleton className="h-6 w-8" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-6">
      {/* Welcome */}
      <div className="rounded-xl p-6 bg-parchment border border-parchment-border">
        <p className="text-sm text-muted-foreground mb-1">
          {format(today, "EEEE, MMMM d, yyyy")}
        </p>
        <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground mb-2">
          Good {getTimeOfDay()}, friend
        </h1>
        <p className="text-muted-foreground max-w-xl">
          Read the Word, meditate on it, and bring it to prayer.
        </p>
        <div className="mt-5 pt-5 border-t border-parchment-border">
          <p className="font-serif text-lg text-foreground italic leading-relaxed">
            {`"${verse.text}"`}
          </p>
          <p className="text-sm text-scripture font-medium mt-2">
            — {verse.reference}
          </p>
        </div>
      </div>

      {/* Today's Practice */}
      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
          Today&rsquo;s Practice
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Bible */}
          <Card className={hasReadToday ? "border-primary/40" : ""}>
            <CardContent className="p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-primary/10">
                    <Book className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium">Bible</span>
                </div>
                {hasReadToday && (
                  <Badge
                    variant="secondary"
                    className="text-xs bg-primary/10 text-primary"
                  >
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Done
                  </Badge>
                )}
              </div>

              {hasReadToday ? (
                <>
                  <p className="text-sm text-scripture font-medium leading-snug">
                    {formatScriptureReferences(
                      todaysReadings.flatMap((r) => r.scripture)
                    )}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="w-full justify-between text-xs text-muted-foreground px-0 h-auto"
                  >
                    <Link href="/bible-intake">
                      View all <ArrowRight className="w-3 h-3" />
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">
                    Start with the Word today.
                  </p>
                  <LogReadingDialog
                    trigger={
                      <Button size="sm" className="w-full">
                        Log Reading
                      </Button>
                    }
                  />
                </>
              )}
            </CardContent>
          </Card>

          {/* Journal */}
          <Card className={hasJournaledToday ? "border-chart-2/40" : ""}>
            <CardContent className="p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-chart-2/10">
                    <PenLine className="w-4 h-4 text-chart-2" />
                  </div>
                  <span className="text-sm font-medium">Journal</span>
                </div>
                {hasJournaledToday && (
                  <Badge
                    variant="secondary"
                    className="text-xs bg-chart-2/10 text-chart-2"
                  >
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Done
                  </Badge>
                )}
              </div>

              {hasJournaledToday ? (
                <>
                  <p className="text-sm font-serif font-medium text-foreground truncate">
                    {todaysEntries[0].title || "Untitled Entry"}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="w-full justify-between text-xs text-muted-foreground px-0 h-auto"
                  >
                    <Link href="/journal">
                      View all <ArrowRight className="w-3 h-3" />
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">
                    Meditate on what you&rsquo;ve read.
                  </p>
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => openEditor()}
                  >
                    Write
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Prayer */}
          <Card>
            <CardContent className="p-4 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-chart-3/10">
                    <Sun className="w-4 h-4 text-chart-3" />
                  </div>
                  <span className="text-sm font-medium">Prayer</span>
                </div>
                {activeRequests.length > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {activeRequests.length} active
                  </Badge>
                )}
              </div>

              {activeRequests.length > 0 ? (
                <>
                  <p className="text-sm text-muted-foreground">
                    {groupsActive.join(" · ")}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="w-full justify-between text-xs text-muted-foreground px-0 h-auto"
                  >
                    <Link href="/prayer">
                      Go to prayer <ArrowRight className="w-3 h-3" />
                    </Link>
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">
                    Bring your requests before God.
                  </p>
                  <Button size="sm" variant="outline" className="w-full" asChild>
                    <Link href="/prayer">Open Prayer</Link>
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          {
            label: "Reading Streak",
            value: stats.readingStreak,
            icon: Flame,
            color: "text-chart-3",
            bgColor: "bg-chart-3/10",
          },
          {
            label: "Read This Week",
            value: stats.readingsThisWeek,
            icon: Book,
            color: "text-primary",
            bgColor: "bg-primary/10",
          },
          {
            label: "Journal This Week",
            value: stats.journalThisWeek,
            icon: PenLine,
            color: "text-chart-2",
            bgColor: "bg-chart-2/10",
          },
          {
            label: "Prayers Answered",
            value: stats.answeredCount,
            icon: CheckCircle2,
            color: "text-amber-600",
            bgColor: "bg-amber-100 dark:bg-amber-900/30",
          },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-foreground">
                    {stat.value}
                  </p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
