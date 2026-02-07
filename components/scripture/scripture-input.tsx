"use client";

import { useState, useRef, useEffect } from "react";
import { BookOpen, X, Plus, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  BIBLE_BOOKS,
  formatScriptureReference,
  parseScriptureReference,
  normalizeBookName,
  type ScriptureReference,
} from "@/lib/scripture-utils";

interface ScriptureInputProps {
  value: ScriptureReference[];
  onChange: (references: ScriptureReference[]) => void;
}

export function ScriptureInput({ value, onChange }: ScriptureInputProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [selectedBook, setSelectedBook] = useState<string>("");
  const [chapter, setChapter] = useState("");
  const [startVerse, setStartVerse] = useState("");
  const [endVerse, setEndVerse] = useState("");
  const [bookSearchOpen, setBookSearchOpen] = useState(false);
  const [quickInput, setQuickInput] = useState("");
  const [parseError, setParseError] = useState<string | null>(null);

  const quickInputRef = useRef<HTMLInputElement>(null);

  // Reset form
  const resetForm = () => {
    setSelectedBook("");
    setChapter("");
    setStartVerse("");
    setEndVerse("");
    setQuickInput("");
    setParseError(null);
  };

  // Add reference from quick input (e.g., "John 3:16")
  const handleQuickAdd = () => {
    if (!quickInput.trim()) return;

    const parsed = parseScriptureReference(quickInput);
    if (parsed) {
      onChange([...value, parsed]);
      setQuickInput("");
      setParseError(null);
      setIsAdding(false);
    } else {
      setParseError(
        "Could not parse reference. Try format: Book Chapter:Verse"
      );
    }
  };

  // Add reference from structured form
  const handleStructuredAdd = () => {
    if (!selectedBook || !chapter || !startVerse) return;

    const newRef: ScriptureReference = {
      book: selectedBook,
      chapter: parseInt(chapter, 10),
      startVerse: parseInt(startVerse, 10),
      endVerse: endVerse ? parseInt(endVerse, 10) : undefined,
    };

    onChange([...value, newRef]);
    resetForm();
    setIsAdding(false);
  };

  // Remove a reference
  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  // Handle Enter key in quick input
  const handleQuickInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleQuickAdd();
    }
  };

  return (
    <div className="space-y-3">
      {/* Display existing references as badges */}
      <div className="flex flex-wrap items-center gap-2">
        {value.map((ref, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="gap-1.5 pr-1 py-1 text-sm font-normal"
          >
            <BookOpen className="w-3.5 h-3.5 text-primary" />
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

        {/* Add button */}
        {!isAdding && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsAdding(true)}
            className="h-8 text-xs"
          >
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add Scripture
          </Button>
        )}
      </div>

      {/* Add new reference form */}
      {isAdding && (
        <div className="p-4 rounded-lg border border-border bg-muted/30 space-y-3">
          {/* Quick input option */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Quick Add
            </label>
            <div className="flex gap-2">
              <Input
                ref={quickInputRef}
                placeholder="e.g., John 3:16 or Romans 8:28-39"
                value={quickInput}
                onChange={(e) => {
                  setQuickInput(e.target.value);
                  setParseError(null);
                }}
                onKeyDown={handleQuickInputKeyDown}
                className="flex-1"
              />
              <Button
                type="button"
                size="sm"
                onClick={handleQuickAdd}
                disabled={!quickInput.trim()}
              >
                <Check className="w-4 h-4" />
              </Button>
            </div>
            {parseError && (
              <p className="text-xs text-destructive">{parseError}</p>
            )}
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-muted/30 px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          {/* Structured input option */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              Build Reference
            </label>

            {/* Book selector */}
            <Popover open={bookSearchOpen} onOpenChange={setBookSearchOpen}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  role="combobox"
                  aria-expanded={bookSearchOpen}
                  className="w-full justify-between"
                >
                  {selectedBook || "Select book..."}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search books..." />
                  <CommandList>
                    <CommandEmpty>No book found.</CommandEmpty>
                    <CommandGroup>
                      {BIBLE_BOOKS.map((book) => (
                        <CommandItem
                          key={book}
                          value={book}
                          onSelect={() => {
                            setSelectedBook(book);
                            setBookSearchOpen(false);
                          }}
                        >
                          {book}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* Chapter and verse inputs */}
            <div className="grid grid-cols-3 gap-2">
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">Chapter</label>
                <Input
                  type="number"
                  min="1"
                  placeholder="1"
                  value={chapter}
                  onChange={(e) => setChapter(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">
                  Start Verse
                </label>
                <Input
                  type="number"
                  min="1"
                  placeholder="1"
                  value={startVerse}
                  onChange={(e) => setStartVerse(e.target.value)}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-muted-foreground">
                  End Verse (opt)
                </label>
                <Input
                  type="number"
                  min="1"
                  placeholder=""
                  value={endVerse}
                  onChange={(e) => setEndVerse(e.target.value)}
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsAdding(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleStructuredAdd}
                disabled={!selectedBook || !chapter || !startVerse}
              >
                Add Reference
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
