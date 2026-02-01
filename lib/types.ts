export interface JournalEntry {
  id: string;
  user_id: string;
  title: string;
  content: string | null;
  scripture: string | null;
  type: "Life" | "Scripture";
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface JournalEntryDraft {
  title: string;
  content?: string | null;
  scripture?: string | null;
  type?: "Life" | "Scripture";
  tags?: string[];
}

export type CreateJournalEntry = Omit<
  JournalEntry,
  "id" | "user_id" | "created_at" | "updated_at"
>;
export type UpdateJournalEntry = Partial<CreateJournalEntry>;
