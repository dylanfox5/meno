export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  scripture?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export type JournalEntryDraft = Omit<JournalEntry, 'id' | 'createdAt' | 'updatedAt'>;
