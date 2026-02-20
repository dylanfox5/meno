"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import type { JournalEntry, JournalEntryDraft } from "@/lib/types";
import type { ScriptureReference } from "@/lib/scripture-utils";
import { JournalEditor } from "@/components/dashboard/journal-editor";
import {
  getJournalEntries,
  createJournalEntry,
  updateJournalEntry,
  deleteJournalEntry,
} from "@/app/journal/actions";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

interface JournalContextType {
  entries: JournalEntry[];
  isLoading: boolean;
  openEditor: (entry?: JournalEntry | null, initialScripture?: ScriptureReference[]) => void;
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
  const [initialScripture, setInitialScripture] = useState<ScriptureReference[]>([]);
  const hasLoadedRef = useRef(false);
  const previousAuthStateRef = useRef<boolean | null>(null);

  const refreshEntries = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getJournalEntries();
      setEntries(data);
      hasLoadedRef.current = true;
    } catch (error) {
      console.error("Error loading journal entries:", error);
      toast.error("Failed to load journal entries");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const supabase = createClient();

    const checkAuthAndLoad = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const isAuthenticated = !!session;

      // Only fetch if:
      // 1. We haven't loaded yet, OR
      // 2. Auth state changed from unauthenticated to authenticated
      const authStateChanged =
        previousAuthStateRef.current === false && isAuthenticated;

      if (isAuthenticated && (!hasLoadedRef.current || authStateChanged)) {
        await refreshEntries();
      } else if (!isAuthenticated) {
        setEntries([]);
        setIsLoading(false);
        hasLoadedRef.current = false;
      }

      previousAuthStateRef.current = isAuthenticated;
    };

    checkAuthAndLoad();
  }, [refreshEntries]);

  useEffect(() => {
    const supabase = createClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT") {
        setEntries([]);
        setIsLoading(false);
        hasLoadedRef.current = false;
        previousAuthStateRef.current = false;
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const openEditor = useCallback((entry?: JournalEntry | null, scripture?: ScriptureReference[]) => {
    setSelectedEntry(entry || null);
    setInitialScripture(scripture || []);
    setEditorOpen(true);
  }, []);

  const closeEditor = useCallback(() => {
    setEditorOpen(false);
    setSelectedEntry(null);
    setInitialScripture([]);
  }, []);

  const saveEntry = useCallback(
    async (draft: JournalEntryDraft, id?: string) => {
      try {
        if (id) {
          const result = await updateJournalEntry(id, draft);
          if (result.error) {
            toast.error("Failed to update entry", {
              description: result.error,
            });
            return;
          }
          if (result.data) {
            setEntries((prev) =>
              prev.map((e) => (e.id === id ? result.data! : e))
            );
            toast.success("Entry updated successfully");
          }
        } else {
          const result = await createJournalEntry({
            title: draft.title,
            content: draft.content || null,
            scripture: draft.scripture || null,
            type: draft.type || "Life",
            tags: draft.tags || [],
          });
          if (result.error) {
            toast.error("Failed to create entry", {
              description: result.error,
            });
            return;
          }
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
    },
    [closeEditor]
  );

  const deleteEntry = useCallback(
    async (id: string) => {
      try {
        const result = await deleteJournalEntry(id);
        if (result.error) {
          toast.error("Failed to delete entry", {
            description: result.error,
          });
          return;
        }
        setEntries((prev) => prev.filter((e) => e.id !== id));
        toast.success("Entry deleted successfully");
        if (selectedEntry?.id === id) {
          closeEditor();
        }
      } catch (error) {
        console.error("Error deleting entry:", error);
        toast.error("An unexpected error occurred");
      }
    },
    [selectedEntry?.id, closeEditor]
  );

  return (
    <JournalContext.Provider
      value={{
        entries,
        isLoading,
        openEditor,
        closeEditor,
        saveEntry,
        deleteEntry,
        refreshEntries,
      }}
    >
      {children}
      <JournalEditor
        entry={selectedEntry}
        initialScripture={initialScripture}
        open={editorOpen}
        onOpenChange={(open) => {
          if (!open) closeEditor();
        }}
        onSave={saveEntry}
      />
    </JournalContext.Provider>
  );
}
