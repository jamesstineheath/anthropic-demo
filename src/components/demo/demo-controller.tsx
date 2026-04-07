"use client";

import * as React from "react";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, RotateCcw, MessageSquare, MessageSquareOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDemo } from "@/components/demo/demo-provider";
import type { DemoMode } from "@/components/demo/demo-steps";

const MODE_LABELS: Record<DemoMode, string> = {
  tour: "Tour",
  interact: "Interact",
  model: "Model",
};

const MODES: DemoMode[] = ["tour", "interact", "model"];

function ArrowButton({
  onClick,
  children,
  className,
}: {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-md",
        "border border-zinc-700 bg-zinc-800 text-zinc-300",
        "hover:bg-zinc-700 hover:text-white active:bg-zinc-600",
        "transition-colors",
        className
      )}
    >
      {children}
    </button>
  );
}

export function DemoController() {
  const { mode, setMode, stepIndex, totalSteps, currentStep, nextStep, prevStep, nextMode, prevMode, goToStep, tourCardsHidden, setTourCardsHidden } = useDemo();
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = React.useState(false);
  const dragStartRef = React.useRef({ x: 0, y: 0, posX: 0, posY: 0 });
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Initialize position to bottom-right, above the fold
  React.useEffect(() => {
    setPosition({
      x: window.innerWidth - 230,
      y: 16,
    });
  }, []);

  // Drag handlers
  const handleMouseDown = React.useCallback(
    (e: React.MouseEvent) => {
      // Only drag from the header area
      if ((e.target as HTMLElement).closest("button")) return;
      setIsDragging(true);
      dragStartRef.current = {
        x: e.clientX,
        y: e.clientY,
        posX: position.x,
        posY: position.y,
      };
    },
    [position]
  );

  React.useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      setPosition({
        x: Math.max(0, Math.min(window.innerWidth - 220, dragStartRef.current.posX + dx)),
        y: Math.max(0, Math.min(window.innerHeight - 240, dragStartRef.current.posY + dy)),
      });
    };

    const handleMouseUp = () => setIsDragging(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "fixed z-[100] select-none",
        isDragging ? "cursor-grabbing" : "cursor-grab"
      )}
      style={{ left: position.x, top: position.y }}
    >
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl p-4 flex flex-col items-center gap-3">
        {/* Title + Reset */}
        <div
          className="w-full flex items-center justify-between cursor-grab"
          onMouseDown={handleMouseDown}
        >
          <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-300">
            Demo Navigator
          </span>
          <div className="flex items-center gap-0.5">
            <button
              onClick={() => setTourCardsHidden(!tourCardsHidden)}
              className={cn(
                "flex h-5 w-5 items-center justify-center rounded transition-colors",
                tourCardsHidden
                  ? "text-zinc-400 hover:text-white hover:bg-zinc-800"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              )}
              title={tourCardsHidden ? "Show tour cards" : "Hide tour cards"}
            >
              {tourCardsHidden ? (
                <MessageSquare className="h-3 w-3" />
              ) : (
                <MessageSquareOff className="h-3 w-3" />
              )}
            </button>
            <button
              onClick={() => { goToStep(0); setMode("tour"); }}
              className="flex h-5 w-5 items-center justify-center rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
              title="Reset tour"
            >
              <RotateCcw className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Mode selector bar */}
        <div className="flex items-center gap-0.5 rounded-lg border border-zinc-700 bg-zinc-900 p-0.5">
          {MODES.map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded-md transition-all",
                mode === m
                  ? "bg-zinc-700 text-white shadow-sm"
                  : "text-zinc-400 hover:text-white"
              )}
            >
              {MODE_LABELS[m]}
            </button>
          ))}
        </div>

        {/* Step indicator */}
        <div className="text-[10px] text-zinc-400 font-medium tabular-nums">
          {stepIndex + 1} / {totalSteps} · {currentStep.label}
        </div>

        {/* Arrow pad — up/down = steps, left/right = modes */}
        <div className="flex flex-col items-center gap-1">
          <ArrowButton onClick={prevStep}>
            <ChevronUp className="h-3.5 w-3.5" />
          </ArrowButton>
          <div className="flex items-center gap-1">
            <ArrowButton onClick={prevMode}>
              <ChevronLeft className="h-3.5 w-3.5" />
            </ArrowButton>
            <ArrowButton onClick={nextStep}>
              <ChevronDown className="h-3.5 w-3.5" />
            </ArrowButton>
            <ArrowButton onClick={nextMode}>
              <ChevronRight className="h-3.5 w-3.5" />
            </ArrowButton>
          </div>
        </div>
      </div>
    </div>
  );
}
