"use client";

import { useState } from "react";
import { Calendar, Plus, X } from "lucide-react";
import type { ScriptureReference } from "@/lib/types";
import {
  parseScriptureReference,
  formatScriptureReference,
} from "@/lib/scripture-utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useBibleReading } from "@/lib/bible-reading-context";

function localDateString(date: Date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

interface LogReadingDialogProps {
  trigger?: React.ReactNode;
}

export function LogReadingDialog({ trigger }: LogReadingDialogProps) {
  const { saveReading } = useBibleReading();
  const [open, setOpen] = useState(false);
  const [scripture, setScripture] = useState<ScriptureReference[]>([]);
  const [readingDate, setReadingDate] = useState(() => localDateString());
  const [quickInput, setQuickInput] = useState("");
  const [parseError, setParseError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleQuickAdd = () => {
    if (!quickInput.trim()) return;

    const parsed = parseScriptureReference(quickInput);
    if (parsed) {
      setScripture([...scripture, parsed]);
      setQuickInput("");
      setParseError(null);
    } else {
      setParseError("Could not parse. Try: Book Chapter:Verse");
    }
  };

  const handleRemove = (index: number) => {
    setScripture(scripture.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleQuickAdd();
    }
  };

  const handleSave = async () => {
    if (scripture.length === 0) return;

    setIsSaving(true);
    try {
      await saveReading({
        reading_date: readingDate,
        scripture,
      });
      // Reset form and close dialog
      setScripture([]);
      setQuickInput("");
      setReadingDate(localDateString());
      setOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Log Reading
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Log Bible Reading
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="reading-date">Date</Label>
            <Input
              id="reading-date"
              type="date"
              value={readingDate}
              onChange={(e) => setReadingDate(e.target.value)}
              max={localDateString()}
            />
          </div>

          <div className="space-y-2">
            <Label>What did you read?</Label>

            {/* Display added references */}
            {scripture.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {scripture.map((ref, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="gap-1.5 pr-1 py-1"
                  >
                    {formatScriptureReference(ref)}
                    <button
                      type="button"
                      onClick={() => handleRemove(index)}
                      className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Quick input */}
            <div className="flex gap-2">
              <Input
                placeholder="e.g., John 3:16 or Romans 8:28-39"
                value={quickInput}
                onChange={(e) => {
                  setQuickInput(e.target.value);
                  setParseError(null);
                }}
                onKeyDown={handleKeyDown}
                className="flex-1"
              />
              <Button
                type="button"
                size="icon"
                variant="outline"
                onClick={handleQuickAdd}
                disabled={!quickInput.trim()}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {parseError && (
              <p className="text-xs text-destructive">{parseError}</p>
            )}

            <p className="text-xs text-muted-foreground">
              Type scripture reference and press Enter or click +
            </p>
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={scripture.length === 0 || isSaving}
              className="flex-1"
            >
              {isSaving ? "Saving..." : "Save Reading"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
