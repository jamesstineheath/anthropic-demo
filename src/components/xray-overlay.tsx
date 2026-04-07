"use client";

import { X, Terminal, Database, Shield, Gauge } from "lucide-react";
import { useXRay } from "@/components/providers/xray-provider";
import { useTeam } from "@/components/providers/team-provider";
import { useChat } from "@/components/providers/chat-provider";
import { getXRayData } from "@/lib/xray/prompts";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

  const totalTokens = xrayData.contextWindow.reduce(
    (sum, item) => sum + item.tokens,
    0
  );

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
            Stage {trustStage} · {totalTokens} tokens
          </span>
        </div>
        <Button
          variant="ghost"
          size="icon-xs"
          className="text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800"
          onClick={toggleXRay}
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Content — horizontal sections */}
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
          <div className="space-y-1.5">
            {xrayData.contextWindow.map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <span className="text-[10px] text-zinc-400">{item.label}</span>
                <span className="text-[10px] font-mono text-zinc-300">
                  ~{item.tokens}
                </span>
              </div>
            ))}
            <div className="border-t border-zinc-700 pt-1.5 flex items-center justify-between">
              <span className="text-[10px] font-semibold text-zinc-300">
                Total
              </span>
              <span className="text-[10px] font-mono font-semibold text-emerald-400">
                ~{totalTokens} tokens
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
                    xrayData.confidence.score === "high" &&
                      "text-emerald-400",
                    xrayData.confidence.score === "medium" &&
                      "text-yellow-400",
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

        {/* Capability Gates */}
        <div className="bg-zinc-900 p-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Shield className="h-3 w-3 text-zinc-500" />
            <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-zinc-500">
              Capability Gates
            </span>
          </div>
          <div className="space-y-1">
            {xrayData.capabilities.map((cap) => (
              <div
                key={cap.name}
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
                  S{cap.stage}+
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
