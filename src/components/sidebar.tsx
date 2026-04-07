"use client";

import { Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Plus,
  Search,
  ArrowLeft,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "@/components/sidebar-nav";
import { getAgentById } from "@/lib/agents/data";
import {
  getPersonaById,
  DEFAULT_PERSONA_ID,
} from "@/lib/agents/personas";
import { getIcon } from "@/lib/icons";

function SidebarContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isAgentDetail = pathname.startsWith("/agents/");
  const isMemory = pathname === "/memory";
  const isHome = pathname === "/home";
  const agentId = isAgentDetail ? pathname.split("/agents/")[1] : null;
  const activeAgent = agentId ? getAgentById(agentId) : null;
  const personaId = searchParams.get("persona") ?? DEFAULT_PERSONA_ID;
  const persona = getPersonaById(personaId);
  return (
    <ScrollArea className="h-full">
      <div className="flex h-full min-h-screen flex-col">
        {/* Header: Claude logo */}
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center gap-2 px-2">
            <Image
              src="/claude-logo.svg"
              alt="Claude"
              width={24}
              height={24}
            />
            <span className="text-base font-semibold tracking-tight">
              Claude
            </span>
          </div>
        </div>

        {/* Decorative action buttons */}
        <div className="px-4 py-1 space-y-0.5">
          <div className="flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-sm text-muted-foreground/40 cursor-default">
            <Plus className="h-4 w-4" />
            <span>New chat</span>
          </div>
          <div className="flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-sm text-muted-foreground/40 cursor-default">
            <Search className="h-4 w-4" />
            <span>Search</span>
          </div>
        </div>

        <Separator className="mx-4 my-2" />

        {/* Main navigation */}
        <div className="px-4">
          <SidebarNav />
        </div>

        <Separator className="mx-4 my-2" />

        {/* Contextual content */}
        <div className="flex-1 px-4">
          {isHome ? (
            <div className="space-y-3">
              <div className="px-3 pt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
                Recents
              </div>
              <div className="space-y-0.5">
                {[
                  "Help me draft a project proposal",
                  "Brainstorm ideas for team offsite",
                  "Summarize this research paper",
                  "Debug my Python script",
                  "Review Q3 planning document",
                  "Write a thank you note",
                  "Compare pricing models",
                  "Explain this architecture diagram",
                ].map((title) => (
                  <div
                    key={title}
                    className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground/60 cursor-default truncate"
                  >
                    {title}
                  </div>
                ))}
              </div>
            </div>
          ) : isMemory ? (
            // Memory sidebar
            <div className="space-y-3">
              <div className="px-3 pt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
                Universal Memory
              </div>
              <div className="px-3 space-y-1.5">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Shared context across all agents. Memories are learned from your conversations, observed behavior, and cross-agent inference.
                </p>
              </div>
            </div>
          ) : isAgentDetail && activeAgent ? (
            // Agent detail sidebar
            <div className="space-y-1">
              <Link
                href="/"
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-3 w-3" />
                Agents
              </Link>
              <div className="flex items-center gap-2.5 px-3 py-2">
                {(() => {
                  const Icon = getIcon(activeAgent.icon);
                  return (
                    <Icon className="h-4 w-4 text-primary" />
                  );
                })()}
                <span className="text-sm font-medium">
                  {activeAgent.name}
                </span>
              </div>
            </div>
          ) : null}
        </div>

        {/* User profile (simulated) */}
        <div className="mt-auto border-t border-border px-4 py-3">
          <div className="flex items-center gap-2.5 px-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary">
              {persona?.avatar ?? "A"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium leading-tight">
                {persona?.name ?? "Alex"}
              </div>
              <div className="text-xs text-muted-foreground">Max plan</div>
            </div>
          </div>
          <div className="mt-2 px-2">
            <p className="text-xs text-muted-foreground/40">
              Prototype — Anthropic PM Take-Home
            </p>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}

export function Sidebar() {
  return (
    <Suspense>
      <SidebarContent />
    </Suspense>
  );
}
