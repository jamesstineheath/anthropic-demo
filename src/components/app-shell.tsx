"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { SidebarMobile } from "@/components/sidebar-mobile";
import { ThemeToggle } from "@/components/theme-toggle";
import { XRayToggle } from "@/components/xray-toggle";
import { TourOverlay } from "@/components/tour/tour-overlay";
import { useTour } from "@/components/providers/tour-provider";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAgentDetail = pathname.startsWith("/agents/");
  const { startTour } = useTour();

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden w-[260px] shrink-0 border-r border-border bg-sidebar md:block">
        <Sidebar />
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar — minimal */}
        <header className="flex h-10 shrink-0 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <SidebarMobile />
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={startTour}
              className="px-2 py-1 text-xs text-muted-foreground hover:text-foreground transition-colors rounded"
            >
              Tour
            </button>
            <XRayToggle />
            <ThemeToggle />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          {isAgentDetail ? (
            // Full-width for agent detail pages
            <div className="h-full">{children}</div>
          ) : (
            // Constrained width for marketplace
            <div className="mx-auto max-w-5xl px-6 py-6">{children}</div>
          )}
        </main>
      </div>

      <TourOverlay />
    </div>
  );
}
