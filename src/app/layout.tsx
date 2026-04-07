import type { Metadata } from "next";
import { Source_Serif_4, JetBrains_Mono } from "next/font/google";
import "./globals.css";

import { ThemeProvider } from "@/components/providers/theme-provider";
import { TeamProvider } from "@/components/providers/team-provider";
import { XRayProvider } from "@/components/providers/xray-provider";
import { TourProvider } from "@/components/providers/tour-provider";
import { DemoProvider } from "@/components/demo/demo-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppShell } from "@/components/app-shell";

// Source Serif 4: warm transitional serif approximating Claude.ai's typography
const sourceSerif = Source_Serif_4({
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
      className={`${sourceSerif.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="h-full">
        <ThemeProvider>
          <TeamProvider>
            <XRayProvider>
              <TourProvider>
                <DemoProvider>
                  <TooltipProvider>
                    <AppShell>{children}</AppShell>
                  </TooltipProvider>
                </DemoProvider>
              </TourProvider>
            </XRayProvider>
          </TeamProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
