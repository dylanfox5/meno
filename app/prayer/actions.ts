"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type {
  PrayerRequest,
  PrayerRequestDraft,
  UpdatePrayerRequest,
} from "@/lib/types";

type ActionResult<T> = {
  data?: T;
  error?: string;
};

export async function getPrayerRequests(): Promise<PrayerRequest[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("prayer_requests")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching prayer requests:", error);
    return [];
  }

  return data || [];
}

export async function createPrayerRequest(
  draft: PrayerRequestDraft
): Promise<ActionResult<PrayerRequest>> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to create a prayer request" };
  }

  const { data, error } = await supabase
    .from("prayer_requests")
    .insert({
      user_id: user.id,
      group_name: draft.group_name,
      subject: draft.subject,
      request: draft.request,
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating prayer request:", error);
    return { error: error.message };
  }

  revalidatePath("/prayer");
  return { data };
}

export async function updatePrayerRequest(
  id: string,
  updates: UpdatePrayerRequest
): Promise<ActionResult<PrayerRequest>> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to update a prayer request" };
  }

  const { data, error } = await supabase
    .from("prayer_requests")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating prayer request:", error);
    return { error: error.message };
  }

  revalidatePath("/prayer");
  return { data };
}

export async function deletePrayerRequest(
  id: string
): Promise<ActionResult<null>> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to delete a prayer request" };
  }

  const { error } = await supabase
    .from("prayer_requests")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting prayer request:", error);
    return { error: error.message };
  }

  revalidatePath("/prayer");
  return { data: null };
}

export async function markAnswered(
  id: string
): Promise<ActionResult<PrayerRequest>> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be logged in to update a prayer request" };
  }

  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("prayer_requests")
    .update({
      is_answered: true,
      answered_date: today,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    console.error("Error marking prayer request as answered:", error);
    return { error: error.message };
  }

  revalidatePath("/prayer");
  return { data };
}
