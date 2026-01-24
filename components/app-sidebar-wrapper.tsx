import { createClient } from '@/lib/supabase/server'
import { AppSidebar } from './app-sidebar'

export async function AppSidebarWrapper() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  let profile = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single()
    profile = data
  }

  const displayName = profile?.full_name || 'User'
  const email = user?.email || ''

  return <AppSidebar displayName={displayName} email={email} />
}