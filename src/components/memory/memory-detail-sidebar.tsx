"use client";

import * as React from "react";
import {
  X,
  MoreHorizontal,
  ArrowRight,
  ThumbsUp,
  ChevronRight,
  Link2,
  Pencil,
  Trash2,
  EyeOff,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getMemoryById,
  getConnectionsFor,
  type MemoryItem,
  type RelationshipType,
} from "@/lib/memory/data";
import { Badge } from "@/components/ui/badge";

const RELATIONSHIP_STYLES: Record<
  RelationshipType,
  { label: string; color: string }
> = {
  influences: { label: "Influences", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  supports: { label: "Supports", color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  contradicts: { label: "Contradicts", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
  related: { label: "Related", color: "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400" },
  "learned-together": { label: "Learned together", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" },
};

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

interface MemoryDetailSidebarProps {
  memoryId: string;
  onClose: () => void;
  onNavigate: (id: string) => void;
  className?: string;
}

export function MemoryDetailSidebar({
  memoryId,
  onClose,
  onNavigate,
  className,
}: MemoryDetailSidebarProps) {
  const [navStack, setNavStack] = React.useState<string[]>([memoryId]);
  const [feedback, setFeedback] = React.useState<"confirmed" | "editing" | null>(null);
  const [editValue, setEditValue] = React.useState("");
  const [menuOpen, setMenuOpen] = React.useState(false);

  // When memoryId prop changes (from grid click), reset the stack
  React.useEffect(() => {
    setNavStack([memoryId]);
    setFeedback(null);
  }, [memoryId]);

  const currentId = navStack[navStack.length - 1];
  const memory = getMemoryById(currentId);
  const connections = React.useMemo(
    () => (currentId ? getConnectionsFor(currentId) : []),
    [currentId]
  );

  if (!memory) return null;

  const navigateToConnection = (id: string) => {
    setNavStack((prev) => [...prev, id]);
    setFeedback(null);
    onNavigate(id);
  };

  const navigateBreadcrumb = (index: number) => {
    const newStack = navStack.slice(0, index + 1);
    setNavStack(newStack);
    setFeedback(null);
    onNavigate(newStack[newStack.length - 1]);
  };

  return (
    <div
      className={cn(
        "flex flex-col bg-background overflow-hidden animate-in slide-in-from-right-4 duration-200",
        className
      )}
    >
      {/* Header */}
      <div className="shrink-0 border-b border-border px-4 py-2 flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">Detail</span>
        <div className="flex items-center gap-1">
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <MoreHorizontal className="h-3.5 w-3.5" />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-1 z-20 w-44 rounded-lg border border-border bg-card shadow-lg py-1">
                  <button className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-foreground hover:bg-muted transition-colors">
                    <Pencil className="h-3.5 w-3.5" /> Edit memory
                  </button>
                  <button className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-foreground hover:bg-muted transition-colors">
                    <EyeOff className="h-3.5 w-3.5" /> Stop using
                  </button>
                  <button className="flex w-full items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:bg-muted transition-colors">
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </div>
              </>
            )}
          </div>
          <button
            onClick={onClose}
            className="flex h-6 w-6 items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-4 space-y-5">
          {/* Breadcrumbs */}
          {navStack.length > 1 && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground overflow-x-auto pb-1">
              {navStack.map((id, i) => {
                const mem = getMemoryById(id);
                if (!mem) return null;
                const isLast = i === navStack.length - 1;
                return (
                  <React.Fragment key={id}>
                    {i > 0 && (
                      <ChevronRight className="h-3 w-3 shrink-0 text-muted-foreground/40" />
                    )}
                    <button
                      onClick={() => !isLast && navigateBreadcrumb(i)}
                      className={cn(
                        "shrink-0 max-w-[120px] truncate rounded px-1 py-0.5",
                        isLast
                          ? "font-medium text-foreground"
                          : "hover:text-foreground hover:bg-muted transition-colors"
                      )}
                    >
                      {mem.content.slice(0, 30)}
                      {mem.content.length > 30 ? "…" : ""}
                    </button>
                  </React.Fragment>
                );
              })}
            </div>
          )}

          {/* Title */}
          <h2 className="text-base font-semibold text-foreground leading-snug">
            {memory.content}
          </h2>

          {/* Detail */}
          {memory.detail && (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {memory.detail}
            </p>
          )}

          {/* Metadata */}
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="text-muted-foreground/60 w-16 shrink-0">Source</span>
              <span>{memory.sourceDescription}</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="text-muted-foreground/60 w-16 shrink-0">Agent</span>
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

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="text-muted-foreground/60 w-16 shrink-0">Confidence</span>
              <ConfidenceBar value={memory.confidence} />
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="text-muted-foreground/60 w-16 shrink-0">Learned</span>
              <span>{memory.learnedAt}</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="text-muted-foreground/60 w-16 shrink-0">Type</span>
              <span className="capitalize">{memory.source}</span>
            </div>
          </div>

          {/* Feedback & correction */}
          <div className="space-y-2">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setFeedback(feedback === "confirmed" ? null : "confirmed")}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors",
                  feedback === "confirmed"
                    ? "bg-emerald-500/10 text-emerald-600 border border-emerald-200"
                    : "text-muted-foreground border border-border hover:text-foreground hover:border-foreground/20"
                )}
              >
                <ThumbsUp className="h-3 w-3" />
                {feedback === "confirmed" ? "Confirmed" : "Looks right"}
              </button>
              <button
                onClick={() => {
                  if (feedback === "editing") {
                    setFeedback(null);
                    setEditValue("");
                  } else {
                    setFeedback("editing");
                    setEditValue("");
                  }
                }}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors",
                  feedback === "editing"
                    ? "bg-amber-500/10 text-amber-700 border border-amber-200"
                    : "text-muted-foreground border border-border hover:text-foreground hover:border-foreground/20"
                )}
              >
                <Pencil className="h-3 w-3" />
                Clarify or correct
              </button>
            </div>

            {feedback === "editing" && (
              <div className="space-y-2">
                <textarea
                  autoFocus
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  placeholder="Tell the agent what's wrong or what to add — e.g. 'Actually it's Mon/Wed/Thu in office now' or 'This is mostly right but I also WFH on sick days'"
                  className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 resize-none"
                  rows={3}
                />
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-muted-foreground/50">
                    The agent will update this memory based on your feedback
                  </span>
                  <button
                    disabled={!editValue.trim()}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
                      editValue.trim()
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "bg-muted text-muted-foreground cursor-not-allowed"
                    )}
                  >
                    Update memory
                  </button>
                </div>
              </div>
            )}

            {feedback === "confirmed" && (
              <p className="text-[11px] text-emerald-600/80 pl-0.5">
                Thanks — this boosts confidence for this memory and connected ones.
              </p>
            )}
          </div>

          {/* Connected Memories */}
          {connections.length > 0 && (
            <div className="pt-2">
              <div className="flex items-center gap-2 mb-3">
                <Link2 className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">
                  Connected Memories
                </span>
                <span className="text-xs text-muted-foreground">
                  {connections.length}
                </span>
              </div>

              <div className="space-y-2">
                {connections.map(({ memory: connMem, relationship }) => {
                  const style = RELATIONSHIP_STYLES[relationship];
                  return (
                    <button
                      key={connMem.id}
                      onClick={() => navigateToConnection(connMem.id)}
                      className="w-full text-left rounded-lg border border-border p-2.5 hover:border-primary/30 hover:bg-accent/30 transition-all group"
                    >
                      <div className="flex items-start gap-2">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium shrink-0 mt-0.5",
                            style.color
                          )}
                        >
                          {style.label}
                        </span>
                        <span className="text-sm text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                          {connMem.content}
                        </span>
                      </div>
                      <div className="mt-1.5 flex items-center gap-2 ml-0">
                        <Badge
                          variant="secondary"
                          className="text-[10px] font-normal py-0 h-4 px-1.5"
                        >
                          {connMem.sourceAgentName}
                        </Badge>
                        <span
                          className={cn(
                            "inline-block h-1.5 w-1.5 rounded-full",
                            connMem.confidence >= 0.85
                              ? "bg-emerald-500"
                              : connMem.confidence >= 0.7
                                ? "bg-amber-500"
                                : "bg-orange-400"
                          )}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
