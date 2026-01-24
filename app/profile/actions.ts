'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    console.error('No user found')
    return { error: 'Not authenticated' }
  }

  const fullName = formData.get('full_name') as string

  console.log('Updating profile for user:', user.id, 'with name:', fullName)

  const { data, error } = await supabase
    .from('profiles')
    .update({ 
      full_name: fullName,
      updated_at: new Date().toISOString()
    })
    .eq('id', user.id)
    .select()

  console.log('Update result:', { data, error })

  if (error) {
    console.error('Supabase error:', error)
    return { error: error.message }
  }

  revalidatePath('/profile')
  revalidatePath('/')
  return { success: true }
}

export async function getProfile() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return null
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  console.log('Get profile result:', { profile, error, userId: user.id })

  return {
    email: user.email,
    full_name: profile?.full_name || '',
  }
}