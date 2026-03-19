"use client";

import { useState, useRef } from "react";
import { BookOpen, Calendar, Plus, X, PenLine, Loader2, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBibleReading } from "@/lib/bible-reading-context";
import { useJournal } from "@/lib/journal-context";
import { usePrayer } from "@/lib/prayer-context";
import {
  parseScriptureReference,
  formatScriptureReference,
} from "@/lib/scripture-utils";
import type { ScriptureReference } from "@/lib/scripture-utils";
import type { PrayerGroup } from "@/lib/types";

const PRAYER_GROUPS: PrayerGroup[] = ["Family", "Friends", "Church", "World", "Self"];

interface LogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LogDialog({ open, onOpenChange }: LogDialogProps) {
  const { saveReading } = useBibleReading();
  const { openEditor } = useJournal();
  const { savePrayerRequest } = usePrayer();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [scripture, setScripture] = useState<ScriptureReference[]>([]);
  const [readingDate, setReadingDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );
  const [quickInput, setQuickInput] = useState("");
  const [parseError, setParseError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // When closing to open the journal editor, skip the reset so state
  // is preserved for when the dialog reopens at step 3
  const skipResetRef = useRef(false);

  // Step 3: Prayer form state
  const [prayerGroup, setPrayerGroup] = useState<PrayerGroup>("Family");
  const [prayerSubject, setPrayerSubject] = useState("");
  const [prayerRequest, setPrayerRequest] = useState("");

  const reset = () => {
    if (skipResetRef.current) {
      skipResetRef.current = false;
      return;
    }
    setStep(1);
    setScripture([]);
    setReadingDate(new Date().toISOString().split("T")[0]);
    setQuickInput("");
    setParseError(null);
    setIsSaving(false);
    setPrayerGroup("Family");
    setPrayerSubject("");
    setPrayerRequest("");
  };

  const handleOpenChange = (next: boolean) => {
    if (!next) reset();
    onOpenChange(next);
  };

  const finish = () => {
    handleOpenChange(false);
  };

  // Step 1 handlers
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

  // Step 2 handlers
  const handleJournalYes = () => {
    // Close dialog (skip reset), open editor, reopen at step 3 when editor closes
    skipResetRef.current = true;
    onOpenChange(false);
    openEditor(null, scripture, () => {
      setStep(3);
      onOpenChange(true);
    });
  };

  const handleJournalNo = () => {
    // Stay in dialog, skip straight to prayer step
    setStep(3);
  };

  // Step 3 handlers
  const handlePrayerSave = async () => {
    if (!prayerSubject.trim() || !prayerRequest.trim()) return;
    setIsSaving(true);
    try {
      await savePrayerRequest({
        group_name: prayerGroup,
        subject: prayerSubject.trim(),
        request: prayerRequest.trim(),
      });
      finish();
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrayerSkip = () => {
    finish();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        {step === 1 && (
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
        )}

        {step === 2 && (
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

        {step === 3 && (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sun className="w-5 h-5 text-primary" />
                Anything to bring to prayer?
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 pt-2">
              <p className="text-sm text-muted-foreground">
                Would you like to add a prayer request?
              </p>

              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="log-prayer-group">Group</Label>
                  <Select
                    value={prayerGroup}
                    onValueChange={(v) => setPrayerGroup(v as PrayerGroup)}
                  >
                    <SelectTrigger id="log-prayer-group">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {PRAYER_GROUPS.map((g) => (
                        <SelectItem key={g} value={g}>
                          {g}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="log-prayer-subject">Subject</Label>
                  <Input
                    id="log-prayer-subject"
                    placeholder="e.g., Mom's health"
                    value={prayerSubject}
                    onChange={(e) => setPrayerSubject(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="log-prayer-request">Request</Label>
                  <Textarea
                    id="log-prayer-request"
                    placeholder="What would you like to pray for?"
                    value={prayerRequest}
                    onChange={(e) => setPrayerRequest(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <Button
                  variant="outline"
                  onClick={handlePrayerSkip}
                  className="flex-1"
                >
                  Not now
                </Button>
                <Button
                  onClick={handlePrayerSave}
                  disabled={
                    !prayerSubject.trim() || !prayerRequest.trim() || isSaving
                  }
                  className="flex-1"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Sun className="w-4 h-4 mr-1.5" />
                      Add Prayer
                    </>
                  )}
                </Button>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
