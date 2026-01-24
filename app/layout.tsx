import React from "react";
import type { Metadata } from "next";
import { Lora, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebarWrapper } from "@/components/app-sidebar-wrapper";
import { JournalProvider } from "@/lib/journal-context";
import { createClient } from "@/lib/supabase/server";
import { Toaster } from "@/components/ui/sonner"


const _lora = Lora({ subsets: ["latin"], variable: "--font-lora" });
const _inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Meno",
  description:
    "A reflective space for journaling, prayer, and growing in faith",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const showSidebar = !!user;

  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <JournalProvider>
          {showSidebar ? (
            <SidebarProvider>
              <AppSidebarWrapper />
              <SidebarInset>{children}</SidebarInset>
            </SidebarProvider>
          ) : (
            children
          )}
        </JournalProvider>
        <Toaster />
        <Analytics />
      </body>
    </html>
  );
}
