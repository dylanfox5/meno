"use client";

import { format } from "date-fns";
import { Sparkles } from "lucide-react";

const verses = [
  { text: "Be still, and know that I am God.", reference: "Psalm 46:10" },
  { text: "Your word is a lamp to my feet and a light to my path.", reference: "Psalm 119:105" },
  { text: "Draw near to God, and he will draw near to you.", reference: "James 4:8" },
  { text: "Trust in the Lord with all your heart.", reference: "Proverbs 3:5" },
  { text: "The Lord is my shepherd; I shall not want.", reference: "Psalm 23:1" },
];

export function WelcomeSection() {
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000);
  const verse = verses[dayOfYear % verses.length];

  return (
    <div className="bg-card border border-border rounded-xl p-6 mb-6 shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground mb-1">
            {format(today, "EEEE, MMMM d, yyyy")}
          </p>
          <h1 className="text-2xl sm:text-3xl font-semibold text-foreground mb-2">
            Good {getTimeOfDay()}, friend
          </h1>
          <p className="text-muted-foreground max-w-xl">
            Take a moment to pause, reflect, and connect with God through your journaling today.
          </p>
        </div>
      </div>
      
      <div className="mt-5 pt-5 border-t border-border">
        <p className="text-lg text-foreground italic leading-relaxed">
          {`"${verse.text}"`}
        </p>
        <p className="text-sm text-primary font-medium mt-2">
          — {verse.reference}
        </p>
      </div>
    </div>
  );
}

function getTimeOfDay(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}
