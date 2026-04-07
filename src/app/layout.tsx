import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { TeamProvider } from "@/components/providers/team-provider";
import { XRayProvider } from "@/components/providers/xray-provider";
import { TourProvider } from "@/components/providers/tour-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppShell } from "@/components/app-shell";

// Inter: clean humanist sans used across Anthropic's products (console, docs)
const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

// JetBrains Mono: cleaner monospace for the X-Ray panel
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Claude Agents — Your AI Team",
  description:
    "Add AI agents that learn your preferences and earn your trust over time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="h-full">
        <ThemeProvider>
          <TeamProvider>
            <XRayProvider>
              <TourProvider>
                <TooltipProvider>
                  <AppShell>{children}</AppShell>
                </TooltipProvider>
              </TourProvider>
            </XRayProvider>
          </TeamProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
