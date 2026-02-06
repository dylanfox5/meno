"use client";

import { useState } from "react";
import { signup } from "../auth/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { toast } from "sonner";
import { Mail } from "lucide-react";

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailConfirmation, setShowEmailConfirmation] = useState(false);
  const [email, setEmail] = useState("");

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    const emailValue = formData.get("email") as string;
    const result = await signup(formData);

    if (result?.error) {
      toast.error("Sign up failed", {
        description: result.error,
      });
      setIsLoading(false);
    } else if (result?.success) {
      setEmail(emailValue);
      setShowEmailConfirmation(true);
      setIsLoading(false);
    }
  }

  if (showEmailConfirmation) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Card className="border-border">
            <CardContent className="p-6 text-center">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-primary" />
              </div>

              <h2 className="text-2xl font-semibold text-foreground mb-2">
                Check your email
              </h2>

              <p className="text-muted-foreground mb-4">
                We've sent a confirmation link to:
              </p>

              <p className="text-foreground font-medium mb-6">{email}</p>

              <p className="text-sm text-muted-foreground mb-6">
                Click the link in the email to confirm your account and start
                your journey with Meno.
              </p>

              <div className="space-y-3">
                <Link href="/login" className="block">
                  <Button variant="outline" className="w-full">
                    Back to login
                  </Button>
                </Link>

                <p className="text-xs text-muted-foreground">
                  Didn't receive the email? Check your spam folder or{" "}
                  <button
                    onClick={() => setShowEmailConfirmation(false)}
                    className="text-primary hover:underline"
                  >
                    try again
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-semibold text-foreground mb-2">
            Begin your journey
          </h1>
          <p className="text-muted-foreground">
            Create an account to start reflecting with Meno
          </p>
        </div>

        <Card className="border-border">
          <CardContent className="p-6">
            <form action={handleSubmit} className="space-y-4">
              <div>
                <Label
                  htmlFor="email"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label
                  htmlFor="password"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Must be at least 6 characters
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create account"}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-primary hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
