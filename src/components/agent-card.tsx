"use client";

import Link from "next/link";
import { Plus, Check, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTeam } from "@/components/providers/team-provider";
import { type Agent, TRUST_STAGE_LABELS } from "@/lib/agents/data";
import { getIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

interface AgentCardProps {
  agent: Agent;
}

export function AgentCard({ agent }: AgentCardProps) {
  const { isOnTeam, addAgent, removeAgent } = useTeam();
  const onTeam = isOnTeam(agent.id);
  const Icon = getIcon(agent.icon);

  const cardContent = (
    <Card
      className={cn(
        "group relative border transition-all duration-200",
        onTeam
          ? "border-primary/20 bg-card shadow-sm"
          : "border-border bg-card hover:border-primary/30 hover:shadow-sm"
      )}
    >
      <CardContent className="p-5">
        {/* Header: Icon + Name */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                onTeam
                  ? "bg-primary/10 text-primary"
                  : "bg-secondary text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
              )}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold leading-tight text-foreground">
                {agent.name}
              </h3>
              {agent.isDeepAgent && (
                <div className="mt-0.5 flex items-center gap-1 text-[10px] font-medium text-primary">
                  <Sparkles className="h-2.5 w-2.5" />
                  Deep Agent
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          {agent.description}
        </p>

        {/* Footer: Category + Action */}
        <div className="mt-4 flex items-center justify-between gap-2">
          <Badge
            variant="secondary"
            className="text-[10px] font-medium"
          >
            {agent.category}
          </Badge>

          {onTeam ? (
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-medium text-primary">
                Stage {agent.trustStage}: {TRUST_STAGE_LABELS[agent.trustStage]}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs text-muted-foreground hover:text-destructive"
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
              Add to Team
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (onTeam) {
    return <Link href={`/agents/${agent.id}`}>{cardContent}</Link>;
  }

  return cardContent;
}
