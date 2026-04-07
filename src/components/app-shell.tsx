"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import { SidebarMobile } from "@/components/sidebar-mobile";
import { DemoOverlay } from "@/components/demo/demo-overlay";
import { OnboardingOverlay } from "@/components/demo/onboarding-overlay";
import { MobileGate } from "@/components/mobile-gate";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAgentDetail = pathname.startsWith("/agents/");
  const isFullWidth = isAgentDetail || pathname === "/memory";

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
          <div className="flex items-center gap-1" />
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="h-full">{children}</div>
        </main>
      </div>

      <OnboardingOverlay />
      <DemoOverlay />
      <MobileGate />
    </div>
  );
}
