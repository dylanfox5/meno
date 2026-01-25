'use client'

import { useState } from 'react'
import { requestPasswordReset } from '../auth/reset-password-actions'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import Link from 'next/link'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  async function handleSubmit(formData: FormData) {
    setIsLoading(true)
    const result = await requestPasswordReset(formData)
    
    if (result?.error) {
      toast.error('Failed to send reset email', {
        description: result.error
      })
      setIsLoading(false)
    } else {
      setEmailSent(true)
      toast.success('Check your email', {
        description: 'We sent you a password reset link'
      })
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link 
            href="/login" 
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to login
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-foreground mb-2">
            Reset your password
          </h1>
          <p className="text-muted-foreground">
            {emailSent 
              ? "We've sent you a reset link" 
              : "Enter your email to receive a reset link"
            }
          </p>
        </div>

        {emailSent ? (
          <Card className="border-border">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <p className="text-sm text-muted-foreground">
                  Check your email for a link to reset your password. If it doesn't appear within a few minutes, check your spam folder.
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/login">Return to login</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-border">
            <CardContent className="p-6">
              <form action={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    disabled={isLoading}
                    placeholder="you@example.com"
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? 'Sending...' : 'Send reset link'}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}