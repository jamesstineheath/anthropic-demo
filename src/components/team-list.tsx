"use client";

import Link from "next/link";
import { useTeam } from "@/components/providers/team-provider";
import { getAgentById, TRUST_STAGE_LABELS } from "@/lib/agents/data";
import { getIcon } from "@/lib/icons";
import { Users } from "lucide-react";

export function TeamList() {
  const { teamAgentIds, mounted } = useTeam();

  if (!mounted) {
    return (
      <div className="px-3 py-2 text-sm text-muted-foreground">Loading...</div>
    );
  }

  if (teamAgentIds.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 px-3 py-6 text-center">
        <Users className="h-5 w-5 text-muted-foreground/50" />
        <p className="text-xs leading-relaxed text-muted-foreground">
          Add agents from the marketplace to build your team.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-0.5">
      {teamAgentIds.map((id) => {
        const agent = getAgentById(id);
        if (!agent) return null;
        const Icon = getIcon(agent.icon);
        return (
          <Link
            key={id}
            href={`/agents/${id}`}
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent"
          >
            <Icon className="h-4 w-4 shrink-0 text-primary" />
            <span className="truncate font-medium">{agent.name}</span>
            <span className="ml-auto shrink-0 text-[10px] text-muted-foreground">
              {TRUST_STAGE_LABELS[agent.trustStage]}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
