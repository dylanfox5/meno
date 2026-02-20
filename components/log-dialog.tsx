"use client";

import { useState } from "react";
import { BookOpen, Calendar, Plus, X, PenLine, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useBibleReading } from "@/lib/bible-reading-context";
import { useJournal } from "@/lib/journal-context";
import {
  parseScriptureReference,
  formatScriptureReference,
} from "@/lib/scripture-utils";
import type { ScriptureReference } from "@/lib/scripture-utils";

interface LogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LogDialog({ open, onOpenChange }: LogDialogProps) {
  const { saveReading } = useBibleReading();
  const { openEditor } = useJournal();

  const [step, setStep] = useState<1 | 2>(1);
  const [scripture, setScripture] = useState<ScriptureReference[]>([]);
  const [readingDate, setReadingDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );
  const [quickInput, setQuickInput] = useState("");
  const [parseError, setParseError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const reset = () => {
    setStep(1);
    setScripture([]);
    setReadingDate(new Date().toISOString().split("T")[0]);
    setQuickInput("");
    setParseError(null);
    setIsSaving(false);
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) reset();
    onOpenChange(next);
  };

  const handleQuickAdd = () => {
    if (!quickInput.trim()) return;
    const parsed = parseScriptureReference(quickInput);
    if (parsed) {
      setScripture((prev) => [...prev, parsed]);
      setQuickInput("");
      setParseError(null);
    } else {
      setParseError('Couldn\'t parse that. Try: "John 3:16", "Romans 8", or "Psalm 23:1-6"');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleQuickAdd();
    }
  };

  const handleRemove = (index: number) => {
    setScripture((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveReading = async () => {
    if (scripture.length === 0) return;
    setIsSaving(true);
    try {
      await saveReading({ reading_date: readingDate, scripture });
      setStep(2);
    } finally {
      setIsSaving(false);
    }
  };

  const handleJournalYes = () => {
    handleOpenChange(false);
    openEditor(null, scripture);
  };

  const handleJournalNo = () => {
    handleOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        {step === 1 ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                Log Bible Reading
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 pt-2">
              <div className="space-y-2">
                <Label htmlFor="reading-date">Date</Label>
                <Input
                  id="reading-date"
                  type="date"
                  value={readingDate}
                  onChange={(e) => setReadingDate(e.target.value)}
                  max={new Date().toISOString().split("T")[0]}
                />
              </div>

              <div className="space-y-2">
                <Label>What did you read?</Label>

                {scripture.length > 0 && (
                  <div className="flex flex-wrap gap-2">
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

                <div className="flex gap-2">
                  <Input
                    placeholder="e.g., John 3:16 or Romans 8"
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
                  Type a reference and press Enter or click +
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => handleOpenChange(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveReading}
                  disabled={scripture.length === 0 || isSaving}
                  className="flex-1"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Reading"
                  )}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <PenLine className="w-5 h-5 text-primary" />
                Meditate on what you read?
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 pt-2">
              <p className="text-sm text-muted-foreground">
                Your reading has been logged. Would you like to journal your
                reflections on what you read?
              </p>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleJournalNo}
                  className="flex-1"
                >
                  Not now
                </Button>
                <Button onClick={handleJournalYes} className="flex-1">
                  <PenLine className="w-4 h-4 mr-1.5" />
                  Journal it
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
