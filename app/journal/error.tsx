"use client";

import { Button } from "@/components/ui/button";

export default function JournalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center flex-1 gap-4 p-6 text-center">
      <p className="text-muted-foreground text-sm">
        Something went wrong loading your journal.
      </p>
      <Button variant="outline" size="sm" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
