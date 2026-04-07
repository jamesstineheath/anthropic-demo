"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTeam } from "@/components/providers/team-provider";
import { type Agent, TRUST_STAGE_LABELS } from "@/lib/agents/data";
import { getIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface AgentCardProps {
  agent: Agent;
  featured?: boolean;
  viewOnly?: boolean;
  discover?: boolean;
}

export function AgentCard({ agent, featured, viewOnly, discover }: AgentCardProps) {
  const { isOnTeam, addAgent, removeAgent, getTrustStage } = useTeam();
  const onTeam = isOnTeam(agent.id);
  const trustStage = getTrustStage(agent.id);
  const Icon = getIcon(agent.icon);

  const cardContent = (
    <Card
      data-tour={`agent-card-${agent.id}`}
      className={cn(
        "group relative border transition-all duration-200 h-full",
        onTeam
          ? "border-border/60 bg-card shadow-sm"
          : "border-border bg-card hover:border-border/80 hover:shadow-sm"
      )}
    >
      <CardContent className="px-4 py-3 flex flex-col h-full">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
              onTeam
                ? "bg-muted text-foreground"
                : "bg-muted text-muted-foreground group-hover:text-foreground"
            )}
          >
            <Icon className="h-4.5 w-4.5" />
          </div>
          <h3 className="text-sm font-semibold leading-tight text-foreground">
            {agent.name}
          </h3>
        </div>

        <p className="mt-2.5 flex-1 text-sm leading-relaxed text-muted-foreground">
          {agent.description}
        </p>

        <div className="mt-3 flex items-center justify-end gap-2">
          {viewOnly ? (
            <span className="text-xs text-muted-foreground/50 italic">
              Switch to Alex to interact
            </span>
          ) : discover && onTeam ? (
            <span className="text-xs font-medium text-muted-foreground">Added</span>
          ) : onTeam && !discover ? (
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">
                Stage {trustStage}: {TRUST_STAGE_LABELS[trustStage]}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-xs text-muted-foreground hover:text-destructive"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  removeAgent(agent.id);
                }}
              >
                Remove
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              className="h-7 gap-1 px-3 text-xs"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addAgent(agent.id);
              }}
            >
              <Plus className="h-3 w-3" />
              Add
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (onTeam && !viewOnly) {
    return <Link href={`/agents/${agent.id}`}>{cardContent}</Link>;
  }

  return cardContent;
}
