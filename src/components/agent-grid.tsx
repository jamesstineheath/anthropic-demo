"use client";

import { useSearchParams } from "next/navigation";
import { AgentCard } from "@/components/agent-card";
import { MetaAgentCard } from "@/components/meta-agent-card";
import { Separator } from "@/components/ui/separator";
import {
  getPersonaById,
  getPersonaAgents,
  getPersonaMetaAgents,
  DEFAULT_PERSONA_ID,
} from "@/lib/agents/personas";
import { AGENTS, CATEGORIES, type AgentCategory } from "@/lib/agents/data";

export function AgentGrid({ search = "" }: { search?: string }) {
  const searchParams = useSearchParams();
  const personaId = searchParams.get("persona") ?? DEFAULT_PERSONA_ID;
  const persona = getPersonaById(personaId);

  if (!persona) return null;

  const query = search.toLowerCase().trim();
  const recommendedIds = new Set(persona.recommendedAgents);
  const allAgents = AGENTS;
  const allMetaAgents = getPersonaMetaAgents(persona);

  const agents = query
    ? allAgents.filter(
        (a) =>
          a.name.toLowerCase().includes(query) ||
          a.description.toLowerCase().includes(query) ||
          a.category.toLowerCase().includes(query)
      )
    : allAgents;

  const metaAgents = query
    ? allMetaAgents.filter(
        (a) =>
          a.name.toLowerCase().includes(query) ||
          a.description.toLowerCase().includes(query)
      )
    : allMetaAgents;
  const viewOnly = !persona.isInteractive;

  // Recommended: persona's recommended agents (up to 4)
  const recommended = agents.filter((a) => recommendedIds.has(a.id)).slice(0, 4);
  const recommendedIdSet = new Set(recommended.map((a) => a.id));
  const remainingAgents = agents.filter((a) => !recommendedIdSet.has(a.id));

  // Group remaining agents by category
  const agentsByCategory = new Map<AgentCategory, typeof remainingAgents>();
  for (const agent of remainingAgents) {
    const existing = agentsByCategory.get(agent.category) ?? [];
    existing.push(agent);
    agentsByCategory.set(agent.category, existing);
  }

  // Order categories per CATEGORIES constant
  const orderedCategories = CATEGORIES.filter((cat) =>
    agentsByCategory.has(cat)
  );

  // When searching, show flat results
  if (query) {
    if (agents.length === 0 && metaAgents.length === 0) {
      return (
        <div data-tour="agent-grid" className="py-12 text-center">
          <p className="text-sm text-muted-foreground">No agents found for &ldquo;{search}&rdquo;</p>
        </div>
      );
    }

    return (
      <div data-tour="agent-grid" className="space-y-8">
        {agents.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground mb-3">
              Results
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {agents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} viewOnly={viewOnly} discover />
              ))}
            </div>
          </div>
        )}
        {metaAgents.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-muted-foreground mb-3">
              Advanced Agents
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {metaAgents.map((agent) => (
                <MetaAgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div data-tour="agent-grid" className="space-y-8">
      {/* Recommended for you */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground mb-3">
          Recommended for you
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {recommended.map((agent) => (
            <AgentCard key={agent.id} agent={agent} viewOnly={viewOnly} discover />
          ))}
        </div>
      </div>

      {/* Category sections */}
      {orderedCategories.map((category) => {
        const categoryAgents = agentsByCategory.get(category)!;
        return (
          <div key={category}>
            <h2 className="text-sm font-semibold text-muted-foreground mb-3">
              {category}
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {categoryAgents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} viewOnly={viewOnly} discover />
              ))}
            </div>
          </div>
        );
      })}

      {metaAgents.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground mb-1">
            Advanced Agents
          </h2>
          <p className="text-sm text-muted-foreground/60 mb-3">
            Agents that unlock when prerequisites reach required trust levels.
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {metaAgents.map((agent) => (
              <MetaAgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
