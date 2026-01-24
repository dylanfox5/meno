'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { CreateJournalEntry, UpdateJournalEntry } from '@/lib/types'

export async function getJournalEntries() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from('journal_entries')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching journal entries:', error)
    return []
  }

  return data || []
}

export async function createJournalEntry(entry: CreateJournalEntry) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { data, error } = await supabase
    .from('journal_entries')
    .insert({
      user_id: user.id,
      title: entry.title,
      content: entry.content,
      scripture: entry.scripture,
      type: entry.type,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating journal entry:', error)
    return { error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/journal')
  return { data }
}

export async function updateJournalEntry(id: string, entry: UpdateJournalEntry) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { data, error } = await supabase
    .from('journal_entries')
    .update(entry)
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    console.error('Error updating journal entry:', error)
    return { error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/journal')
  return { data }
}

export async function deleteJournalEntry(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('journal_entries')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error deleting journal entry:', error)
    return { error: error.message }
  }

  revalidatePath('/')
  revalidatePath('/journal')
  return { success: true }
}