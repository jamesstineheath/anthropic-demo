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
        "flex h-7 w-7 items-center justify-center rounded-md",
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

  // Only show Model mode when current step has model content
  const availableModes: DemoMode[] = currentStep.model
    ? ["tour", "interact", "model"]
    : ["tour", "interact"];

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3 flex flex-col items-center gap-2.5">
      {/* Title + Reset */}
      <div className="w-full flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-widest text-zinc-300">
          Demo Navigator
        </span>
        <div className="flex items-center gap-0.5">
          <button
            onClick={() => setTourCardsHidden(!tourCardsHidden)}
            className="flex h-5 w-5 items-center justify-center rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
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
      <div className="flex w-full items-center gap-0.5 rounded-lg border border-zinc-700 bg-zinc-900 p-0.5">
        {availableModes.map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={cn(
              "flex-1 px-2 py-1 text-xs font-medium rounded-md transition-all text-center",
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
      <div className="text-[10px] text-zinc-400 font-medium tabular-nums text-center">
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
  );
}
