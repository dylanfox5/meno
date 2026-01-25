"use client";

import { Feather } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onCreateNew: () => void;
}

export function EmptyState({ onCreateNew }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
        <Feather className="w-8 h-8 text-primary" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">
        Begin Your Journey
      </h3>
      <p className="text-muted-foreground max-w-sm mb-6">
        Start capturing your reflections, prayers, and insights from Scripture.
        Your first journal entry awaits.
      </p>
      <Button onClick={onCreateNew} size="lg" className="gap-2">
        <Feather className="w-4 h-4" />
        Write Your First Entry
      </Button>
    </div>
  );
}
