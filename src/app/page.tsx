"use client";

import { Suspense, useState, useEffect } from "react";
import { Search } from "lucide-react";
import { HeroHeader } from "@/components/hero-header";
import { AgentGrid } from "@/components/agent-grid";
import { AgentManage } from "@/components/agent-manage";
import { cn } from "@/lib/utils";
import { useDemo } from "@/components/demo/demo-provider";

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px",
        active
          ? "border-primary text-foreground"
          : "border-transparent text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}

export default function Home() {
  const [tab, setTab] = useState<"discover" | "your-agents">("discover");
  const [search, setSearch] = useState("");
  const { currentStep, mode } = useDemo();

  // Sync tab with demo step when in tour mode
  useEffect(() => {
    if (mode === "tour" && currentStep.tab) {
      setTab(currentStep.tab);
    }
  }, [mode, currentStep]);

  return (
    <div className="flex h-full">
      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header + tabs */}
        <div className="shrink-0 px-6 pt-6">
          <div className="mx-auto max-w-4xl">
            <HeroHeader />
            <div className="flex border-b border-border">
              <TabButton active={tab === "discover"} onClick={() => setTab("discover")}>
                Discover
              </TabButton>
              <TabButton active={tab === "your-agents"} onClick={() => setTab("your-agents")}>
                Your Agents
              </TabButton>
            </div>
          </div>
        </div>

        {/* Tab content */}
        {tab === "discover" ? (
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <div className="mx-auto max-w-4xl">
              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground/50" />
                <input
                  type="text"
                  placeholder="Search agents..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
              <Suspense>
                <AgentGrid search={search} />
              </Suspense>
            </div>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <AgentManage />
          </div>
        )}
      </div>
    </div>
  );
}
