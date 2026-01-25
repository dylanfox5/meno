"use client";

import { useState, useEffect } from "react";
import { BookOpen, Save, Plus, X } from "lucide-react";
import type { JournalEntry, JournalEntryDraft } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface JournalEditorProps {
  entry?: JournalEntry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (entry: JournalEntryDraft, id?: string) => void;
}

export function JournalEditor({
  entry,
  open,
  onOpenChange,
  onSave,
}: JournalEditorProps) {
  const [title, setTitle] = useState(entry?.title || "");
  const [content, setContent] = useState(entry?.content || "");
  const [scripture, setScripture] = useState(entry?.scripture || "");
  const [tags, setTags] = useState<string[]>(entry?.tags || []);
  const [newTag, setNewTag] = useState("");

  useEffect(() => {
    if (open) {
      setTitle(entry?.title || "");
      setContent(entry?.content || "");
      setScripture(entry?.scripture || "");
      setTags(entry?.tags || []);
      setNewTag("");
    }
  }, [entry, open]);

  const handleSave = () => {
    if (!content.trim()) return;

    onSave(
      {
        title: title.trim() || "Untitled Entry",
        content: content.trim(),
        scripture: scripture.trim() || undefined,
        tags,
      },
      entry?.id
    );

    onOpenChange(false);
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col p-0"
        showCloseButton={false}
      >
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl">
              {entry ? "Edit Entry" : "New Journal Entry"}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="text-muted-foreground"
              >
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave} disabled={!content.trim()}>
                <Save className="w-4 h-4 mr-1.5" />
                Save
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          <div>
            <Input
              placeholder="Entry Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg border-0 focus-visible:ring-0 placeholder:text-muted-foreground/60 shadow-none"
            />
          </div>

          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/50 border border-border">
            <BookOpen className="w-4 h-4 text-primary shrink-0" />
            <Input
              placeholder="Scripture reference (e.g., John 3:16)"
              value={scripture}
              onChange={(e) => setScripture(e.target.value)}
              className="border-0 bg-transparent h-auto focus-visible:ring-0 text-sm shadow-none"
            />
          </div>

          <div className="flex-1">
            <Textarea
              placeholder="What is God teaching you today? Write your thoughts, prayers, and reflections here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[250px] resize-none shadow-none leading-relaxed border-0 focus-visible:ring-0 placeholder:text-muted-foreground/60"
            />
          </div>

          <div className="pt-2 border-t border-border">
            <div className="flex flex-wrap items-center gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1 pr-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
              <div className="flex items-center gap-1">
                <Input
                  placeholder="Add tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addTag();
                    }
                  }}
                  className="w-24 h-7 text-sm border-dashed"
                />
                {newTag.trim() && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={addTag}
                    className="h-7 w-7 p-0"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
