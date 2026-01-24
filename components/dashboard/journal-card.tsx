"use client";

import { format } from "date-fns";
import { BookOpen, MoreHorizontal, Trash2 } from "lucide-react";
import type { JournalEntry } from "@/lib/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface JournalCardProps {
  entry: JournalEntry;
  onSelect: (entry: JournalEntry) => void;
  onDelete: (id: string) => void;
}

export function JournalCard({ entry, onSelect, onDelete }: JournalCardProps) {
  const preview =
    entry.content.slice(0, 150) + (entry.content.length > 150 ? "..." : "");

  return (
    <Card
      className="cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/30"
      onClick={() => onSelect(entry)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-serif text-lg font-medium text-foreground truncate">
              {entry.title || "Untitled Entry"}
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              {format(entry.createdAt, "MMMM d, yyyy")}
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(entry.id);
                }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {entry.scripture && (
          <div className="flex items-center gap-1.5 text-sm text-primary mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span className="font-medium">{entry.scripture}</span>
          </div>
        )}
        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
          {preview}
        </p>
        {entry.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {entry.tags.slice(0, 3).map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="text-xs font-normal"
              >
                {tag}
              </Badge>
            ))}
            {entry.tags.length > 3 && (
              <Badge variant="secondary" className="text-xs font-normal">
                +{entry.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
