"use client";

import Link from "next/link";
import { useMemo } from "react";
import { format } from "date-fns";
import { ArrowRight, BookOpen, Calendar, Flame, PenLine } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useJournal } from "@/lib/journal-context";
import { EmptyState } from "@/components/dashboard/empty-state";

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

export function DashboardContent() {
  const { entries, isLoading, openEditor } = useJournal();
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000
  );
  const verse = verses[dayOfYear % verses.length];

  const stats = useMemo(() => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thisWeek = entries.filter(
      (e) => new Date(e.created_at) >= weekAgo
    ).length;
    const scriptureCount = entries.filter((e) => e.scripture).length;

    let streak = 0;
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(todayDate.getTime() - i * 86400000);
      const hasEntry = entries.some((e) => {
        const entryDate = new Date(e.created_at);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === checkDate.getTime();
      });
      if (hasEntry) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }

    return {
      totalEntries: entries.length,
      thisWeek,
      streak,
      scriptureCount,
    };
  }, [entries]);

  const statItems = [
    {
      label: "Total Entries",
      value: stats.totalEntries,
      icon: PenLine,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "This Week",
      value: stats.thisWeek,
      icon: Calendar,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      label: "Day Streak",
      value: stats.streak,
      icon: Flame,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
    {
      label: "With Scripture",
      value: stats.scriptureCount,
      icon: BookOpen,
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
    },
  ];

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Loading your entries...</p>
        </div>
      </div>
    );
  }

  // Show empty state if no entries
  if (entries.length === 0) {
    return (
      <div className="p-4 sm:p-6 max-w-4xl mx-auto">
        {/* Welcome Section */}
        <div className="rounded-xl p-6 mb-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                {format(today, "EEEE, MMMM d, yyyy")}
              </p>
              <h1 className="text-2xl sm:text-3xl font-semibold text-foreground mb-2 text-balance">
                Good {getTimeOfDay()}, friend
              </h1>
              <p className="text-muted-foreground max-w-xl">
                Welcome to Meno. Take a moment to pause, reflect, and connect
                with God through journaling.
              </p>
            </div>
          </div>

          <div className="mt-5 pt-5 border-t border-border">
            <p className=" text-lg text-foreground italic leading-relaxed">
              {`"${verse.text}"`}
            </p>
            <p className="text-sm text-primary font-medium mt-2">
              — {verse.reference}
            </p>
          </div>
        </div>

        {/* Empty State */}
        <EmptyState onCreateNew={() => openEditor()} />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      {/* Welcome Section */}
      <div className="rounded-xl p-6 mb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">
              {format(today, "EEEE, MMMM d, yyyy")}
            </p>
            <h1 className=" text-2xl sm:text-3xl font-semibold text-foreground mb-2 text-balance">
              Good {getTimeOfDay()}, friend
            </h1>
            <p className="text-muted-foreground max-w-xl">
              Take a moment to pause, reflect, and connect with God through your
              journaling today.
            </p>
          </div>
        </div>

        <div className="mt-5 pt-5 border-t border-border">
          <p className=" text-lg text-foreground italic leading-relaxed">
            {`"${verse.text}"`}
          </p>
          <p className="text-sm text-primary font-medium mt-2">
            — {verse.reference}
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {statItems.map((stat) => (
          <Card key={stat.label} className="border-border">
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

      {/* Recent Entries */}
      <div className="rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className=" text-xl font-semibold text-foreground">
            Recent Entries
          </h2>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/journal" className="gap-1.5">
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        <div className="space-y-3">
          {entries.slice(0, 3).map((entry) => (
            <button
              type="button"
              key={entry.id}
              onClick={() => openEditor(entry)}
              className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-accent/50 transition-colors group text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <PenLine className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
                    {entry.title}
                  </h3>
                  {entry.scripture && (
                    <p className="text-xs text-muted-foreground">
                      {entry.scripture}
                    </p>
                  )}
                </div>
              </div>
              <span className="text-xs text-muted-foreground">
                {format(new Date(entry.created_at), "MMM d")}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <Button onClick={() => openEditor()} className="w-full">
            Start a New Entry
          </Button>
        </div>
      </div>
    </div>
  );
}
