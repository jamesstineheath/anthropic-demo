"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight, Minus, Play } from "lucide-react";
import { useChat } from "@/components/providers/chat-provider";
import { useTeam } from "@/components/providers/team-provider";
import { TRUST_STAGE_LABELS, type TrustStage } from "@/lib/agents/data";
import { DEMO_SNAPSHOTS } from "@/lib/demo/snapshots";
import { cn } from "@/lib/utils";

export function DemoController() {
  const { loadSnapshot } = useChat();
  const { getTrustStage } = useTeam();
  const trustStage = getTrustStage("calendaring");

  const [minimized, setMinimized] = React.useState(false);
  const [animating, setAnimating] = React.useState(false);

  // Drag state
  const [pos, setPos] = React.useState({ x: -1, y: -1 });
  const dragging = React.useRef(false);
  const dragOffset = React.useRef({ x: 0, y: 0 });
  const pillRef = React.useRef<HTMLDivElement>(null);

  // Initialize position on mount
  React.useEffect(() => {
    setPos({
      x: window.innerWidth - 300,
      y: window.innerHeight - 80,
    });
  }, []);

  // Drag handlers
  const startDrag = React.useCallback(
    (clientX: number, clientY: number) => {
      dragging.current = true;
      dragOffset.current = {
        x: clientX - pos.x,
        y: clientY - pos.y,
      };
    },
    [pos]
  );

  React.useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!dragging.current) return;
      e.preventDefault();
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;
      setPos({
        x: clientX - dragOffset.current.x,
        y: clientY - dragOffset.current.y,
      });
    };
    const onEnd = () => {
      dragging.current = false;
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onEnd);
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onEnd);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onEnd);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
    };
  }, []);

  const goToLevel = React.useCallback(
    (level: number) => {
      if (level < 0 || level > 5 || !loadSnapshot) return;
      const snapshot = DEMO_SNAPSHOTS[level];
      if (!snapshot) return;
      loadSnapshot(
        snapshot.trustStage,
        snapshot.memory,
        snapshot.messages
      );
      // Animate
      setAnimating(true);
      setTimeout(() => setAnimating(false), 400);
    },
    [loadSnapshot]
  );

  if (pos.x === -1) return null; // not initialized yet

  if (minimized) {
    return (
      <div
        ref={pillRef}
        className="fixed z-[60] select-none"
        style={{ left: pos.x, top: pos.y }}
      >
        <button
          onClick={() => setMinimized(false)}
          className="flex items-center gap-1 rounded-full bg-black/80 px-3 py-1.5 text-white backdrop-blur-sm border border-white/10 hover:bg-black/90 transition-colors"
        >
          <Play className="h-3 w-3" />
          <span className="text-[10px] font-mono">L{trustStage}</span>
        </button>
      </div>
    );
  }

  return (
    <div
      ref={pillRef}
      className="fixed z-[60] select-none"
      style={{ left: pos.x, top: pos.y }}
    >
      <div className="flex items-center gap-0.5 rounded-full bg-black/80 backdrop-blur-sm border border-white/10 px-1 py-1">
        {/* Grip handle */}
        <div
          className="flex items-center justify-center w-6 h-6 cursor-grab active:cursor-grabbing text-zinc-500 hover:text-zinc-300"
          onMouseDown={(e) => startDrag(e.clientX, e.clientY)}
          onTouchStart={(e) => {
            const t = e.touches[0];
            startDrag(t.clientX, t.clientY);
          }}
        >
          <span className="text-[10px] leading-none tracking-tighter">⋮⋮</span>
        </div>

        {/* Back */}
        <button
          onClick={() => goToLevel(trustStage - 1)}
          disabled={trustStage <= 0}
          className="flex items-center justify-center w-6 h-6 rounded-full text-white hover:bg-white/10 active:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>

        {/* Level indicator */}
        <div
          className={cn(
            "px-2 py-0.5 text-white font-mono text-xs transition-transform duration-300",
            animating && "scale-110"
          )}
        >
          <span className="font-semibold">L{trustStage}</span>
          <span className="text-zinc-400 ml-1.5 text-[10px]">
            {TRUST_STAGE_LABELS[trustStage]}
          </span>
        </div>

        {/* Forward */}
        <button
          onClick={() => goToLevel(trustStage + 1)}
          disabled={trustStage >= 5}
          className="flex items-center justify-center w-6 h-6 rounded-full text-white hover:bg-white/10 active:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="h-3.5 w-3.5" />
        </button>

        {/* Minimize */}
        <button
          onClick={() => setMinimized(true)}
          className="flex items-center justify-center w-6 h-6 rounded-full text-zinc-500 hover:text-white hover:bg-white/10 transition-colors"
        >
          <Minus className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
}
