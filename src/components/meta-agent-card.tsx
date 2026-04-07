"use client";

import { Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { type Agent, getAgentById } from "@/lib/agents/data";
import { getIcon } from "@/lib/icons";

interface MetaAgentCardProps {
  agent: Agent;
}

export function MetaAgentCard({ agent }: MetaAgentCardProps) {
  const Icon = getIcon(agent.icon);

  return (
    <Tooltip>
      <TooltipTrigger>
        <Card className="relative border border-border/60 bg-card/50 opacity-75 text-left transition-opacity hover:opacity-90">
          <CardContent className="p-5">
            {/* Lock indicator */}
            <div className="absolute right-4 top-4">
              <Lock className="h-3.5 w-3.5 text-muted-foreground/50" />
            </div>

            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-muted-foreground">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold leading-tight text-foreground/70">
                  {agent.name}
                </h3>
                <span className="text-[10px] font-medium text-muted-foreground">
                  Meta Agent
                </span>
              </div>
            </div>

            {/* Description */}
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground/70">
              {agent.description}
            </p>

            {/* Prerequisites */}
            {agent.prerequisites && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {agent.prerequisites.map((prereq) => {
                  const prereqAgent = getAgentById(prereq.agentId);
                  return (
                    <Badge
                      key={prereq.agentId}
                      variant="outline"
                      className="text-[10px] font-normal text-muted-foreground"
                    >
                      {prereqAgent?.name ?? prereq.agentId} L
                      {prereq.minTrustStage}+
                    </Badge>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </TooltipTrigger>
      <TooltipContent side="top">
        <p>
          Meta agents unlock when their prerequisites reach the required
          trust levels.
        </p>
      </TooltipContent>
    </Tooltip>
  );
}
