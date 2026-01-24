"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type { JournalEntry, JournalEntryDraft } from "@/lib/types";
import { JournalEditor } from "@/components/dashboard/journal-editor";
import { 
  getJournalEntries, 
  createJournalEntry, 
  updateJournalEntry, 
  deleteJournalEntry 
} from "@/app/journal/actions";
import { toast } from "sonner";

interface JournalContextType {
  entries: JournalEntry[];
  isLoading: boolean;
  openEditor: (entry?: JournalEntry | null) => void;
  closeEditor: () => void;
  saveEntry: (draft: JournalEntryDraft, id?: string) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  refreshEntries: () => Promise<void>;
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
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editorOpen, setEditorOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);

  // Fetch entries on mount
  const refreshEntries = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getJournalEntries();
      setEntries(data);
    } catch (error) {
      console.error("Error loading journal entries:", error);
      toast.error("Failed to load journal entries");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshEntries();
  }, [refreshEntries]);

  const openEditor = useCallback((entry?: JournalEntry | null) => {
    setSelectedEntry(entry || null);
    setEditorOpen(true);
  }, []);

  const closeEditor = useCallback(() => {
    setEditorOpen(false);
    setSelectedEntry(null);
  }, []);

  const saveEntry = useCallback(async (draft: JournalEntryDraft, id?: string) => {
    try {
      if (id) {
        // Update existing entry
        const result = await updateJournalEntry(id, draft);
        if (result.error) {
          toast.error("Failed to update entry", {
            description: result.error
          });
          return;
        }
        // Update local state optimistically
        if (result.data) {
          setEntries((prev) =>
            prev.map((e) => (e.id === id ? result.data! : e))
          );
          toast.success("Entry updated successfully");
        }
      } else {
        // Create new entry
        const result = await createJournalEntry({
          title: draft.title,
          content: draft.content || null,
          scripture: draft.scripture || null,
          type: draft.type || 'Life',
          tags: []
        });
        if (result.error) {
          toast.error("Failed to create entry", {
            description: result.error
          });
          return;
        }
        // Add new entry to local state
        if (result.data) {
          setEntries((prev) => [result.data!, ...prev]);
          toast.success("Entry created successfully");
        }
      }
      closeEditor();
    } catch (error) {
      console.error("Error saving entry:", error);
      toast.error("An unexpected error occurred");
    }
  }, [closeEditor]);

  const deleteEntry = useCallback(async (id: string) => {
    try {
      const result = await deleteJournalEntry(id);
      if (result.error) {
        toast.error("Failed to delete entry", {
          description: result.error
        });
        return;
      }
      // Remove from local state
      setEntries((prev) => prev.filter((e) => e.id !== id));
      toast.success("Entry deleted successfully");
      if (selectedEntry?.id === id) {
        closeEditor();
      }
    } catch (error) {
      console.error("Error deleting entry:", error);
      toast.error("An unexpected error occurred");
    }
  }, [selectedEntry?.id, closeEditor]);

  return (
    <JournalContext.Provider
      value={{ entries, isLoading, openEditor, closeEditor, saveEntry, deleteEntry, refreshEntries }}
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