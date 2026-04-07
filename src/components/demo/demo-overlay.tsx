"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useDemo } from "@/components/demo/demo-provider";

const INITIAL_POSITIONS: Record<string, { x: number; y: number }> = {
  "top-left": { x: 280, y: 56 },
  "top-right": { x: -1, y: -1 },    // renders bottom-right so navigator stays top-right
  "bottom-left": { x: 24, y: -1 },   // -1 = compute from bottom edge
  "bottom-right": { x: -1, y: -1 },
  center: { x: -2, y: -2 },          // -2 = center
};

export function DemoOverlay() {
  const { mode, currentStep, stepIndex, totalSteps, tourCardsHidden } = useDemo();
  const [pos, setPos] = React.useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = React.useState(false);
  const dragStartRef = React.useRef({ x: 0, y: 0, posX: 0, posY: 0 });
  const cardRef = React.useRef<HTMLDivElement>(null);

  // Reset position when step changes
  React.useEffect(() => {
    setPos(null);
  }, [stepIndex]);

  // Compute initial position from the step's position hint
  React.useEffect(() => {
    if (pos !== null || !currentStep.tour) return;
    const hint = INITIAL_POSITIONS[currentStep.tour.position] ?? INITIAL_POSITIONS["top-left"];
    const w = 400;
    const h = cardRef.current?.offsetHeight ?? 300;

    let x = hint.x;
    let y = hint.y;
    if (x === -1) x = window.innerWidth - w - 24;
    if (y === -1) y = window.innerHeight - h - 24;
    if (x === -2) x = (window.innerWidth - w) / 2;
    if (y === -2) y = (window.innerHeight - h) / 2;

    setPos({ x, y });
  }, [pos, currentStep]);

  // Drag handlers
  const handleMouseDown = React.useCallback(
    (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).closest("button")) return;
      if (!pos) return;
      setIsDragging(true);
      dragStartRef.current = { x: e.clientX, y: e.clientY, posX: pos.x, posY: pos.y };
    },
    [pos]
  );

  React.useEffect(() => {
    if (!isDragging) return;
    const handleMouseMove = (e: MouseEvent) => {
      const dx = e.clientX - dragStartRef.current.x;
      const dy = e.clientY - dragStartRef.current.y;
      setPos({
        x: Math.max(0, Math.min(window.innerWidth - 420, dragStartRef.current.posX + dx)),
        y: Math.max(0, Math.min(window.innerHeight - 100, dragStartRef.current.posY + dy)),
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

  // Don't show overlay in interact mode or when minimized
  if (mode === "interact") return null;
  if (tourCardsHidden) return null;

  // Don't show during onboarding steps unless the step also has a tour card
  if (currentStep.onboarding && !currentStep.tour) return null;

  // Don't show if no tour content defined for this step
  if (!currentStep.tour) return null;

  const { title, body, spotlight } = currentStep.tour;

  return (
    <>
      {/* Spotlight backdrop (only in tour mode with a selector, not during onboarding) */}
      {mode === "tour" && spotlight && !currentStep.onboarding && <SpotlightBackdrop selector={spotlight} padding={currentStep.tour.spotlightPadding ?? 12} />}

      {/* Narrator card — draggable */}
      <div
        ref={cardRef}
        onMouseDown={handleMouseDown}
        className={cn(
          "fixed w-[400px] max-w-[calc(100vw-16rem)]",
          currentStep.onboarding ? "z-[85]" : "z-[75]",
          "bg-white rounded-2xl shadow-2xl border border-zinc-200",
          "p-6 select-none",
          isDragging ? "cursor-grabbing" : "cursor-grab"
        )}
        style={pos ? { left: pos.x, top: pos.y } : { opacity: 0 }}
      >
        {/* Claude accent bar */}
        <div className="h-1 w-8 rounded-full bg-zinc-900 mb-4" />

        <h3 className="text-xl font-semibold text-zinc-900 mb-2 leading-tight">
          {title}
        </h3>
        <p className="text-base leading-relaxed text-zinc-600 whitespace-pre-line">
          {body}
        </p>

        {/* Model mode details */}
        {mode === "model" && currentStep.model && (
          <div className="mt-4 rounded-lg bg-zinc-50 border border-zinc-200 p-3 space-y-1.5 font-mono text-xs text-zinc-600">
            <div className="flex justify-between">
              <span>Context tokens</span>
              <span className="text-zinc-900 font-semibold">
                ~{(currentStep.model.contextTokens / 1000).toFixed(0)}k
              </span>
            </div>
            <div className="flex justify-between">
              <span>Capabilities</span>
              <span className="text-zinc-900 font-semibold">
                {currentStep.model.capabilitiesUnlocked} / {currentStep.model.capabilitiesTotal}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Contributing agents</span>
              <span className="text-zinc-900 font-semibold">{currentStep.model.agentsContributing}</span>
            </div>
            <div className="mt-2 pt-2 border-t border-zinc-200 text-zinc-500">
              {currentStep.model.details}
            </div>
          </div>
        )}

        {/* Step counter */}
        <div className="mt-4 flex items-center justify-between text-sm text-zinc-400">
          <span className="tabular-nums">
            {stepIndex + 1} / {totalSteps}
          </span>
          <span className="text-xs">
            Use ↑ ↓ to navigate
          </span>
        </div>
      </div>
    </>
  );
}

/** Backdrop with cutout for spotlight area */
function SpotlightBackdrop({ selector, padding }: { selector: string; padding: number }) {
  const [rect, setRect] = React.useState<DOMRect | null>(null);

  React.useEffect(() => {
    const measure = () => {
      const el = document.querySelector(selector);
      if (el) setRect(el.getBoundingClientRect());
    };

    measure();
    const observer = new ResizeObserver(measure);
    const el = document.querySelector(selector);
    if (el) observer.observe(el);
    window.addEventListener("scroll", measure, true);
    window.addEventListener("resize", measure);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", measure, true);
      window.removeEventListener("resize", measure);
    };
  }, [selector]);

  if (!rect) {
    return <div className="fixed inset-0 z-[70] bg-black/50 backdrop-blur-[1px]" />;
  }

  const p = padding;
  const l = rect.left - p;
  const t = rect.top - p;
  const r = rect.right + p;
  const b = rect.bottom + p;

  return (
    <div className="fixed inset-0 z-[70]">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"
        style={{
          clipPath: `polygon(
            0% 0%, 0% 100%,
            ${l}px 100%, ${l}px ${t}px,
            ${r}px ${t}px, ${r}px ${b}px,
            ${l}px ${b}px, ${l}px 100%,
            100% 100%, 100% 0%
          )`,
        }}
      />
      <div
        className="absolute border-2 border-white/40 rounded-xl pointer-events-none animate-pulse"
        style={{ left: l, top: t, width: r - l, height: b - t }}
      />
    </div>
  );
}
