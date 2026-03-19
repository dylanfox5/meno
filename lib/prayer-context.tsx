"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type { PrayerRequest, PrayerRequestDraft } from "@/lib/types";
import {
  getPrayerRequests,
  createPrayerRequest,
  updatePrayerRequest,
  deletePrayerRequest,
  markAnswered as markAnsweredAction,
} from "@/app/prayer/actions";
import { toast } from "sonner";

interface PrayerContextType {
  requests: PrayerRequest[];
  isLoading: boolean;
  savePrayerRequest: (draft: PrayerRequestDraft, id?: string) => Promise<void>;
  deletePrayerRequest: (id: string) => Promise<void>;
  markAnswered: (id: string) => Promise<void>;
  refreshRequests: () => Promise<void>;
}

const PrayerContext = createContext<PrayerContextType | null>(null);

export function usePrayer() {
  const context = useContext(PrayerContext);
  if (!context) {
    throw new Error("usePrayer must be used within a PrayerProvider");
  }
  return context;
}

export function PrayerProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<PrayerRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshRequests = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getPrayerRequests();
      setRequests(data);
    } catch (error) {
      console.error("Error loading prayer requests:", error);
      toast.error("Failed to load prayer requests");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshRequests();
  }, [refreshRequests]);

  const savePrayerRequest = useCallback(
    async (draft: PrayerRequestDraft, id?: string) => {
      try {
        if (id) {
          const result = await updatePrayerRequest(id, draft);
          if (result.error) {
            toast.error("Failed to update prayer request", {
              description: result.error,
            });
            return;
          }
          if (result.data) {
            setRequests((prev) =>
              prev.map((r) => (r.id === id ? result.data! : r))
            );
            toast.success("Prayer request updated");
          }
        } else {
          const result = await createPrayerRequest(draft);
          if (result.error) {
            toast.error("Failed to save prayer request", {
              description: result.error,
            });
            return;
          }
          if (result.data) {
            setRequests((prev) => [result.data!, ...prev]);
            toast.success("Prayer request added");
          }
        }
      } catch (error) {
        console.error("Error saving prayer request:", error);
        toast.error("An unexpected error occurred");
      }
    },
    []
  );

  const deletePrayerRequestFn = useCallback(async (id: string) => {
    try {
      const result = await deletePrayerRequest(id);
      if (result.error) {
        toast.error("Failed to delete prayer request", {
          description: result.error,
        });
        return;
      }
      setRequests((prev) => prev.filter((r) => r.id !== id));
      toast.success("Prayer request deleted");
    } catch (error) {
      console.error("Error deleting prayer request:", error);
      toast.error("An unexpected error occurred");
    }
  }, []);

  const markAnsweredFn = useCallback(async (id: string) => {
    try {
      const result = await markAnsweredAction(id);
      if (result.error) {
        toast.error("Failed to mark as answered", {
          description: result.error,
        });
        return;
      }
      if (result.data) {
        setRequests((prev) =>
          prev.map((r) => (r.id === id ? result.data! : r))
        );
        toast.success("Marked as answered — praise God!");
      }
    } catch (error) {
      console.error("Error marking prayer as answered:", error);
      toast.error("An unexpected error occurred");
    }
  }, []);

  return (
    <PrayerContext.Provider
      value={{
        requests,
        isLoading,
        savePrayerRequest,
        deletePrayerRequest: deletePrayerRequestFn,
        markAnswered: markAnsweredFn,
        refreshRequests,
      }}
    >
      {children}
    </PrayerContext.Provider>
  );
}
