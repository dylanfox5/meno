"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { JournalEntry, JournalEntryDraft } from "@/lib/types";
import { JournalEditor } from "@/components/dashboard/journal-editor";

// Sample data - in production this would come from a database
const initialEntries: JournalEntry[] = [
  {
    id: "1",
    title: "Finding Peace in Uncertainty",
    content:
      "Today I found myself reflecting on Isaiah 55:8-9. In times of uncertainty, it's easy to feel overwhelmed by what we cannot control. But these verses remind me that God's ways are higher than my ways, and His thoughts higher than my thoughts.\n\nI'm learning to release my need for control and trust in His perfect plan. Even when I can't see the path ahead, I can rest in knowing that He sees it all.",
    scripture: "Isaiah 55:8-9",
    tags: ["trust", "peace", "surrender"],
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 86400000),
  },
  {
    id: "2",
    title: "Morning Gratitude",
    content:
      "This is the day that the Lord has made; let us rejoice and be glad in it.\n\nI woke up this morning with a heart full of gratitude. Sometimes we forget to thank God for the simple blessings - the breath in our lungs, the roof over our heads, the people who love us.\n\nToday I choose joy. Today I choose gratitude.",
    scripture: "Psalm 118:24",
    tags: ["gratitude", "morning", "joy"],
    createdAt: new Date(Date.now() - 172800000),
    updatedAt: new Date(Date.now() - 172800000),
  },
  {
    id: "3",
    title: "Lessons from the Sermon on the Mount",
    content:
      "Reading through the Beatitudes this morning, I was struck by how countercultural Jesus's teachings are. Blessed are the meek? Blessed are those who mourn? The world tells us to be strong, to never show weakness.\n\nBut Jesus invites us into a different kind of strength - one rooted in humility, compassion, and dependence on God.",
    scripture: "Matthew 5:1-12",
    tags: ["beatitudes", "humility", "teaching"],
    createdAt: new Date(Date.now() - 345600000),
    updatedAt: new Date(Date.now() - 345600000),
  },
];

interface JournalContextType {
  entries: JournalEntry[];
  openEditor: (entry?: JournalEntry | null) => void;
  closeEditor: () => void;
  saveEntry: (draft: JournalEntryDraft, id?: string) => void;
  deleteEntry: (id: string) => void;
}

const JournalContext = createContext<JournalContextType | null>(null);

export function useJournal() {
  const context = useContext(JournalContext);
  if (!context) {
    throw new Error("useJournal must be used within a JournalProvider");
  }
  return context;
}

export function JournalProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<JournalEntry[]>(initialEntries);
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);

  const openEditor = useCallback((entry?: JournalEntry | null) => {
    setSelectedEntry(entry || null);
    setEditorOpen(true);
  }, []);

  const closeEditor = useCallback(() => {
    setEditorOpen(false);
    setSelectedEntry(null);
  }, []);

  const saveEntry = useCallback((draft: JournalEntryDraft, id?: string) => {
    if (id) {
      setEntries((prev) =>
        prev.map((e) =>
          e.id === id ? { ...e, ...draft, updatedAt: new Date() } : e
        )
      );
    } else {
      const newEntry: JournalEntry = {
        id: crypto.randomUUID(),
        ...draft,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setEntries((prev) => [newEntry, ...prev]);
    }
    setSelectedEntry(null);
  }, []);

  const deleteEntry = useCallback((id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    if (selectedEntry?.id === id) {
      setSelectedEntry(null);
      setEditorOpen(false);
    }
  }, [selectedEntry?.id]);

  return (
    <JournalContext.Provider
      value={{ entries, openEditor, closeEditor, saveEntry, deleteEntry }}
    >
      {children}
      <JournalEditor
        entry={selectedEntry}
        open={editorOpen}
        onOpenChange={(open) => {
          if (!open) closeEditor();
        }}
        onSave={saveEntry}
      />
    </JournalContext.Provider>
  );
}
