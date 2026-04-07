"use client";

import { useSearchParams } from "next/navigation";
import { AGENTS, META_AGENTS, type AgentCategory } from "@/lib/agents/data";
import { AgentCard } from "@/components/agent-card";
import { MetaAgentCard } from "@/components/meta-agent-card";
import { Separator } from "@/components/ui/separator";

export function AgentGrid() {
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category") as AgentCategory | null;

  const filteredAgents = activeCategory
    ? AGENTS.filter((a) => a.category === activeCategory)
    : AGENTS;

  // Calendaring is always first when showing all
  const sortedAgents = !activeCategory
    ? [
        ...filteredAgents.filter((a) => a.isDeepAgent),
        ...filteredAgents.filter((a) => !a.isDeepAgent),
      ]
    : filteredAgents;

  return (
    <div>
      {/* Featured Calendaring card (full width when showing all) */}
      {!activeCategory && sortedAgents[0]?.isDeepAgent && (
        <>
          <div className="mb-4">
            <AgentCard agent={sortedAgents[0]} featured />
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sortedAgents.slice(1).map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </>
      )}

      {/* Filtered view — no featured card */}
      {(activeCategory || !sortedAgents[0]?.isDeepAgent) && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sortedAgents.map((agent) => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
        </div>
      )}

      {filteredAgents.length === 0 && (
        <div className="py-12 text-center text-sm text-muted-foreground">
          No agents in this category.
        </div>
      )}

      {!activeCategory && (
        <>
          <Separator className="my-8" />
          <div className="mb-4">
            <h2 className="text-base font-semibold text-foreground">
              Meta Agents
            </h2>
            <p className="mt-1 text-[13px] text-muted-foreground">
              Advanced agents that unlock when prerequisites reach required trust
              levels.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {META_AGENTS.map((agent) => (
              <MetaAgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
