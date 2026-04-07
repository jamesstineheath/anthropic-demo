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

export function AgentGrid() {
  const searchParams = useSearchParams();
  const personaId = searchParams.get("persona") ?? DEFAULT_PERSONA_ID;
  const persona = getPersonaById(personaId);

  if (!persona) return null;

  const agents = getPersonaAgents(persona);
  const metaAgents = getPersonaMetaAgents(persona);
  const viewOnly = !persona.isInteractive;

  // Calendaring first (featured)
  const calendaring = agents.find((a) => a.isDeepAgent);
  const rest = agents.filter((a) => !a.isDeepAgent);

  return (
    <div data-tour="agent-grid">
      {/* Featured Calendaring card */}
      {calendaring && (
        <div className="mb-4">
          <AgentCard agent={calendaring} featured viewOnly={viewOnly} />
        </div>
      )}

      {/* Agent grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {rest.map((agent) => (
          <AgentCard key={agent.id} agent={agent} viewOnly={viewOnly} />
        ))}
      </div>

      {metaAgents.length > 0 && (
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
            {metaAgents.map((agent) => (
              <MetaAgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
