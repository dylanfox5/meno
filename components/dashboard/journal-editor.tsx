"use client";

import { useState, useEffect } from "react";
import { BookOpen, Save, Plus, X, Sparkles } from "lucide-react";
import type { JournalEntry, JournalEntryDraft } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { TiptapEditor } from "../editor/tiptap-editor";
import { getRandomPrompt } from "@/lib/prompts";
import { toast } from "sonner";
import type { ScriptureReference } from "@/lib/scripture-utils";
import { ScriptureInput } from "../scripture/scripture-input";

interface JournalEditorProps {
  entry?: JournalEntry | null;
  initialScripture?: ScriptureReference[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (entry: JournalEntryDraft, id?: string) => void;
}

export function JournalEditor({
  entry,
  initialScripture = [],
  open,
  onOpenChange,
  onSave,
}: JournalEditorProps) {
  const [title, setTitle] = useState(entry?.title || "");
  const [content, setContent] = useState(entry?.content || "");
  const [scripture, setScripture] = useState<ScriptureReference[]>(
    entry?.scripture || []
  );
  const [type, setType] = useState<"Life" | "Scripture">(entry?.type || "Life");
  const [tags, setTags] = useState<string[]>(entry?.tags || []);
  const [newTag, setNewTag] = useState("");
  const [currentPrompt, setCurrentPrompt] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setTitle(entry?.title || "");
      setContent(entry?.content || "");
      setScripture(entry?.scripture || initialScripture);
      setType(entry?.type || (initialScripture.length > 0 ? "Scripture" : "Life"));
      setTags(entry?.tags || []);
      setNewTag("");
      setCurrentPrompt(null);
    }
  }, [entry, open]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSave = () => {
    if (!content.trim()) return;

    onSave(
      {
        title: title.trim() || "Untitled Entry",
        content: content.trim(),
        scripture: scripture.length > 0 ? scripture : undefined,
        type,
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

  const handleGetPrompt = () => {
    const prompt = getRandomPrompt(type);
    setCurrentPrompt(prompt);
    toast.success("Prompt generated!", {
      description: "Use this to inspire your journaling",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="mx-4 sm:mx-0 sm:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col p-0"
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
          <div className="flex gap-3">
            <Input
              placeholder="Entry Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex-1 min-w-0 text-lg border-0 focus-visible:ring-0 placeholder:text-muted-foreground/60 shadow-none"
            />
            <Select
              value={type}
              onValueChange={(value: "Life" | "Scripture") => setType(value)}
            >
              <SelectTrigger className="w-28 shrink-0">
                <SelectValue placeholder="Entry type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Life">Life</SelectItem>
                <SelectItem value="Scripture">Scripture</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <p className="text-xs text-muted-foreground -mt-2">
            {type === "Scripture"
              ? "Reflections on a specific passage or reading"
              : "General life observations, prayers, or thoughts"}
          </p>

          <div className="px-3 py-3 rounded-lg bg-muted/50 border border-border">
            <ScriptureInput value={scripture} onChange={setScripture} />
          </div>

          {/* Prompt inspiration section */}
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleGetPrompt}
              className="shrink-0 h-auto py-2"
            >
              <Sparkles className="w-4 h-4 mr-1.5" />
              Get Prompt
            </Button>
            {currentPrompt && (
              <div className="flex-1 px-3 py-2 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-sm text-foreground italic leading-relaxed">
                  {currentPrompt}
                </p>
              </div>
            )}
          </div>

          {/* Replace the Textarea with TiptapEditor */}
          <div className="flex-1">
            <TiptapEditor
              content={content || ""}
              onChange={(newContent) => setContent(newContent)}
              placeholder="What is God teaching you today? Write your thoughts, prayers, and reflections here..."
              autoFocus={true}
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
