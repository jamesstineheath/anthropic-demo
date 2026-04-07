"use client";

import { useState } from "react";
import { X, Terminal, Database, Shield, Gauge, ChevronDown, ChevronUp, Check, Lock, Wrench, Cpu, ArrowDownToLine } from "lucide-react";
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
  tools: "bg-amber-500",
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

  const toolsSources = xrayData.contextSources.filter((s) => s.type === "tools");
  const systemSources = xrayData.contextSources.filter((s) => s.type === "system");
  const nativeSources = xrayData.contextSources.filter((s) => s.type === "native");
  const sharedSources = xrayData.contextSources.filter((s) => s.type === "shared-memory");
  const convSources = xrayData.contextSources.filter((s) => s.type === "conversation");

  const unlockedTools = xrayData.tools.filter((t) => t.unlocked);
  const lockedTools = xrayData.tools.filter((t) => !t.unlocked);

  const promptLines = xrayData.systemPrompt.split("\n").filter(Boolean);
  const promptPreview = promptLines.slice(0, 3).join("\n");

  // Retrieval ratio for the visual indicator
  const retrievalPct = Math.round((xrayData.retrievedTokens / xrayData.availableTokens) * 100);

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
          <span className="text-xs font-mono text-zinc-600 border border-zinc-700 rounded px-1.5 py-0.5">
            {xrayData.modelId}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <ArrowDownToLine className="h-3 w-3 text-zinc-500" />
              <span className="text-sm font-mono text-zinc-400">
                ~{xrayData.retrievedTokens.toLocaleString()}
              </span>
              <span className="text-xs text-zinc-600">retrieved</span>
            </div>
            <span className="text-zinc-700">/</span>
            <div className="flex items-center gap-1.5">
              <Database className="h-3 w-3 text-zinc-500" />
              <span className="text-sm font-mono text-zinc-400">
                ~{xrayData.availableTokens.toLocaleString()}
              </span>
              <span className="text-xs text-zinc-600">indexed</span>
            </div>
          </div>
          {delta > 0 && (
            <span className="text-xs text-zinc-600">
              (+{delta.toLocaleString()} from Stage {trustStage - 1})
            </span>
          )}
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

      {/* 4-column content */}
      <div className="grid grid-cols-4 gap-px bg-zinc-700">
        {/* Column 1: System Prompt */}
        <div className="bg-zinc-900 p-4 overflow-y-auto" style={{ maxHeight: "45vh" }}>
          <div className="flex items-center gap-2 mb-3">
            <Terminal className="h-3.5 w-3.5 text-zinc-500" />
            <span className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
              System Prompt
            </span>
          </div>
          <pre className="text-[11px] leading-relaxed text-zinc-300 font-mono whitespace-pre-wrap">
            {promptExpanded ? xrayData.systemPrompt : promptPreview}
            {!promptExpanded && promptLines.length > 3 && "…"}
          </pre>
          {promptLines.length > 3 && (
            <button
              onClick={() => setPromptExpanded(!promptExpanded)}
              className="mt-2 flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              {promptExpanded ? (
                <><ChevronUp className="h-3.5 w-3.5" /> Collapse</>
              ) : (
                <><ChevronDown className="h-3.5 w-3.5" /> Show full prompt ({promptLines.length} lines)</>
              )}
            </button>
          )}
        </div>

        {/* Column 2: Tools (Function Calling) */}
        <div className="bg-zinc-900 p-4 overflow-y-auto" style={{ maxHeight: "45vh" }}>
          <div className="flex items-center gap-2 mb-3">
            <Wrench className="h-3.5 w-3.5 text-zinc-500" />
            <span className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
              Tools
            </span>
            <span className="text-xs font-mono text-zinc-600">
              {unlockedTools.length}/{xrayData.tools.length}
            </span>
          </div>

          {trustStage === 0 ? (
            <div className="text-sm text-zinc-600 italic">
              No tools available at Stage 0 — conversational only
            </div>
          ) : (
            <div className="space-y-1">
              {unlockedTools.map((tool) => (
                <div key={tool.name} className="group">
                  <div className="flex items-center gap-2">
                    <Check className="h-3 w-3 text-emerald-400 shrink-0" />
                    <span className="text-xs font-mono text-emerald-300">{tool.name}</span>
                  </div>
                  <p className="text-[11px] text-zinc-500 pl-5 leading-snug">{tool.description}</p>
                </div>
              ))}
              {lockedTools.length > 0 && (
                <div className="border-t border-zinc-800 mt-3 pt-2">
                  <div className="text-[10px] uppercase tracking-wider text-zinc-600 mb-1.5">Locked</div>
                  {lockedTools.map((tool) => (
                    <div key={tool.name} className="flex items-center gap-2 py-0.5">
                      <Lock className="h-2.5 w-2.5 text-zinc-700 shrink-0" />
                      <span className="text-xs font-mono text-zinc-700">{tool.name}</span>
                      <span className="text-[10px] text-zinc-700 ml-auto">Stage {tool.stage}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Column 3: Context Window (Retrieved per request) */}
        <div className="bg-zinc-900 p-4 overflow-y-auto" style={{ maxHeight: "45vh" }}>
          <div className="flex items-center gap-2 mb-3">
            <Database className="h-3.5 w-3.5 text-zinc-500" />
            <span className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
              Per-Request Context
            </span>
          </div>

          {/* Retrieval indicator */}
          <div className="mb-3 rounded-lg border border-zinc-800 bg-zinc-950 p-2.5">
            <div className="flex items-center justify-between text-[11px] mb-1.5">
              <span className="text-zinc-500">Retrieved from indexed data</span>
              <span className="font-mono text-zinc-400">{retrievalPct}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-zinc-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-emerald-500/70 transition-all"
                style={{ width: `${retrievalPct}%` }}
              />
            </div>
            <p className="text-[10px] text-zinc-600 mt-1.5 leading-snug">
              Agent retrieves relevant context via tool calls, not the full data store
            </p>
          </div>

          {/* Stacked bar */}
          <div className="h-6 flex rounded overflow-hidden mb-2">
            {xrayData.contextSources.map((source) => (
              <div
                key={source.label}
                className={cn("transition-all", TYPE_COLORS[source.type])}
                style={{ width: `${Math.max((source.tokens / xrayData.retrievedTokens) * 100, 1)}%` }}
                title={`${source.label}: ~${source.tokens.toLocaleString()} tokens`}
              />
            ))}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-x-2.5 gap-y-1 mb-3">
            {(["system", "tools", "native", "shared-memory", "conversation"] as const).map((type) => (
              <div key={type} className="flex items-center gap-1">
                <div className={cn("h-2 w-2 rounded-sm", TYPE_COLORS[type])} />
                <span className="text-[11px] text-zinc-500">
                  {{ system: "System", tools: "Tools", native: "Calendar", "shared-memory": "Shared Memory", conversation: "Chat" }[type]}
                </span>
              </div>
            ))}
          </div>

          {/* Source breakdown */}
          <div className="space-y-1">
            {systemSources.map((s) => (
              <SourceRow key={s.label} label={s.label} tokens={s.tokens} />
            ))}
            {toolsSources.map((s) => (
              <SourceRow key={s.label} label={s.label} tokens={s.tokens} />
            ))}
            {nativeSources.map((s) => (
              <SourceRow key={s.label} label={s.label} tokens={s.tokens} />
            ))}
            {sharedSources.length > 0 && (
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400/80 mt-2 mb-1">
                  Shared Memory (via RAG)
                </div>
                {sharedSources.map((s) => {
                  const Icon = s.agentIcon ? getIcon(s.agentIcon) : null;
                  return (
                    <div key={s.label} className="flex items-center justify-between pl-2 py-0.5">
                      <div className="flex items-center gap-1.5">
                        {Icon && <Icon className="h-3 w-3 text-emerald-400/70" />}
                        <span className="text-xs text-zinc-300">{s.agentName || s.label}</span>
                      </div>
                      <span className="text-xs font-mono text-zinc-500">~{s.tokens.toLocaleString()}</span>
                    </div>
                  );
                })}
              </div>
            )}
            {convSources.map((s) => (
              <SourceRow key={s.label} label={s.label} tokens={s.tokens} />
            ))}
            <div className="border-t border-zinc-700 pt-1.5 mt-1.5 flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-300">Per-request total</span>
              <span className="text-xs font-mono font-bold text-emerald-400">
                ~{xrayData.retrievedTokens.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Confidence callout */}
          {xrayData.confidence && (
            <div className={cn(
              "mt-3 rounded-lg border p-2.5",
              xrayData.confidence.score === "high" && "border-emerald-700 bg-emerald-900/30",
              xrayData.confidence.score === "medium" && "border-yellow-700 bg-yellow-900/30",
              xrayData.confidence.score === "low" && "border-red-700 bg-red-900/30"
            )}>
              <div className="flex items-center gap-2 mb-1">
                <Gauge className="h-3 w-3 text-zinc-400" />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Confidence</span>
                <span className={cn(
                  "text-xs font-mono font-bold ml-auto",
                  xrayData.confidence.score === "high" && "text-emerald-400",
                  xrayData.confidence.score === "medium" && "text-yellow-400",
                  xrayData.confidence.score === "low" && "text-red-400"
                )}>
                  {xrayData.confidence.score.toUpperCase()}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-snug">
                {xrayData.confidence.reason}
              </p>
            </div>
          )}
        </div>

        {/* Column 4: Capabilities */}
        <div className="bg-zinc-900 p-4 overflow-y-auto" style={{ maxHeight: "45vh" }}>
          <div className="flex items-center gap-2 mb-3">
            <Shield className="h-3.5 w-3.5 text-zinc-500" />
            <span className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
              Capabilities
            </span>
          </div>
          <div className="space-y-3">
            {(() => {
              const clusterGroups: Record<string, typeof xrayData.capabilities> = {};
              for (const cap of xrayData.capabilities) {
                const prefix = cap.cluster.startsWith("XD") ? "XD" : cap.cluster.split(".")[0];
                if (!clusterGroups[prefix]) clusterGroups[prefix] = [];
                clusterGroups[prefix].push(cap);
              }
              return Object.entries(clusterGroups).map(([prefix, caps]) => (
                <div key={prefix}>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 mb-1.5">
                    {CAPABILITY_CLUSTERS[prefix] || prefix}
                  </div>
                  <div className="space-y-1">
                    {caps.map((cap) => (
                      <div key={cap.cluster} className="flex items-center justify-between gap-1.5">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className={cn(
                            "flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full",
                            cap.unlocked
                              ? "bg-emerald-500/20"
                              : "bg-zinc-700/50"
                          )}>
                            {cap.unlocked
                              ? <Check className="h-2 w-2 text-emerald-400" />
                              : <Lock className="h-1.5 w-1.5 text-zinc-600" />
                            }
                          </span>
                          <span className={cn(
                            "text-xs truncate",
                            cap.unlocked ? "text-zinc-200" : "text-zinc-600"
                          )}>
                            {cap.name}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-zinc-600 shrink-0">
                          {cap.unlocked ? "" : `Stage ${cap.stage}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ));
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}

function SourceRow({ label, tokens }: { label: string; tokens: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-zinc-400">{label}</span>
      <span className="text-xs font-mono text-zinc-500">~{tokens.toLocaleString()}</span>
    </div>
  );
}
