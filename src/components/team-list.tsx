"use client";

import Link from "next/link";
import { useTeam } from "@/components/providers/team-provider";
import { getAgentById, TRUST_STAGE_LABELS } from "@/lib/agents/data";
import { getIcon } from "@/lib/icons";
import { Users } from "lucide-react";

export function TeamList() {
  const { teamAgents, mounted } = useTeam();

  if (!mounted) {
    return (
      <div className="px-3 py-2 text-[13px] text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (teamAgents.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 px-3 py-4 text-center">
        <Users className="h-4 w-4 text-muted-foreground/40" />
        <p className="text-[11px] leading-relaxed text-muted-foreground/60">
          Add agents from the marketplace to build your team.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-0.5">
      {teamAgents.map(({ id, trustStage }) => {
        const agent = getAgentById(id);
        if (!agent) return null;
        const Icon = getIcon(agent.icon);
        return (
          <Link
            key={id}
            href={`/agents/${id}`}
            className="flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-[13px] transition-colors hover:bg-accent"
          >
            <Icon className="h-3.5 w-3.5 shrink-0 text-primary" />
            <span className="truncate font-medium">{agent.name}</span>
            <span className="ml-auto shrink-0 text-[10px] text-muted-foreground/60">
              {TRUST_STAGE_LABELS[trustStage]}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
