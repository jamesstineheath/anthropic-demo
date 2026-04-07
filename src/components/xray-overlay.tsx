"use client";

import { X, Terminal, Database, Shield, Gauge } from "lucide-react";
import { useXRay } from "@/components/providers/xray-provider";
import { useTeam } from "@/components/providers/team-provider";
import { useChat } from "@/components/providers/chat-provider";
import {
  getXRayData,
  getTokenDelta,
  CAPABILITY_CLUSTERS,
} from "@/lib/xray/prompts";
import { getIcon } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const TYPE_COLORS = {
  system: "bg-zinc-600",
  native: "bg-blue-500",
  "shared-memory": "bg-emerald-500",
  conversation: "bg-zinc-500",
} as const;

const TYPE_LABELS = {
  system: "System",
  native: "Calendar (native)",
  "shared-memory": "Shared Memory",
  conversation: "Conversation",
} as const;

const LEGEND_DOT_COLORS = {
  system: "bg-zinc-600",
  native: "bg-blue-500",
  "shared-memory": "bg-emerald-500",
  conversation: "bg-zinc-500",
} as const;

export function XRayOverlay() {
  const { isXRayMode, toggleXRay } = useXRay();
  const { getTrustStage } = useTeam();
  const { memory, lastConfidence } = useChat();

  if (!isXRayMode) return null;

  const trustStage = getTrustStage("calendaring");
  const xrayData = getXRayData(
    trustStage,
    memory as Record<string, string>,
    23,
    lastConfidence ?? undefined
  );

  const delta = getTokenDelta(trustStage);

  // Group sources by type for the breakdown
  const systemSources = xrayData.contextSources.filter((s) => s.type === "system");
  const nativeSources = xrayData.contextSources.filter((s) => s.type === "native");
  const sharedSources = xrayData.contextSources.filter((s) => s.type === "shared-memory");
  const convSources = xrayData.contextSources.filter((s) => s.type === "conversation");

  // Group capabilities by cluster prefix
  const clusterGroups: Record<string, typeof xrayData.capabilities> = {};
  for (const cap of xrayData.capabilities) {
    const prefix = cap.cluster.startsWith("XD") ? "XD" : cap.cluster.split(".")[0];
    if (!clusterGroups[prefix]) clusterGroups[prefix] = [];
    clusterGroups[prefix].push(cap);
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-zinc-700 bg-zinc-900 text-zinc-100 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-700 px-4 py-2">
        <div className="flex items-center gap-2">
          <Terminal className="h-3.5 w-3.5 text-emerald-400" />
          <span className="text-xs font-mono font-semibold text-emerald-400">
            X-RAY MODE
          </span>
          <span className="text-[10px] text-zinc-500">
            Stage {trustStage}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-emerald-400">
            ~{xrayData.totalTokens.toLocaleString()} tokens
            {delta > 0 && (
              <span className="text-zinc-500 ml-1">
                (+{delta.toLocaleString()} from L{trustStage - 1})
              </span>
            )}
          </span>
          <Button
            variant="ghost"
            size="icon-xs"
            className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
            onClick={toggleXRay}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-px bg-zinc-700 max-h-[45vh] overflow-y-auto">
        {/* System Prompt */}
        <div className="bg-zinc-900 p-3 md:col-span-2">
          <div className="flex items-center gap-1.5 mb-2">
            <Terminal className="h-3 w-3 text-zinc-500" />
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-500">
              System Prompt
            </span>
          </div>
          <pre className="text-[10px] leading-relaxed text-zinc-300 font-mono whitespace-pre-wrap max-h-[30vh] overflow-y-auto">
            {xrayData.systemPrompt}
          </pre>
        </div>

        {/* Context Window */}
        <div className="bg-zinc-900 p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Database className="h-3 w-3 text-zinc-500" />
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-500">
              Context Window
            </span>
          </div>

          {/* Stacked bar */}
          <div className="h-4 flex rounded-sm overflow-hidden mb-2">
            {xrayData.contextSources.map((source) => (
              <div
                key={source.label}
                className={cn(
                  "transition-all",
                  TYPE_COLORS[source.type]
                )}
                style={{
                  width: `${(source.tokens / xrayData.totalTokens) * 100}%`,
                }}
                title={`${source.label}: ~${source.tokens.toLocaleString()} tokens`}
              />
            ))}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-x-3 gap-y-1 mb-3">
            {(Object.keys(TYPE_LABELS) as Array<keyof typeof TYPE_LABELS>).map((type) => (
              <div key={type} className="flex items-center gap-1">
                <div className={cn("h-2 w-2 rounded-sm", LEGEND_DOT_COLORS[type])} />
                <span className="text-[9px] text-zinc-500">{TYPE_LABELS[type]}</span>
              </div>
            ))}
          </div>

          {/* Grouped breakdown */}
          <div className="space-y-2">
            {/* System */}
            {systemSources.map((s) => (
              <SourceRow key={s.label} label={s.label} tokens={s.tokens} />
            ))}

            {/* Native */}
            {nativeSources.map((s) => (
              <SourceRow key={s.label} label={s.label} tokens={s.tokens} />
            ))}

            {/* Shared Memory */}
            {sharedSources.length > 0 && (
              <div>
                <div className="text-[9px] font-mono uppercase tracking-wider text-emerald-500/70 mb-1">
                  Shared Memory
                </div>
                {sharedSources.map((s) => {
                  const Icon = s.agentIcon ? getIcon(s.agentIcon) : null;
                  return (
                    <div
                      key={s.label}
                      className="flex items-center justify-between pl-3 py-0.5"
                    >
                      <div className="flex items-center gap-1.5">
                        {Icon && <Icon className="h-2.5 w-2.5 text-emerald-400/70" />}
                        <span className="text-[10px] text-zinc-400">
                          {s.agentName || s.label}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500">
                        ~{s.tokens.toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Conversation */}
            {convSources.map((s) => (
              <SourceRow key={s.label} label={s.label} tokens={s.tokens} />
            ))}

            {/* Total */}
            <div className="border-t border-zinc-700 pt-1.5 flex items-center justify-between">
              <span className="text-[10px] font-semibold text-zinc-300">
                Total
              </span>
              <span className="text-[10px] font-mono font-semibold text-emerald-400">
                ~{xrayData.totalTokens.toLocaleString()} tokens
              </span>
            </div>
          </div>

          {/* Confidence */}
          {xrayData.confidence && (
            <div className="mt-4">
              <div className="flex items-center gap-1.5 mb-1.5">
                <Gauge className="h-3 w-3 text-zinc-500" />
                <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-500">
                  Confidence
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "text-xs font-mono font-semibold",
                    xrayData.confidence.score === "high" && "text-emerald-400",
                    xrayData.confidence.score === "medium" && "text-yellow-400",
                    xrayData.confidence.score === "low" && "text-red-400"
                  )}
                >
                  {xrayData.confidence.score.toUpperCase()}
                </span>
              </div>
              <p className="text-[10px] text-zinc-500 mt-0.5">
                {xrayData.confidence.reason}
              </p>
            </div>
          )}
        </div>

        {/* Capability Gates — organized by cluster */}
        <div className="bg-zinc-900 p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Shield className="h-3 w-3 text-zinc-500" />
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-500">
              Capability Gates
            </span>
          </div>
          <div className="space-y-2.5">
            {Object.entries(clusterGroups).map(([prefix, caps]) => (
              <div key={prefix}>
                <div className="text-[9px] font-mono uppercase tracking-wider text-zinc-600 mb-0.5">
                  {CAPABILITY_CLUSTERS[prefix] || prefix}
                </div>
                <div className="space-y-0.5">
                  {caps.map((cap) => (
                    <div
                      key={cap.cluster}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px]">
                          {cap.unlocked ? "✅" : "🔒"}
                        </span>
                        <span
                          className={cn(
                            "text-[10px]",
                            cap.unlocked ? "text-zinc-300" : "text-zinc-600"
                          )}
                        >
                          {cap.name}
                        </span>
                      </div>
                      <span className="text-[9px] font-mono text-zinc-600">
                        {cap.cluster}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SourceRow({ label, tokens }: { label: string; tokens: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[10px] text-zinc-400">{label}</span>
      <span className="text-[10px] font-mono text-zinc-500">
        ~{tokens.toLocaleString()}
      </span>
    </div>
  );
}
