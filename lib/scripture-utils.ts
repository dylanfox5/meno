// lib/scripture-utils.ts

export interface ScriptureReference {
  book: string;
  chapter: number;
  startVerse?: number; // Optional for whole chapters
  endVerse?: number;
  endChapter?: number; // For chapter ranges like Matthew 5-7
}

// Complete list of Bible books
export const BIBLE_BOOKS = [
  // Old Testament
  "Genesis",
  "Exodus",
  "Leviticus",
  "Numbers",
  "Deuteronomy",
  "Joshua",
  "Judges",
  "Ruth",
  "1 Samuel",
  "2 Samuel",
  "1 Kings",
  "2 Kings",
  "1 Chronicles",
  "2 Chronicles",
  "Ezra",
  "Nehemiah",
  "Esther",
  "Job",
  "Psalms",
  "Proverbs",
  "Ecclesiastes",
  "Song of Solomon",
  "Isaiah",
  "Jeremiah",
  "Lamentations",
  "Ezekiel",
  "Daniel",
  "Hosea",
  "Joel",
  "Amos",
  "Obadiah",
  "Jonah",
  "Micah",
  "Nahum",
  "Habakkuk",
  "Zephaniah",
  "Haggai",
  "Zechariah",
  "Malachi",
  // New Testament
  "Matthew",
  "Mark",
  "Luke",
  "John",
  "Acts",
  "Romans",
  "1 Corinthians",
  "2 Corinthians",
  "Galatians",
  "Ephesians",
  "Philippians",
  "Colossians",
  "1 Thessalonians",
  "2 Thessalonians",
  "1 Timothy",
  "2 Timothy",
  "Titus",
  "Philemon",
  "Hebrews",
  "James",
  "1 Peter",
  "2 Peter",
  "1 John",
  "2 John",
  "3 John",
  "Jude",
  "Revelation",
];

// Common abbreviations mapping
export const BOOK_ABBREVIATIONS: Record<string, string> = {
  // Old Testament
  gen: "Genesis",
  "ge.": "Genesis",
  exo: "Exodus",
  "ex.": "Exodus",
  lev: "Leviticus",
  "le.": "Leviticus",
  num: "Numbers",
  "nu.": "Numbers",
  deu: "Deuteronomy",
  "de.": "Deuteronomy",
  deut: "Deuteronomy",
  jos: "Joshua",
  josh: "Joshua",
  jdg: "Judges",
  judg: "Judges",
  rut: "Ruth",
  "ru.": "Ruth",
  "1sa": "1 Samuel",
  "1sam": "1 Samuel",
  "1 sam": "1 Samuel",
  "2sa": "2 Samuel",
  "2sam": "2 Samuel",
  "2 sam": "2 Samuel",
  "1ki": "1 Kings",
  "1kgs": "1 Kings",
  "1 kings": "1 Kings",
  "2ki": "2 Kings",
  "2kgs": "2 Kings",
  "2 kings": "2 Kings",
  "1ch": "1 Chronicles",
  "1chr": "1 Chronicles",
  "1 chr": "1 Chronicles",
  "2ch": "2 Chronicles",
  "2chr": "2 Chronicles",
  "2 chr": "2 Chronicles",
  ezr: "Ezra",
  neh: "Nehemiah",
  "ne.": "Nehemiah",
  est: "Esther",
  "es.": "Esther",
  psa: "Psalms",
  ps: "Psalms",
  psalm: "Psalms",
  pro: "Proverbs",
  prov: "Proverbs",
  "pr.": "Proverbs",
  ecc: "Ecclesiastes",
  eccl: "Ecclesiastes",
  "ec.": "Ecclesiastes",
  son: "Song of Solomon",
  "ss.": "Song of Solomon",
  sos: "Song of Solomon",
  "song of songs": "Song of Solomon",
  isa: "Isaiah",
  "is.": "Isaiah",
  jer: "Jeremiah",
  "je.": "Jeremiah",
  lam: "Lamentations",
  "la.": "Lamentations",
  eze: "Ezekiel",
  ezek: "Ezekiel",
  "ez.": "Ezekiel",
  dan: "Daniel",
  "da.": "Daniel",
  hos: "Hosea",
  "ho.": "Hosea",
  joe: "Joel",
  "jl.": "Joel",
  amo: "Amos",
  "am.": "Amos",
  oba: "Obadiah",
  "ob.": "Obadiah",
  jon: "Jonah",
  "jnh.": "Jonah",
  mic: "Micah",
  "mi.": "Micah",
  nah: "Nahum",
  "na.": "Nahum",
  hab: "Habakkuk",
  "hb.": "Habakkuk",
  zep: "Zephaniah",
  zeph: "Zephaniah",
  "zp.": "Zephaniah",
  hag: "Haggai",
  "hg.": "Haggai",
  zec: "Zechariah",
  zech: "Zechariah",
  "zc.": "Zechariah",
  mal: "Malachi",
  "ml.": "Malachi",
  // New Testament
  mat: "Matthew",
  matt: "Matthew",
  "mt.": "Matthew",
  mar: "Mark",
  mrk: "Mark",
  "mk.": "Mark",
  luk: "Luke",
  "lu.": "Luke",
  joh: "John",
  "jn.": "John",
  act: "Acts",
  "ac.": "Acts",
  rom: "Romans",
  "ro.": "Romans",
  "1co": "1 Corinthians",
  "1cor": "1 Corinthians",
  "1 cor": "1 Corinthians",
  "2co": "2 Corinthians",
  "2cor": "2 Corinthians",
  "2 cor": "2 Corinthians",
  gal: "Galatians",
  "ga.": "Galatians",
  eph: "Ephesians",
  "ep.": "Ephesians",
  phi: "Philippians",
  phil: "Philippians",
  "ph.": "Philippians",
  col: "Colossians",
  "co.": "Colossians",
  "1th": "1 Thessalonians",
  "1thess": "1 Thessalonians",
  "1 thess": "1 Thessalonians",
  "2th": "2 Thessalonians",
  "2thess": "2 Thessalonians",
  "2 thess": "2 Thessalonians",
  "1ti": "1 Timothy",
  "1tim": "1 Timothy",
  "1 tim": "1 Timothy",
  "2ti": "2 Timothy",
  "2tim": "2 Timothy",
  "2 tim": "2 Timothy",
  tit: "Titus",
  "ti.": "Titus",
  phm: "Philemon",
  "pm.": "Philemon",
  heb: "Hebrews",
  "he.": "Hebrews",
  jas: "James",
  jam: "James",
  "jm.": "James",
  "1pe": "1 Peter",
  "1pet": "1 Peter",
  "1 pet": "1 Peter",
  "2pe": "2 Peter",
  "2pet": "2 Peter",
  "2 pet": "2 Peter",
  "1jo": "1 John",
  "1jn": "1 John",
  "1 john": "1 John",
  "2jo": "2 John",
  "2jn": "2 John",
  "2 john": "2 John",
  "3jo": "3 John",
  "3jn": "3 John",
  "3 john": "3 John",
  jud: "Jude",
  "jd.": "Jude",
  rev: "Revelation",
  "re.": "Revelation",
};

/**
 * Normalize a book name by checking abbreviations
 */
export function normalizeBookName(input: string): string | null {
  const normalized = input.trim();

  // Check if it's already a full book name
  if (BIBLE_BOOKS.includes(normalized)) {
    return normalized;
  }

  // Check abbreviations (case-insensitive)
  const lowerInput = normalized.toLowerCase();
  if (BOOK_ABBREVIATIONS[lowerInput]) {
    return BOOK_ABBREVIATIONS[lowerInput];
  }

  // Try to find a partial match
  const match = BIBLE_BOOKS.find((book) =>
    book.toLowerCase().startsWith(lowerInput)
  );

  return match || null;
}

/**
 * Format a scripture reference as a readable string
 */
export function formatScriptureReference(ref: ScriptureReference): string {
  // Whole chapter range (e.g., Matthew 5-7)
  if (ref.endChapter && !ref.startVerse) {
    return `${ref.book} ${ref.chapter}-${ref.endChapter}`;
  }

  // Whole single chapter (e.g., Romans 8)
  if (!ref.startVerse) {
    return `${ref.book} ${ref.chapter}`;
  }

  // Chapter range with verses (e.g., Matthew 5:1-7:29)
  if (ref.endChapter && ref.endChapter !== ref.chapter) {
    return `${ref.book} ${ref.chapter}:${ref.startVerse}-${ref.endChapter}:${ref.endVerse}`;
  }

  // Verse range within same chapter (e.g., John 3:16-18)
  const verses = ref.endVerse
    ? `${ref.startVerse}-${ref.endVerse}`
    : `${ref.startVerse}`;

  return `${ref.book} ${ref.chapter}:${verses}`;
}

/**
 * Format multiple scripture references as a comma-separated string
 */
export function formatScriptureReferences(refs: ScriptureReference[]): string {
  return refs.map(formatScriptureReference).join(", ");
}

/**
 * Parse a scripture reference string into structured data
 * Supports:
 * - "Romans 8" (whole chapter)
 * - "Genesis 1-3" (chapter range)
 * - "John 3:16" (single verse)
 * - "Genesis 1:1-5" (verse range)
 * - "Matthew 5:1-7:29" (chapter range with verses)
 */
export function parseScriptureReference(
  input: string
): ScriptureReference | null {
  const trimmed = input.trim();

  // Try to find where the book name ends and the reference begins
  // We'll try to match the longest possible book name first

  let bookName: string | null = null;
  let refPart = "";

  // Sort books by length (longest first) to match longer names first
  const sortedBooks = [...BIBLE_BOOKS].sort((a, b) => b.length - a.length);

  // Try to match full book names first
  for (const book of sortedBooks) {
    const bookLower = book.toLowerCase();
    const inputLower = trimmed.toLowerCase();

    if (inputLower.startsWith(bookLower)) {
      // Check if there's a space or digit after the book name
      const afterBook = trimmed.substring(book.length).trim();
      if (afterBook.length > 0 && /^[\d\s-:]/.test(afterBook)) {
        bookName = book;
        refPart = afterBook;
        break;
      }
    }
  }

  // If no full book name matched, try abbreviations
  if (!bookName) {
    // Try matching abbreviations
    const words = trimmed.split(/\s+/);

    // Try 1-3 words for book abbreviation
    for (
      let wordCount = Math.min(3, words.length);
      wordCount >= 1;
      wordCount--
    ) {
      const potentialBook = words.slice(0, wordCount).join(" ");
      const normalized = normalizeBookName(potentialBook);

      if (normalized) {
        bookName = normalized;
        refPart = words.slice(wordCount).join(" ").trim();
        break;
      }
    }
  }

  if (!bookName) {
    return null;
  }

  // Now parse the reference part
  if (!refPart) {
    return null;
  }

  // Pattern 1: Whole chapter range (e.g., "5-7")
  const chapterRangePattern = /^(\d+)\s*-\s*(\d+)$/;
  const chapterRangeMatch = refPart.match(chapterRangePattern);
  if (chapterRangeMatch) {
    return {
      book: bookName,
      chapter: parseInt(chapterRangeMatch[1], 10),
      endChapter: parseInt(chapterRangeMatch[2], 10),
    };
  }

  // Pattern 2: Single whole chapter (e.g., "8")
  const wholeChapterPattern = /^(\d+)$/;
  const wholeChapterMatch = refPart.match(wholeChapterPattern);
  if (wholeChapterMatch) {
    return {
      book: bookName,
      chapter: parseInt(wholeChapterMatch[1], 10),
    };
  }

  // Pattern 3: Chapter with verses (e.g., "3:16" or "3:16-18" or "5:1-7:29")
  const versePattern =
    /^(\d+)\s*:\s*(\d+)(?:\s*-\s*(\d+)\s*:\s*(\d+)|\s*-\s*(\d+))?$/;
  const verseMatch = refPart.match(versePattern);
  if (verseMatch) {
    const chapter = parseInt(verseMatch[1], 10);
    const startVerse = parseInt(verseMatch[2], 10);

    // Check for chapter range with verses (e.g., 5:1-7:29)
    if (verseMatch[3] && verseMatch[4]) {
      const endChapter = parseInt(verseMatch[3], 10);
      const endVerse = parseInt(verseMatch[4], 10);

      return {
        book: bookName,
        chapter,
        startVerse,
        endChapter,
        endVerse,
      };
    }

    // Check for verse range within same chapter (e.g., 3:16-18)
    if (verseMatch[5]) {
      const endVerse = parseInt(verseMatch[5], 10);
      return {
        book: bookName,
        chapter,
        startVerse,
        endVerse,
      };
    }

    // Single verse
    return {
      book: bookName,
      chapter,
      startVerse,
    };
  }

  return null;
}
