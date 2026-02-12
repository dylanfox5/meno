"use server";

import { createClient } from "@/lib/supabase/server";
import type {
  BibleReading,
  CreateBibleReading,
  UpdateBibleReading,
} from "@/lib/types";

type ActionResult<T> = {
  data?: T;
  error?: string;
};

export async function getBibleReadings(): Promise<BibleReading[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("bible_readings")
    .select("*")
    .eq("user_id", user.id)
    .order("reading_date", { ascending: false });

  if (error) {
    console.error("Error fetching bible readings:", error);
    return [];
  }

  return data || [];
}

export async function getBibleReadingsByDateRange(
  startDate: string,
  endDate: string
): Promise<BibleReading[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("bible_readings")
    .select("*")
    .eq("user_id", user.id)
    .gte("reading_date", startDate)
    .lte("reading_date", endDate)
    .order("reading_date", { ascending: false });

  if (error) {
    console.error("Error fetching bible readings by date range:", error);
    return [];
  }

  return data || [];
}

export async function createBibleReading(
  reading: CreateBibleReading
): Promise<ActionResult<BibleReading>> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to create a Bible reading" };
  }

  const { data, error } = await supabase
    .from("bible_readings")
    .insert({
      user_id: user.id,
      reading_date: reading.reading_date,
      scripture: reading.scripture,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating bible reading:", error);
    return { error: error.message };
  }

  return { data };
}

export async function updateBibleReading(
  id: string,
  updates: UpdateBibleReading
): Promise<ActionResult<BibleReading>> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to update a Bible reading" };
  }

  const { data, error } = await supabase
    .from("bible_readings")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating bible reading:", error);
    return { error: error.message };
  }

  return { data };
}

export async function deleteBibleReading(
  id: string
): Promise<ActionResult<null>> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to delete a Bible reading" };
  }

  const { error } = await supabase
    .from("bible_readings")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting bible reading:", error);
    return { error: error.message };
  }

  return { data: null };
}
