"use client";

import { Button } from "@/components/ui/button";

export default function BibleIntakeError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-4 p-6 text-center">
      <p className="text-muted-foreground text-sm">
        Something went wrong loading Bible intake.
      </p>
      <Button variant="outline" size="sm" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
