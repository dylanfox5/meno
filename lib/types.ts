export interface ScriptureReference {
  book: string;
  chapter: number;
  startVerse?: number; // Optional for whole chapters (e.g., "Romans 8")
  endVerse?: number;
  endChapter?: number; // For chapter ranges like Matthew 5-7
}

export interface JournalEntry {
  id: string;
  user_id: string;
  title: string;
  content: string | null;
  scripture: ScriptureReference[] | null;
  type: "Life" | "Scripture";
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface JournalEntryDraft {
  title: string;
  content?: string | null;
  scripture?: ScriptureReference[] | null;
  type?: "Life" | "Scripture";
  tags?: string[];
}

export type CreateJournalEntry = Omit<
  JournalEntry,
  "id" | "user_id" | "created_at" | "updated_at"
>;

export type UpdateJournalEntry = Partial<CreateJournalEntry>;

// Bible Reading types
export interface BibleReading {
  id: string;
  user_id: string;
  reading_date: string; // ISO date string (YYYY-MM-DD)
  scripture: ScriptureReference[];
  created_at: string;
  updated_at: string;
}

export interface BibleReadingDraft {
  reading_date: string; // ISO date string (YYYY-MM-DD)
  scripture: ScriptureReference[];
}

export type CreateBibleReading = Omit<
  BibleReading,
  "id" | "user_id" | "created_at" | "updated_at"
>;

export type UpdateBibleReading = Partial<CreateBibleReading>;

// Heatmap data structure
export interface ReadingHeatmapDay {
  date: string; // ISO date string
  count: number; // Number of readings that day
  readings: BibleReading[]; // Actual reading records
}
