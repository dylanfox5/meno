"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updatePassword } from "../../auth/reset-password-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm_password") as string;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsLoading(true);
    const result = await updatePassword(formData);

    if (result?.error) {
      toast.error("Failed to reset password", {
        description: result.error,
      });
      setIsLoading(false);
    } else {
      toast.success("Password updated successfully");
      router.push("/");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-serif text-3xl font-semibold text-foreground mb-2">
            Set new password
          </h1>
          <p className="text-muted-foreground">Enter your new password below</p>
        </div>

        <Card className="border-border">
          <CardContent className="p-6">
            <form action={handleSubmit} className="space-y-4">
              <div>
                <Label
                  htmlFor="password"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  New Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  disabled={isLoading}
                  placeholder="••••••••"
                />
              </div>

              <div>
                <Label
                  htmlFor="confirm_password"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Confirm Password
                </Label>
                <Input
                  id="confirm_password"
                  name="confirm_password"
                  type="password"
                  required
                  minLength={6}
                  disabled={isLoading}
                  placeholder="••••••••"
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update password"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
