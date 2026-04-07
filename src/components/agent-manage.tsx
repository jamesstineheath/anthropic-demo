"use client";

import * as React from "react";
import Link from "next/link";
import {
  ChevronDown,
  Clock,
  Zap,
  Calendar,
  Brain,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTeam } from "@/components/providers/team-provider";
import { getAgentById, TRUST_STAGE_LABELS, type TrustStage } from "@/lib/agents/data";
import { getAgentManagementData } from "@/lib/agents/management";
import { getIcon } from "@/lib/icons";

function TrustStageBar({ stage }: { stage: TrustStage }) {
  return (
    <div className="flex items-center gap-0.5">
      {[0, 1, 2, 3, 4, 5].map((s) => (
        <div
          key={s}
          className={cn(
            "h-1 flex-1 rounded-full",
            s <= stage ? "bg-foreground/60" : "bg-muted"
          )}
        />
      ))}
    </div>
  );
}

function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
      <div className={cn("h-full rounded-full", color)} style={{ width: `${value * 100}%` }} />
    </div>
  );
}

/** Friendly, non-judgmental status based on how the agent is being used */
function getAgentStatus(agentId: string, trustStage: TrustStage): { label: string; color: string } {
  const mgmt = getAgentManagementData(agentId);
  if (!mgmt) return { label: "", color: "text-muted-foreground" };

  if (trustStage === 0) return { label: "Getting started", color: "text-muted-foreground" };
  if (trustStage >= 4) return { label: "Fully integrated", color: "text-emerald-600" };
  if (mgmt.activity.actionsThisWeek > 5) return { label: "Active", color: "text-emerald-600" };
  if (mgmt.scheduledJobs.some(j => j.status === "active")) return { label: "Running on schedule", color: "text-foreground/60" };
  if (trustStage >= 2) return { label: "Learning your preferences", color: "text-foreground/60" };
  return { label: "Building context", color: "text-muted-foreground" };
}

function ToolToggle({ name, connected }: { name: string; connected: boolean }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm text-muted-foreground">{name}</span>
      <div
        className={cn(
          "relative h-5 w-9 rounded-full transition-colors",
          connected ? "bg-foreground" : "bg-muted"
        )}
      >
        <div
          className={cn(
            "absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform shadow-sm",
            connected ? "translate-x-4" : "translate-x-0.5"
          )}
        />
      </div>
    </div>
  );
}

function AgentCard({ agentId, trustStage }: { agentId: string; trustStage: TrustStage }) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const agent = getAgentById(agentId);
  const mgmt = getAgentManagementData(agentId);
  if (!agent || !mgmt) return null;
  const Icon = getIcon(agent.icon);
  const status = getAgentStatus(agentId, trustStage);

  return (
    <div className="rounded-xl border border-border bg-card transition-shadow hover:shadow-sm">
      {/* Main card — clickable to open agent */}
      <Link href={`/agents/${agentId}`} className="block p-4">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">
            <Icon className="h-4.5 w-4.5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-sm font-semibold">{agent.name}</h3>
              <span className={cn("text-xs", status.color)}>{status.label}</span>
            </div>

            {/* Trust stage */}
            <div className="flex items-center gap-3 mb-2.5">
              <div className="flex-1 max-w-32">
                <TrustStageBar stage={trustStage} />
              </div>
              <span className="text-xs text-muted-foreground">
                {TRUST_STAGE_LABELS[trustStage]}
              </span>
            </div>

            {/* Quick stats row */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {mgmt.activity.lastActive}
              </span>
              {mgmt.activity.actionsThisWeek > 0 && (
                <span className="flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  {mgmt.activity.actionsThisWeek} this week
                </span>
              )}
              {mgmt.scheduledJobs.filter(j => j.status === "active").length > 0 && (
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {mgmt.scheduledJobs.filter(j => j.status === "active").length} jobs
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* Expand toggle — just a chevron */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-center py-1.5 border-t border-border/50 hover:bg-muted/50 transition-colors"
      >
        <ChevronDown className={cn("h-4 w-4 text-muted-foreground transition-transform", isExpanded && "rotate-180")} />
      </button>

      {/* Expanded detail */}
      {isExpanded && (
        <div className="border-t border-border px-4 py-4 space-y-4">
          {/* How it's working */}
          <div>
            <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 mb-2.5">How it&apos;s working</h4>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">Task completion</span>
                  <span className="text-xs font-medium tabular-nums">{Math.round(mgmt.performance.successRate * 100)}%</span>
                </div>
                <ProgressBar value={mgmt.performance.successRate} color="bg-foreground/40" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">Confidence</span>
                  <span className="text-xs font-medium tabular-nums">{Math.round(mgmt.performance.avgConfidence * 100)}%</span>
                </div>
                <ProgressBar value={mgmt.performance.avgConfidence} color="bg-foreground/40" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">Checks with you</span>
                  <span className="text-xs font-medium tabular-nums">{Math.round(mgmt.performance.escalationRate * 100)}%</span>
                </div>
                <ProgressBar value={mgmt.performance.escalationRate} color="bg-muted-foreground/30" />
                <p className="text-[10px] text-muted-foreground/60 mt-1">
                  {mgmt.performance.escalationRate > 0.25
                    ? "Still learning — asks you more often while building context"
                    : mgmt.performance.escalationRate > 0.1
                      ? "Handles most things independently, checks on important decisions"
                      : "Confident and autonomous within its boundaries"
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Scheduled Jobs */}
          {mgmt.scheduledJobs.length > 0 && (
            <div>
              <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 mb-2">Scheduled Jobs</h4>
              <div className="space-y-1">
                {mgmt.scheduledJobs.map((job) => (
                  <div key={job.id} className="flex items-center justify-between rounded-lg border border-border/60 px-3 py-1.5">
                    <div>
                      <span className="text-xs font-medium">{job.name}</span>
                      <span className="text-[10px] text-muted-foreground ml-2">{job.schedule}</span>
                    </div>
                    <span
                      className={cn(
                        "text-[10px] font-medium",
                        job.status === "active" && "text-emerald-600",
                        job.status === "paused" && "text-muted-foreground",
                      )}
                    >
                      {job.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tools & Memory — compact row */}
          <div className="flex gap-6">
            <div className="flex-1">
              <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 mb-2">Tools</h4>
              <div className="space-y-0.5">
                {mgmt.connections.map((c) => (
                  <ToolToggle key={c.name} name={c.name} connected={c.status === "connected"} />
                ))}
              </div>
            </div>
            <div className="flex-1">
              <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 mb-2">Memory</h4>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Brain className="h-3.5 w-3.5" />
                {mgmt.sharedMemory.canWrite
                  ? `Reads & writes shared memory`
                  : mgmt.sharedMemory.memoriesAccessed > 0
                    ? `Reads shared memory`
                    : "Not yet using shared memory"
                }
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function AgentManage() {
  const { teamAgents, mounted } = useTeam();

  if (!mounted) {
    return <div className="p-6 text-sm text-muted-foreground">Loading...</div>;
  }

  if (teamAgents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center px-6">
        <TrendingUp className="h-8 w-8 text-muted-foreground/30 mb-3" />
        <p className="text-sm text-muted-foreground">
          Add agents from the Discover tab to start managing them here.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-3 py-1">
      {teamAgents.map((ta) => (
        <AgentCard key={ta.id} agentId={ta.id} trustStage={ta.trustStage} />
      ))}
    </div>
  );
}
