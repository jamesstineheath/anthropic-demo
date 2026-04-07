"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  MEMORY_ITEMS,
  getConnectionCount,
  type MemoryItem,
} from "@/lib/memory/data";
import type { AgentCategory } from "@/lib/agents/data";
import { MemoryCard } from "./memory-card";

const CATEGORIES: Array<AgentCategory | "All"> = [
  "All",
  "Daily Life",
  "Health & Wellness",
  "Work",
  "Relationships",
  "Money",
  "Life Events",
  "Learning & Growth",
  "Creative",
];

interface MemoryGridProps {
  selectedMemoryId: string | null;
  onSelectMemory: (id: string) => void;
  className?: string;
}

export function MemoryGrid({
  selectedMemoryId,
  onSelectMemory,
  className,
}: MemoryGridProps) {
  const [category, setCategory] = React.useState<AgentCategory | "All">("All");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  // Pre-compute connection counts
  const connectionCounts = React.useMemo(() => {
    const counts = new Map<string, number>();
    for (const mem of MEMORY_ITEMS) {
      counts.set(mem.id, getConnectionCount(mem.id));
    }
    return counts;
  }, []);

  const filtered = React.useMemo(() => {
    let items: MemoryItem[] = MEMORY_ITEMS;

    // Category filter
    if (category !== "All") {
      items = items.filter((m) => m.domain === category);
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (m) =>
          m.content.toLowerCase().includes(q) ||
          m.detail.toLowerCase().includes(q) ||
          m.sourceAgentName.toLowerCase().includes(q) ||
          (m.crossAgentName?.toLowerCase().includes(q) ?? false)
      );
    }

    // Sort: connected items first, then by confidence
    return items.sort((a, b) => {
      const ac = connectionCounts.get(a.id) ?? 0;
      const bc = connectionCounts.get(b.id) ?? 0;
      if (ac !== bc) return bc - ac;
      return b.confidence - a.confidence;
    });
  }, [category, searchQuery, connectionCounts]);

  return (
    <div className={cn("flex h-full flex-col", className)}>
      {/* Header */}
      <div className="shrink-0 border-b border-border px-4 py-2 flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-foreground shrink-0">
          Knowledge Base
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
              {filtered.length} memories
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

      {/* Category tabs */}
      <div className="shrink-0 border-b border-border">
        <div className="flex overflow-x-auto px-2 py-1.5 gap-0.5 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                "shrink-0 rounded-md px-2.5 py-1 text-xs font-medium transition-all whitespace-nowrap",
                category === cat
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Card grid */}
      <div className="flex-1 overflow-y-auto px-3 py-3">
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-sm text-muted-foreground">
            {searchQuery
              ? `No memories match "${searchQuery}"`
              : "No memories in this category."}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5">
            {filtered.map((mem) => (
              <MemoryCard
                key={mem.id}
                memory={mem}
                connectionCount={connectionCounts.get(mem.id) ?? 0}
                isSelected={selectedMemoryId === mem.id}
                onClick={() => onSelectMemory(mem.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
