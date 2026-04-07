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

  return (
    <div>
      {/* Main agent grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredAgents.map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>

      {/* Empty state */}
      {filteredAgents.length === 0 && (
        <div className="py-12 text-center text-sm text-muted-foreground">
          No agents in this category.
        </div>
      )}

      {/* Meta agents section — always visible */}
      {!activeCategory && (
        <>
          <Separator className="my-8" />
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-foreground">
              Meta Agents
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Advanced agents that unlock when their prerequisites reach the
              required trust levels.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {META_AGENTS.map((agent) => (
              <MetaAgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
