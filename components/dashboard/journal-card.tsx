"use client";

import { format } from "date-fns";
import { BookOpen, MoreHorizontal, Trash2, Heart, Book } from "lucide-react";
import type { JournalEntry } from "@/lib/types";
import { formatScriptureReferences } from "@/lib/scripture-utils";
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

function getTextPreview(html: string, maxLength: number = 150): string {
  if (!html) return "";

  let processed = html
    .replace(/<\/?(p|div|br|h[1-6]|li|tr)[^>]*>/gi, " $& ")
    .replace(/<li[^>]*>/gi, "• ")
    .replace(/<\/li>/gi, " ");

  const temp = document.createElement("div");
  temp.innerHTML = processed;
  const text = temp.textContent || temp.innerText || "";
  const cleaned = text.replace(/\s+/g, " ").trim();

  return cleaned.length > maxLength
    ? cleaned.slice(0, maxLength) + "..."
    : cleaned;
}

export function JournalCard({ entry, onSelect, onDelete }: JournalCardProps) {
  const preview = entry.content ? getTextPreview(entry.content) : "";
  const isScripture = entry.type === "Scripture";
  
  // Format scripture references for display with truncation
  const scriptureDisplay = 
    entry.scripture && Array.isArray(entry.scripture) && entry.scripture.length > 0
      ? (() => {
          const refs = entry.scripture;
          if (refs.length <= 3) {
            return formatScriptureReferences(refs);
          }
          // Show first 3 and indicate more
          const firstThree = formatScriptureReferences(refs.slice(0, 3));
          return `${firstThree} +${refs.length - 3} more`;
        })()
      : null;

  return (
    <Card
      className={`cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/30 border-l-4 ${
        isScripture ? "border-l-primary" : "border-l-muted-foreground/40"
      }`}
      onClick={() => onSelect(entry)}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge
                variant={isScripture ? "default" : "secondary"}
                className={`text-xs ${
                  isScripture
                    ? "bg-primary/10 text-primary hover:bg-primary/20"
                    : ""
                }`}
              >
                {isScripture ? (
                  <>
                    <Book className="w-3 h-3 mr-1" />
                    Scripture
                  </>
                ) : (
                  <>
                    <Heart className="w-3 h-3 mr-1" />
                    Life
                  </>
                )}
              </Badge>
            </div>
            <h3 className="text-lg font-medium text-foreground truncate">
              {entry.title || "Untitled Entry"}
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              {format(entry.created_at, "MMMM d, yyyy")}
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
      <CardContent className="px-6">
        {scriptureDisplay && (
          <div className="flex items-center gap-1.5 text-sm text-primary mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span className="font-medium">{scriptureDisplay}</span>
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