"use client";

import { useState, useMemo } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { JournalCard } from "./journal-card";
import { EmptyState } from "./empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useJournal } from "@/lib/journal-context";
import { formatScriptureReferences } from "@/lib/scripture-utils";

export function JournalDashboard() {
  const { entries, isLoading, openEditor, deleteEntry } = useJournal();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEntries = useMemo(() => {
    if (!searchQuery.trim()) return entries;
    const query = searchQuery.toLowerCase();
    return entries.filter(
      (entry) =>
        entry.title.toLowerCase().includes(query) ||
        entry.content?.toLowerCase().includes(query) ||
        (entry.scripture && Array.isArray(entry.scripture)
          ? formatScriptureReferences(entry.scripture)
              .toLowerCase()
              .includes(query)
          : false) ||
        entry.tags?.some((tag) => tag.toLowerCase().includes(query))
    );
  }, [entries, searchQuery]);

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 max-w-4xl mx-auto">
        {/* Header skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="space-y-2">
            <Skeleton className="h-8 w-40" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-9 w-28" />
        </div>
        {/* Search bar skeleton */}
        <Skeleton className="h-10 w-full mb-6" />
        {/* Cards skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-xl border border-border p-4 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="h-4 w-12" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-semibold text-foreground">
            Your Journal
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {entries.length === 0
              ? "Start your faith journey"
              : `${entries.length} ${
                  entries.length === 1 ? "entry" : "entries"
                }`}
          </p>
        </div>
        <Button onClick={() => openEditor()} className="gap-1.5">
          <Plus className="w-4 h-4" />
          New Entry
        </Button>
      </div>

      {/* Only show search if there are entries */}
      {entries.length > 0 && (
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search entries by title, content, or scripture..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
      )}

      {/* Entries List */}
      {entries.length === 0 ? (
        <EmptyState onCreateNew={() => openEditor()} />
      ) : filteredEntries.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-muted-foreground mb-4">
            No entries found matching "{searchQuery}"
          </p>
          <Button variant="outline" onClick={() => setSearchQuery("")}>
            Clear search
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredEntries.map((entry) => (
            <JournalCard
              key={entry.id}
              entry={entry}
              onSelect={openEditor}
              onDelete={deleteEntry}
            />
          ))}
        </div>
      )}
    </div>
  );
}
