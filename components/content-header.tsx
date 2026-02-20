"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";

interface ContentHeaderProps {
  title: string;
}

export function ContentHeader({ title }: ContentHeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-border/40 bg-background/80 backdrop-blur-md px-4 sticky top-0 z-10">
      <SidebarTrigger className="-ml-1" />
      {title && (
        <h1 className="text-sm font-medium text-foreground">{title}</h1>
      )}
    </header>
  );
}
