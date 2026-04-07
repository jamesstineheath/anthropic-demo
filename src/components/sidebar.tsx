"use client";

import { Suspense } from "react";
import { Sparkles, Lock } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { CategoryNav } from "@/components/category-nav";
import { TeamList } from "@/components/team-list";
import { META_AGENTS, getAgentById } from "@/lib/agents/data";
import { getIcon } from "@/lib/icons";
import { Badge } from "@/components/ui/badge";

export function Sidebar() {
  return (
    <ScrollArea className="h-full">
      <div className="flex h-full flex-col px-4 py-6">
        {/* Logo */}
        <div className="mb-6 flex items-center gap-2 px-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
          <span className="text-base font-semibold tracking-tight">
            Claude Agents
          </span>
        </div>

        {/* Categories */}
        <div className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Categories
        </div>
        <Suspense>
          <CategoryNav />
        </Suspense>

        <Separator className="my-4" />

        {/* Your Team */}
        <div className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Your Team
        </div>
        <TeamList />

        <Separator className="my-4" />

        {/* Meta Agents Preview */}
        <div className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Meta Agents
        </div>
        <div className="space-y-1">
          {META_AGENTS.map((agent) => {
            const Icon = getIcon(agent.icon);
            return (
              <div
                key={agent.id}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 opacity-50"
              >
                <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="truncate text-sm text-muted-foreground">
                  {agent.name}
                </span>
                <Lock className="ml-auto h-3 w-3 shrink-0 text-muted-foreground/50" />
              </div>
            );
          })}
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Footer */}
        <div className="mt-6 px-3">
          <p className="text-[10px] text-muted-foreground/50">
            Prototype — Anthropic PM Take-Home
          </p>
        </div>
      </div>
    </ScrollArea>
  );
}
