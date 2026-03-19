"use client";

import { useState, useEffect } from "react";
import { Sun, Plus } from "lucide-react";
import type { PrayerRequest, PrayerRequestDraft, PrayerGroup } from "@/lib/types";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePrayer } from "@/lib/prayer-context";

const GROUPS: PrayerGroup[] = ["Family", "Friends", "Church", "World", "Self"];

interface AddPrayerDialogProps {
  request?: PrayerRequest;
  initialGroup?: PrayerGroup;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AddPrayerDialog({
  request,
  initialGroup,
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: AddPrayerDialogProps) {
  const { savePrayerRequest } = usePrayer();
  const [internalOpen, setInternalOpen] = useState(false);
  const [group, setGroup] = useState<PrayerGroup>(
    request?.group_name ?? initialGroup ?? "Family"
  );
  const [subject, setSubject] = useState(request?.subject ?? "");
  const [requestText, setRequestText] = useState(request?.request ?? "");
  const [isSaving, setIsSaving] = useState(false);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen! : internalOpen;
  const setIsOpen = isControlled ? controlledOnOpenChange! : setInternalOpen;

  const isEditMode = !!request;

  useEffect(() => {
    if (isOpen) {
      if (request) {
        setGroup(request.group_name);
        setSubject(request.subject);
        setRequestText(request.request);
      } else {
        setGroup(initialGroup ?? "Family");
        setSubject("");
        setRequestText("");
      }
    }
  }, [isOpen, request, initialGroup]);

  const handleSave = async () => {
    if (!subject.trim() || !requestText.trim()) return;

    setIsSaving(true);
    try {
      const draft: PrayerRequestDraft = {
        group_name: group,
        subject: subject.trim(),
        request: requestText.trim(),
      };
      await savePrayerRequest(draft, request?.id);
      setIsOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : !isControlled ? (
        <DialogTrigger asChild>
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            New Prayer
          </Button>
        </DialogTrigger>
      ) : null}
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sun className="w-5 h-5 text-primary" />
            {isEditMode ? "Edit Prayer Request" : "New Prayer Request"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="prayer-group">Group</Label>
            <Select
              value={group}
              onValueChange={(v) => setGroup(v as PrayerGroup)}
            >
              <SelectTrigger id="prayer-group">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {GROUPS.map((g) => (
                  <SelectItem key={g} value={g}>
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="prayer-subject">Subject</Label>
            <Input
              id="prayer-subject"
              placeholder="e.g., Mom's health"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="prayer-request">Prayer Request</Label>
            <Textarea
              id="prayer-request"
              placeholder="What would you like to pray for?"
              value={requestText}
              onChange={(e) => setRequestText(e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={!subject.trim() || !requestText.trim() || isSaving}
              className="flex-1"
            >
              {isSaving
                ? "Saving..."
                : isEditMode
                  ? "Save Changes"
                  : "Add Prayer"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
