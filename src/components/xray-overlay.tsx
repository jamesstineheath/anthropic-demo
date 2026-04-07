"use client";

import { useState } from "react";
import { X, Terminal, Database, Shield, Gauge, ChevronDown, ChevronUp } from "lucide-react";
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

export function XRayOverlay() {
  const { isXRayMode, toggleXRay } = useXRay();
  const { getTrustStage } = useTeam();
  const { memory, lastConfidence } = useChat();
  const [promptExpanded, setPromptExpanded] = useState(false);

  if (!isXRayMode) return null;

  const trustStage = getTrustStage("calendaring");
  const xrayData = getXRayData(
    trustStage,
    memory as Record<string, string>,
    23,
    lastConfidence ?? undefined
  );

  const delta = getTokenDelta(trustStage);
  const stageName = ["Onboarding", "General Assistant", "Personal Advisor", "Active Analyst", "Proactive Partner", "Trusted Delegate"][trustStage];

  const systemSources = xrayData.contextSources.filter((s) => s.type === "system");
  const nativeSources = xrayData.contextSources.filter((s) => s.type === "native");
  const sharedSources = xrayData.contextSources.filter((s) => s.type === "shared-memory");
  const convSources = xrayData.contextSources.filter((s) => s.type === "conversation");

  const clusterGroups: Record<string, typeof xrayData.capabilities> = {};
  for (const cap of xrayData.capabilities) {
    const prefix = cap.cluster.startsWith("XD") ? "XD" : cap.cluster.split(".")[0];
    if (!clusterGroups[prefix]) clusterGroups[prefix] = [];
    clusterGroups[prefix].push(cap);
  }

  const promptLines = xrayData.systemPrompt.split("\n").filter(Boolean);
  const promptPreview = promptLines.slice(0, 3).join("\n");

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 border-t border-zinc-700 bg-zinc-900 text-zinc-100 shadow-2xl"
      data-tour="xray-panel"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-700 px-4 py-2.5">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-emerald-400" />
            <span className="text-sm font-mono font-semibold text-emerald-400 uppercase tracking-wide">
              X-RAY
            </span>
          </div>
          <span className="text-sm text-zinc-400">
            Stage {trustStage} · {stageName}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="text-lg font-mono font-bold text-emerald-400">
              ~{xrayData.totalTokens.toLocaleString()}
            </span>
            <span className="text-sm text-zinc-400">tokens</span>
            {delta > 0 && (
              <span className="text-sm text-zinc-500">
                (+{delta.toLocaleString()} from L{trustStage - 1})
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon-xs"
            className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
            onClick={toggleXRay}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* 3-column content */}
      <div className="grid grid-cols-3 gap-px bg-zinc-700 max-h-[45vh] overflow-hidden">
        {/* Column 1: System Prompt */}
        <div className="bg-zinc-900 p-4 overflow-y-auto">
          <div className="flex items-center gap-2 mb-3">
            <Terminal className="h-3.5 w-3.5 text-zinc-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              System Prompt
            </span>
          </div>
          <pre className="text-[13px] leading-relaxed text-zinc-300 font-mono whitespace-pre-wrap">
            {promptExpanded ? xrayData.systemPrompt : promptPreview}
            {!promptExpanded && promptLines.length > 3 && "…"}
          </pre>
          {promptLines.length > 3 && (
            <button
              onClick={() => setPromptExpanded(!promptExpanded)}
              className="mt-2 flex items-center gap-1 text-[13px] text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {promptExpanded ? (
                <><ChevronUp className="h-3.5 w-3.5" /> Hide full prompt</>
              ) : (
                <><ChevronDown className="h-3.5 w-3.5" /> Show full prompt</>
              )}
            </button>
          )}
        </div>

        {/* Column 2: Context Window */}
        <div className="bg-zinc-900 p-4 overflow-y-auto">
          <div className="flex items-center gap-2 mb-3">
            <Database className="h-3.5 w-3.5 text-zinc-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Context Window
            </span>
          </div>

          {/* Stacked bar — h-8 */}
          <div className="h-8 flex rounded overflow-hidden mb-3">
            {xrayData.contextSources.map((source) => (
              <div
                key={source.label}
                className={cn("transition-all", TYPE_COLORS[source.type])}
                style={{ width: `${(source.tokens / xrayData.totalTokens) * 100}%` }}
                title={`${source.label}: ~${source.tokens.toLocaleString()} tokens`}
              />
            ))}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-x-3 gap-y-1 mb-4">
            {(["system", "native", "shared-memory", "conversation"] as const).map((type) => (
              <div key={type} className="flex items-center gap-1.5">
                <div className={cn("h-2.5 w-2.5 rounded-sm", TYPE_COLORS[type])} />
                <span className="text-[12px] text-zinc-500">
                  {{ system: "System", native: "Calendar", "shared-memory": "Shared", conversation: "Chat" }[type]}
                </span>
              </div>
            ))}
          </div>

          {/* Source breakdown */}
          <div className="space-y-1.5">
            {systemSources.map((s) => (
              <SourceRow key={s.label} label={s.label} tokens={s.tokens} />
            ))}
            {nativeSources.map((s) => (
              <SourceRow key={s.label} label={s.label} tokens={s.tokens} />
            ))}
            {sharedSources.length > 0 && (
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400/80 mt-3 mb-1.5">
                  SHARED MEMORY
                </div>
                {sharedSources.map((s) => {
                  const Icon = s.agentIcon ? getIcon(s.agentIcon) : null;
                  return (
                    <div key={s.label} className="flex items-center justify-between pl-3 py-0.5">
                      <div className="flex items-center gap-2">
                        {Icon && <Icon className="h-3 w-3 text-emerald-400/70" />}
                        <span className="text-[13px] text-zinc-300">{s.agentName || s.label}</span>
                      </div>
                      <span className="text-[13px] font-mono text-zinc-500">~{s.tokens.toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>
            )}
            {convSources.map((s) => (
              <SourceRow key={s.label} label={s.label} tokens={s.tokens} />
            ))}
            <div className="border-t border-zinc-700 pt-2 mt-2 flex items-center justify-between">
              <span className="text-[13px] font-semibold text-zinc-300">Total</span>
              <span className="text-[13px] font-mono font-bold text-emerald-400">
                ~{xrayData.totalTokens.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Confidence callout */}
          {xrayData.confidence && (
            <div className={cn(
              "mt-4 rounded-lg border p-3",
              xrayData.confidence.score === "high" && "border-emerald-700 bg-emerald-900/30",
              xrayData.confidence.score === "medium" && "border-yellow-700 bg-yellow-900/30",
              xrayData.confidence.score === "low" && "border-red-700 bg-red-900/30"
            )}>
              <div className="flex items-center gap-2 mb-1.5">
                <Gauge className="h-3.5 w-3.5 text-zinc-400" />
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Confidence</span>
              </div>
              <div className={cn(
                "text-lg font-mono font-bold mb-1",
                xrayData.confidence.score === "high" && "text-emerald-400",
                xrayData.confidence.score === "medium" && "text-yellow-400",
                xrayData.confidence.score === "low" && "text-red-400"
              )}>
                {xrayData.confidence.score.toUpperCase()}
              </div>
              <p className="text-[13px] text-zinc-400 leading-relaxed">
                {xrayData.confidence.reason}
              </p>
            </div>
          )}
        </div>

        {/* Column 3: Capabilities */}
        <div className="bg-zinc-900 p-4 overflow-y-auto">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="h-3.5 w-3.5 text-zinc-500" />
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Capabilities
            </span>
          </div>
          <div className="space-y-4">
            {Object.entries(clusterGroups).map(([prefix, caps]) => (
              <div key={prefix}>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                  {CAPABILITY_CLUSTERS[prefix] || prefix}
                </div>
                <div className="space-y-1.5">
                  {caps.map((cap) => (
                    <div key={cap.cluster} className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-sm shrink-0">
                          {cap.unlocked ? "✅" : "○"}
                        </span>
                        <span className={cn(
                          "text-[13px] truncate",
                          cap.unlocked ? "text-zinc-200" : "text-zinc-600"
                        )}>
                          {cap.name}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-zinc-600 shrink-0">
                        {cap.unlocked ? cap.cluster : `Stage ${cap.stage}`}
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
      <span className="text-[13px] text-zinc-400">{label}</span>
      <span className="text-[13px] font-mono text-zinc-500">~{tokens.toLocaleString()}</span>
    </div>
  );
}
