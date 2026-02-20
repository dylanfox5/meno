import React from "react";
import type { Metadata } from "next";
import { Lora, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebarWrapper } from "@/components/app-sidebar-wrapper";
import { JournalProvider } from "@/lib/journal-context";
import { createClient } from "@/lib/supabase/server";
import { Toaster } from "@/components/ui/sonner";
import { BibleReadingProvider } from "@/lib/bible-reading-context";
import { ThemeProvider } from "@/components/theme-provider";

const lora = Lora({ subsets: ["latin"], variable: "--font-lora" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Meno",
  description:
    "A reflective space for journaling, prayer, and growing in faith",
  icons: {
    icon: [
      {
        url: "/icon.png",
      },
    ],
  },
  openGraph: {
    title: "Meno",
    description:
      "A reflective space for journaling, prayer, and growing in faith",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Meno",
    description:
      "A reflective space for journaling, prayer, and growing in faith",
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
    <html lang="en" className={`${inter.variable} ${lora.variable}`} suppressHydrationWarning>
      <body className={`font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {showSidebar ? (
            <JournalProvider>
              <BibleReadingProvider>
                <SidebarProvider>
                  <AppSidebarWrapper />
                  <SidebarInset>{children}</SidebarInset>
                </SidebarProvider>
              </BibleReadingProvider>
            </JournalProvider>
          ) : (
            children
          )}
          <Toaster />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
