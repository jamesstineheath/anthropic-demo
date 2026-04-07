"use client";

import { Sidebar } from "@/components/sidebar";
import { SidebarMobile } from "@/components/sidebar-mobile";
import { ThemeToggle } from "@/components/theme-toggle";
import { XRayToggle } from "@/components/xray-toggle";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden w-[280px] shrink-0 border-r border-border bg-sidebar md:block">
        <Sidebar />
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-12 shrink-0 items-center justify-between border-b border-border px-4">
          <div className="flex items-center gap-2">
            <SidebarMobile />
          </div>
          <div className="flex items-center gap-1">
            <XRayToggle />
            <ThemeToggle />
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-5xl px-6 py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
