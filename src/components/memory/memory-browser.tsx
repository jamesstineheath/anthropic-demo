"use client";

import * as React from "react";
import {
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  ArrowRight,
  Search,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getIcon } from "@/lib/icons";
import { getMemoriesByDomain, type MemoryItem, type MemoryDomain } from "@/lib/memory/data";
import { Badge } from "@/components/ui/badge";

function ConfidenceBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-20 rounded-full bg-muted overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            value >= 0.85
              ? "bg-emerald-500"
              : value >= 0.7
                ? "bg-amber-500"
                : "bg-orange-400"
          )}
          style={{ width: `${value * 100}%` }}
        />
      </div>
      <span className="text-xs text-muted-foreground tabular-nums">
        {Math.round(value * 100)}%
      </span>
    </div>
  );
}

function SimpleMemoryItem({ memory }: { memory: MemoryItem }) {
  return (
    <div className="flex items-start gap-2.5 px-3 py-1.5">
      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/30" />
      <span className="text-sm text-muted-foreground leading-relaxed flex-1">
        {memory.content}
      </span>
      {memory.crossAgentName && (
        <span className="shrink-0 mt-0.5">
          <Sparkles className="h-3 w-3 text-primary/60" />
        </span>
      )}
    </div>
  );
}

function MemoryItemCard({
  memory,
  isExpanded,
  onToggle,
}: {
  memory: MemoryItem;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const [feedback, setFeedback] = React.useState<"up" | "down" | null>(null);

  if (memory.isSimple) {
    return <SimpleMemoryItem memory={memory} />;
  }

  return (
    <div
      className={cn(
        "rounded-lg border transition-all",
        isExpanded
          ? "border-border bg-card shadow-sm"
          : "border-transparent hover:border-border hover:bg-card/50"
      )}
    >
      <button
        onClick={onToggle}
        className="flex w-full items-start gap-2.5 px-3 py-2.5 text-left"
      >
        <ChevronRight
          className={cn(
            "mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform",
            isExpanded && "rotate-90"
          )}
        />
        <span className="text-sm text-foreground leading-relaxed flex-1">
          {memory.content}
        </span>
        {memory.crossAgentName && (
          <span className="shrink-0 mt-0.5">
            <Sparkles className="h-3 w-3 text-primary/60" />
          </span>
        )}
      </button>

      {isExpanded && (
        <div className="px-3 pb-3 pl-9 space-y-3">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {memory.detail}
          </p>

          <div className="space-y-2">
            {/* Source */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="text-muted-foreground/60 w-16 shrink-0">Source</span>
              <span>{memory.sourceDescription}</span>
            </div>

            {/* Agent attribution */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="text-muted-foreground/60 w-16 shrink-0">Learned by</span>
              <Badge variant="secondary" className="text-xs font-normal py-0 h-5">
                {memory.sourceAgentName}
              </Badge>
              {memory.crossAgentName && (
                <>
                  <ArrowRight className="h-3 w-3 text-muted-foreground/40" />
                  <Badge variant="secondary" className="text-xs font-normal py-0 h-5">
                    {memory.crossAgentName}
                  </Badge>
                </>
              )}
            </div>

            {/* Confidence */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="text-muted-foreground/60 w-16 shrink-0">Confidence</span>
              <ConfidenceBar value={memory.confidence} />
            </div>

            {/* Timing */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="text-muted-foreground/60 w-16 shrink-0">Learned</span>
              <span>{memory.learnedAt}</span>
            </div>
          </div>

          {/* Feedback */}
          <div className="flex items-center gap-1 pt-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setFeedback(feedback === "up" ? null : "up");
              }}
              className={cn(
                "flex items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors",
                feedback === "up"
                  ? "bg-emerald-500/10 text-emerald-600"
                  : "text-muted-foreground/60 hover:text-muted-foreground hover:bg-muted"
              )}
            >
              <ThumbsUp className="h-3 w-3" />
              <span>Accurate</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setFeedback(feedback === "down" ? null : "down");
              }}
              className={cn(
                "flex items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors",
                feedback === "down"
                  ? "bg-red-500/10 text-red-600"
                  : "text-muted-foreground/60 hover:text-muted-foreground hover:bg-muted"
              )}
            >
              <ThumbsDown className="h-3 w-3" />
              <span>Incorrect</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function DomainSection({ domain }: { domain: MemoryDomain }) {
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const Icon = getIcon(domain.icon);

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 px-3 py-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">
          {domain.name}
        </span>
        <span className="text-xs text-muted-foreground/60 ml-auto">
          {domain.memories.length} {domain.memories.length === 1 ? "memory" : "memories"}
        </span>
      </div>
      <div className="space-y-0.5">
        {domain.memories.map((mem) => (
          <MemoryItemCard
            key={mem.id}
            memory={mem}
            isExpanded={expandedId === mem.id}
            onToggle={() =>
              setExpandedId(expandedId === mem.id ? null : mem.id)
            }
          />
        ))}
      </div>
    </div>
  );
}

export function MemoryBrowser() {
  const allDomains = React.useMemo(() => getMemoriesByDomain(), []);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  const filteredDomains = React.useMemo(() => {
    if (!searchQuery.trim()) return allDomains;
    const q = searchQuery.toLowerCase();
    return allDomains
      .map((domain) => ({
        ...domain,
        memories: domain.memories.filter(
          (m) =>
            m.content.toLowerCase().includes(q) ||
            m.detail.toLowerCase().includes(q) ||
            m.sourceAgentName.toLowerCase().includes(q) ||
            (m.crossAgentName?.toLowerCase().includes(q) ?? false)
        ),
      }))
      .filter((d) => d.memories.length > 0);
  }, [allDomains, searchQuery]);

  const totalMemories = allDomains.reduce((sum, d) => sum + d.memories.length, 0);
  const filteredCount = filteredDomains.reduce((sum, d) => sum + d.memories.length, 0);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="shrink-0 border-b border-border px-4 py-2 flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-foreground shrink-0">
          Explore Memory
        </span>

        {isSearchOpen ? (
          <div className="flex items-center gap-1.5 flex-1 max-w-xs">
            <Search className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <input
              autoFocus
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search memories..."
              className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground/50 focus:outline-none"
            />
            <button
              onClick={() => {
                setSearchQuery("");
                setIsSearchOpen(false);
              }}
              className="shrink-0 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {totalMemories} memories
            </span>
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <Search className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Domain list */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
        {searchQuery && (
          <div className="px-3 text-xs text-muted-foreground">
            {filteredCount} {filteredCount === 1 ? "result" : "results"} for &ldquo;{searchQuery}&rdquo;
          </div>
        )}
        {filteredDomains.map((domain) => (
          <DomainSection key={domain.name} domain={domain} />
        ))}
        {searchQuery && filteredDomains.length === 0 && (
          <div className="text-center py-8 text-sm text-muted-foreground">
            No memories match your search.
          </div>
        )}
      </div>
    </div>
  );
}
