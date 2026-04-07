"use client";

import { Link2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MemoryItem } from "@/lib/memory/data";
import { Badge } from "@/components/ui/badge";

function ConfidenceDot({ value }: { value: number }) {
  return (
    <span
      className={cn(
        "inline-block h-2 w-2 rounded-full shrink-0",
        value >= 0.85
          ? "bg-emerald-500"
          : value >= 0.7
            ? "bg-amber-500"
            : "bg-orange-400"
      )}
    />
  );
}

interface MemoryCardProps {
  memory: MemoryItem;
  connectionCount: number;
  isSelected: boolean;
  onClick: () => void;
}

export function MemoryCard({
  memory,
  connectionCount,
  isSelected,
  onClick,
}: MemoryCardProps) {
  const summary = memory.detail
    ? memory.detail.split(".")[0] + "."
    : memory.content;

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full text-left rounded-xl border p-3.5 transition-all",
        "hover:border-primary/30 hover:shadow-sm",
        isSelected
          ? "border-primary/40 bg-primary/5 shadow-sm"
          : "border-border bg-card"
      )}
    >
      <h3 className="text-sm font-medium text-foreground leading-snug line-clamp-2">
        {memory.content}
      </h3>

      {memory.detail && (
        <p className="mt-1 text-xs text-muted-foreground leading-relaxed line-clamp-1">
          {summary}
        </p>
      )}

      <div className="mt-2.5 flex items-center gap-2">
        <Badge
          variant="secondary"
          className="text-[10px] font-normal py-0 h-4 px-1.5"
        >
          {memory.sourceAgentName}
        </Badge>

        <ConfidenceDot value={memory.confidence} />

        {connectionCount > 0 && (
          <span className="ml-auto flex items-center gap-0.5 text-[10px] text-muted-foreground/60">
            <Link2 className="h-3 w-3" />
            {connectionCount}
          </span>
        )}
      </div>
    </button>
  );
}
