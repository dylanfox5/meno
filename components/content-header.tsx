"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";

interface ContentHeaderProps {
  title: string;
}

export function ContentHeader({ title }: ContentHeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-border bg-background px-4">
      <SidebarTrigger className="-ml-1" />
    </header>
  );
}
