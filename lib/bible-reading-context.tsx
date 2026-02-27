"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type {
  BibleReading,
  BibleReadingDraft,
  ReadingHeatmapDay,
} from "@/lib/types";
import {
  getBibleReadings,
  createBibleReading,
  updateBibleReading,
  deleteBibleReading,
} from "@/app/bible-intake/actions";
import { toast } from "sonner";

interface BibleReadingContextType {
  readings: BibleReading[];
  heatmapData: ReadingHeatmapDay[];
  isLoading: boolean;
  saveReading: (draft: BibleReadingDraft, id?: string) => Promise<void>;
  deleteReading: (id: string) => Promise<void>;
  refreshReadings: () => Promise<void>;
}

const BibleReadingContext = createContext<BibleReadingContextType | null>(null);

export function useBibleReading() {
  const context = useContext(BibleReadingContext);
  if (!context) {
    throw new Error(
      "useBibleReading must be used within a BibleReadingProvider"
    );
  }
  return context;
}

// Generate heatmap data for the last 365 days
function generateHeatmapData(readings: BibleReading[]): ReadingHeatmapDay[] {
  const today = new Date();
  const heatmapDays: ReadingHeatmapDay[] = [];

  // Create a map of date -> readings for quick lookup
  const readingsByDate = new Map<string, BibleReading[]>();
  readings.forEach((reading) => {
    const dateKey = reading.reading_date;
    if (!readingsByDate.has(dateKey)) {
      readingsByDate.set(dateKey, []);
    }
    readingsByDate.get(dateKey)!.push(reading);
  });

  // Generate last 365 days
  for (let i = 364; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

    const dayReadings = readingsByDate.get(dateString) || [];

    heatmapDays.push({
      date: dateString,
      count: dayReadings.length,
      readings: dayReadings,
    });
  }

  return heatmapDays;
}

export function BibleReadingProvider({ children }: { children: ReactNode }) {
  const [readings, setReadings] = useState<BibleReading[]>([]);
  const [heatmapData, setHeatmapData] = useState<ReadingHeatmapDay[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshReadings = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getBibleReadings();
      setReadings(data);
      setHeatmapData(generateHeatmapData(data));
    } catch (error) {
      console.error("Error loading Bible readings:", error);
      toast.error("Failed to load Bible readings");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshReadings();
  }, [refreshReadings]);

  const saveReading = useCallback(
    async (draft: BibleReadingDraft, id?: string) => {
      try {
        if (id) {
          const result = await updateBibleReading(id, draft);
          if (result.error) {
            toast.error("Failed to update reading", {
              description: result.error,
            });
            return;
          }
          if (result.data) {
            setReadings((prev) =>
              prev.map((r) => (r.id === id ? result.data! : r))
            );
            setHeatmapData((prev) =>
              generateHeatmapData(
                prev
                  .flatMap((d) => d.readings)
                  .map((r) => (r.id === id ? result.data! : r))
              )
            );
            toast.success("Reading updated successfully");
          }
        } else {
          const result = await createBibleReading(draft);
          if (result.error) {
            toast.error("Failed to save reading", {
              description: result.error,
            });
            return;
          }
          if (result.data) {
            const newReadings = [result.data, ...readings];
            setReadings(newReadings);
            setHeatmapData(generateHeatmapData(newReadings));
            toast.success("Reading saved successfully");
          }
        }
      } catch (error) {
        console.error("Error saving reading:", error);
        toast.error("An unexpected error occurred");
      }
    },
    [readings]
  );

  const deleteReading = useCallback(
    async (id: string) => {
      try {
        const result = await deleteBibleReading(id);
        if (result.error) {
          toast.error("Failed to delete reading", {
            description: result.error,
          });
          return;
        }
        const newReadings = readings.filter((r) => r.id !== id);
        setReadings(newReadings);
        setHeatmapData(generateHeatmapData(newReadings));
        toast.success("Reading deleted successfully");
      } catch (error) {
        console.error("Error deleting reading:", error);
        toast.error("An unexpected error occurred");
      }
    },
    [readings]
  );

  return (
    <BibleReadingContext.Provider
      value={{
        readings,
        heatmapData,
        isLoading,
        saveReading,
        deleteReading,
        refreshReadings,
      }}
    >
      {children}
    </BibleReadingContext.Provider>
  );
}
