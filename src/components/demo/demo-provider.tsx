"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useXRay } from "@/components/providers/xray-provider";
import { useTeam } from "@/components/providers/team-provider";
import { DEMO_STEPS, type DemoMode } from "@/components/demo/demo-steps";
import type { TrustStage } from "@/lib/agents/data";

interface DemoContextValue {
  mode: DemoMode;
  stepIndex: number;
  currentStep: (typeof DEMO_STEPS)[number];
  totalSteps: number;
  setMode: (mode: DemoMode) => void;
  nextMode: () => void;
  prevMode: () => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (index: number) => void;
  /** Dialogue entries currently being played */
  visibleDialogue: Array<{ role: "user" | "agent"; content: string }>;
  /** Whether a message is currently being "typed" */
  isTyping: boolean;
  /** Whether tour cards are hidden (minimized into the navigator) */
  tourCardsHidden: boolean;
  setTourCardsHidden: (hidden: boolean) => void;
}

const DemoContext = React.createContext<DemoContextValue | undefined>(undefined);

const MODES: DemoMode[] = ["tour", "interact", "model"];

const STORAGE_KEY = "claude-demo-state";

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  // Start with defaults to match server render; apply persisted state after hydration
  const [mode, setModeState] = React.useState<DemoMode>("tour");
  const [stepIndex, setStepIndex] = React.useState(0);
  const [visibleDialogue, setVisibleDialogue] = React.useState<
    Array<{ role: "user" | "agent"; content: string }>
  >([]);
  const [isTyping, setIsTyping] = React.useState(false);
  const [tourCardsHidden, setTourCardsHidden] = React.useState(false);
  const router = useRouter();
  const { setXrayVisible } = useXRay();
  const { setTrustStage } = useTeam();
  const dialogueTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const currentStep = DEMO_STEPS[stepIndex] ?? DEMO_STEPS[0];

  // After hydration, restore persisted state from sessionStorage
  React.useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (MODES.includes(parsed.mode)) setModeState(parsed.mode);
        if (typeof parsed.stepIndex === "number") setStepIndex(parsed.stepIndex);
      }
    } catch { /* ignore */ }
    setMounted(true);
  }, []);

  // Persist state changes to sessionStorage
  React.useEffect(() => {
    if (!mounted) return;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ mode, stepIndex }));
  }, [mode, stepIndex, mounted]);

  // Apply step effects when step or mode changes (only after persisted state is loaded)
  React.useEffect(() => {
    if (!mounted) return;

    if (mode === "tour" && currentStep.route) {
      const currentPath = window.location.pathname;
      if (currentPath !== currentStep.route) {
        router.push(currentStep.route);
      }
    }

    // If in model mode but step has no model content, fall back to tour
    if (mode === "model" && !currentStep.model) {
      setModeState("tour");
      return;
    }

    // Show x-ray only in model mode
    setXrayVisible(mode === "model");

    // Sync trust stage from tour step to team provider
    if (currentStep.trustStage !== undefined) {
      setTrustStage("calendaring", currentStep.trustStage as TrustStage);
    }
  }, [stepIndex, mode, currentStep, router, setXrayVisible, setTrustStage, mounted]);

  // Play dialogue sequence when step changes and mode is "tour"
  React.useEffect(() => {
    if (!mounted) return;

    // Clear previous dialogue
    setVisibleDialogue([]);
    if (dialogueTimerRef.current) clearTimeout(dialogueTimerRef.current);

    if (mode !== "tour" || !currentStep.dialogue?.length) {
      setIsTyping(false);
      return;
    }

    const dialogue = currentStep.dialogue;
    let index = 0;

    // Show typing indicator immediately (no initial delay) to avoid
    // flashing the empty/landing state between steps
    setIsTyping(true);

    const playNext = () => {
      if (index >= dialogue.length) {
        setIsTyping(false);
        return;
      }

      const entry = dialogue[index];
      // Fast typing animation for smooth step transitions
      const typingDelay = entry.role === "user" ? 600 : 400;
      const messageDelay = 200;

      // Show typing indicator
      setIsTyping(true);

      dialogueTimerRef.current = setTimeout(() => {
        setIsTyping(false);

        // Show message
        dialogueTimerRef.current = setTimeout(() => {
          setVisibleDialogue((prev) => [...prev, entry]);
          index++;
          // Play next after a brief pause
          dialogueTimerRef.current = setTimeout(playNext, 300);
        }, messageDelay);
      }, typingDelay);
    };

    // Start quickly — typing indicator is already showing
    dialogueTimerRef.current = setTimeout(playNext, 150);

    return () => {
      if (dialogueTimerRef.current) clearTimeout(dialogueTimerRef.current);
    };
  }, [stepIndex, mode, currentStep, mounted]);

  const setMode = React.useCallback((m: DemoMode) => {
    setModeState(m);
  }, []);

  const nextMode = React.useCallback(() => {
    setModeState((prev) => {
      const idx = MODES.indexOf(prev);
      return MODES[(idx + 1) % MODES.length];
    });
  }, []);

  const prevMode = React.useCallback(() => {
    setModeState((prev) => {
      const idx = MODES.indexOf(prev);
      return MODES[(idx - 1 + MODES.length) % MODES.length];
    });
  }, []);

  const nextStep = React.useCallback(() => {
    setStepIndex((prev) => Math.min(prev + 1, DEMO_STEPS.length - 1));
  }, []);

  const prevStep = React.useCallback(() => {
    setStepIndex((prev) => Math.max(prev - 1, 0));
  }, []);

  const goToStep = React.useCallback((index: number) => {
    setStepIndex(Math.max(0, Math.min(index, DEMO_STEPS.length - 1)));
  }, []);

  // Keyboard listeners for arrow keys
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          prevMode();
          break;
        case "ArrowRight":
          e.preventDefault();
          nextMode();
          break;
        case "ArrowUp":
          e.preventDefault();
          prevStep();
          break;
        case "ArrowDown":
          e.preventDefault();
          nextStep();
          break;
      }
    };
    // Use capture phase so arrow keys work even when a dialog portal
    // calls stopPropagation during the bubble phase (base-ui behavior).
    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [nextMode, prevMode, nextStep, prevStep]);

  return (
    <DemoContext.Provider
      value={{
        mode,
        stepIndex,
        currentStep,
        totalSteps: DEMO_STEPS.length,
        setMode,
        nextMode,
        prevMode,
        nextStep,
        prevStep,
        goToStep,
        visibleDialogue,
        isTyping,
        tourCardsHidden,
        setTourCardsHidden,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const context = React.useContext(DemoContext);
  if (!context) throw new Error("useDemo must be used within DemoProvider");
  return context;
}
