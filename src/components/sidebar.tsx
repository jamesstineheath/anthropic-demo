"use client";

import { Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Lock,
  Plus,
  Search,
  ArrowLeft,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "@/components/sidebar-nav";
import { TeamList } from "@/components/team-list";
import { getAgentById } from "@/lib/agents/data";
import {
  getPersonaById,
  getPersonaMetaAgents,
  DEFAULT_PERSONA_ID,
} from "@/lib/agents/personas";
import { getIcon } from "@/lib/icons";

function SidebarContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isAgentDetail = pathname.startsWith("/agents/");
  const agentId = isAgentDetail ? pathname.split("/agents/")[1] : null;
  const activeAgent = agentId ? getAgentById(agentId) : null;
  const personaId = searchParams.get("persona") ?? DEFAULT_PERSONA_ID;
  const persona = getPersonaById(personaId);
  const metaAgents = persona ? getPersonaMetaAgents(persona) : [];

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
            <span className="text-[15px] font-semibold tracking-tight">
              Claude
            </span>
          </div>
        </div>

        {/* Decorative action buttons */}
        <div className="px-4 py-1 space-y-0.5">
          <div className="flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-[13px] text-muted-foreground/40 cursor-default">
            <Plus className="h-4 w-4" />
            <span>New chat</span>
          </div>
          <div className="flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-[13px] text-muted-foreground/40 cursor-default">
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
          {isAgentDetail && activeAgent ? (
            // Agent detail sidebar
            <div className="space-y-1">
              <Link
                href="/"
                className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft className="h-3 w-3" />
                Agent Team
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
          ) : (
            // Agent Team sidebar content
            <>
              {/* Persona About */}
              {persona && (
                <>
                  <div className="mb-1.5 px-3 pt-1 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
                    About {persona.name}
                  </div>
                  <div className="px-3 space-y-1 mb-3">
                    {persona.context.map((item, i) => (
                      <p key={i} className="text-xs text-muted-foreground leading-relaxed">
                        {item}
                      </p>
                    ))}
                  </div>
                  <Separator className="my-3" />
                </>
              )}

              {/* Your Team */}
              <div className="mb-1.5 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
                Your Team
              </div>
              <TeamList />

              {metaAgents.length > 0 && (
                <>
                  <Separator className="my-3" />

                  {/* Meta Agents */}
                  <div className="mb-1.5 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/60">
                    Meta Agents
                  </div>
                  <div className="space-y-0.5">
                    {metaAgents.map((agent) => {
                      const Icon = getIcon(agent.icon);
                      return (
                        <div
                          key={agent.id}
                          className="flex items-center gap-2.5 rounded-lg px-3 py-1.5 opacity-40"
                        >
                          <Icon className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                          <span className="truncate text-[13px] text-muted-foreground">
                            {agent.name}
                          </span>
                          <Lock className="ml-auto h-3 w-3 shrink-0 text-muted-foreground/40" />
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {/* User profile (simulated) */}
        <div className="mt-auto border-t border-border px-4 py-3">
          <div className="flex items-center gap-2.5 px-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary">
              {persona?.avatar ?? "J"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-medium leading-tight">
                {persona?.name ?? "James"}
              </div>
              <div className="text-xs text-muted-foreground">Max plan</div>
            </div>
          </div>
          <div className="mt-2 px-2">
            <p className="text-[9px] text-muted-foreground/40">
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
