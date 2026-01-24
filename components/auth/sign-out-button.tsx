'use client'

import { signout } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'

export function SignOutButton() {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => signout()}
      className="gap-2"
    >
      <LogOut className="mr-2 size-4" />
      Sign out
    </Button>
  )
}