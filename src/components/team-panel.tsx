"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Brain, FileText, Users, Pencil } from "lucide-react";
import { useTeam } from "@/components/providers/team-provider";
import { getAgentById, TRUST_STAGE_LABELS } from "@/lib/agents/data";
import {
  getPersonaById,
  getPersonaMetaAgents,
  DEFAULT_PERSONA_ID,
} from "@/lib/agents/personas";
import { getIcon } from "@/lib/icons";

function PanelSection({
  icon: Icon,
  title,
  trailing,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  trailing?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-border px-5 py-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-semibold text-foreground">{title}</span>
        </div>
        {trailing}
      </div>
      {children}
    </div>
  );
}

export function TeamPanel() {
  const searchParams = useSearchParams();
  const personaId = searchParams.get("persona") ?? DEFAULT_PERSONA_ID;
  const persona = getPersonaById(personaId);
  const { teamAgents, mounted } = useTeam();
  const metaAgents = persona ? getPersonaMetaAgents(persona) : [];

  return (
    <div>
      {/* Memory section */}
      <PanelSection
        icon={Brain}
        title="Memory"
        trailing={<Pencil className="h-3.5 w-3.5 text-muted-foreground/50" />}
      >
        <p className="text-sm text-muted-foreground leading-relaxed">
          {persona?.name ?? "Alex"} is a senior product leader (Head of Product) who recently departed Mill (Chewie Labs Inc.), a consumer hardwar…
        </p>
        <Link
          href="/memory"
          className="text-xs text-primary hover:underline mt-2 inline-block"
        >
          View all memories →
        </Link>
      </PanelSection>

      {/* Instructions / Context section */}
      <PanelSection
        icon={FileText}
        title="Instructions"
        trailing={<Pencil className="h-3.5 w-3.5 text-muted-foreground/50" />}
      >
        {persona && (
          <div className="space-y-1.5">
            {persona.context.map((item, i) => (
              <p key={i} className="text-sm text-muted-foreground leading-relaxed">
                {item}
              </p>
            ))}
          </div>
        )}
      </PanelSection>

      {/* Your Agents section */}
      <PanelSection icon={Users} title="Your Agents">
        {!mounted ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : teamAgents.length === 0 ? (
          <p className="text-sm text-muted-foreground/60">
            Add agents from the marketplace to build your team.
          </p>
        ) : (
          <div className="space-y-1">
            {teamAgents.map(({ id, trustStage }) => {
              const agent = getAgentById(id);
              if (!agent) return null;
              const AgentIcon = getIcon(agent.icon);
              return (
                <Link
                  key={id}
                  href={`/agents/${id}`}
                  className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-accent"
                >
                  <AgentIcon className="h-3.5 w-3.5 shrink-0 text-primary" />
                  <span className="truncate font-medium">{agent.name}</span>
                  <span className="ml-auto shrink-0 text-xs text-muted-foreground/60">
                    {TRUST_STAGE_LABELS[trustStage]}
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </PanelSection>
    </div>
  );
}
