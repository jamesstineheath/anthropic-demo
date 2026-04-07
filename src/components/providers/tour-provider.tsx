"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { TOUR_STEPS } from "@/components/tour/tour-steps";
import type { TourStep } from "@/components/tour/tour-steps";
import { useXRay } from "@/components/providers/xray-provider";

interface TourContextValue {
  isActive: boolean;
  stepIndex: number;
  currentStep: TourStep | null;
  next: () => void;
  back: () => void;
  endTour: () => void;
  startTour: () => void;
  handleQuickReply: (reply: string) => void;
}

const TourContext = React.createContext<TourContextValue | undefined>(undefined);

const TOUR_COMPLETE_KEY = "claude-tour-complete";

export function TourProvider({ children }: { children: React.ReactNode }) {
  const [isActive, setIsActive] = React.useState(false);
  const [stepIndex, setStepIndex] = React.useState(0);
  const router = useRouter();
  const { setXrayVisible } = useXRay();

  const currentStep = TOUR_STEPS[stepIndex] ?? null;

  // Auto-start on first visit
  React.useEffect(() => {
    const complete = typeof window !== "undefined" && localStorage.getItem(TOUR_COMPLETE_KEY);
    if (!complete) {
      // Small delay to let the page settle
      setTimeout(() => setIsActive(true), 300);
    }
  }, []);

  // Restore from URL hash (only if tour not explicitly completed)
  React.useEffect(() => {
    const hash = window.location.hash;
    const match = hash.match(/tour=(\d+)/);
    if (match) {
      const complete = typeof window !== "undefined" && localStorage.getItem(TOUR_COMPLETE_KEY);
      if (!complete) {
        const idx = parseInt(match[1], 10);
        if (!isNaN(idx) && idx < TOUR_STEPS.length) {
          setStepIndex(idx);
          setIsActive(true);
        }
      } else {
        // Clean up the hash if tour is complete
        window.history.replaceState(null, "", window.location.pathname);
      }
    }
  }, []);

  // Apply step effects when step changes
  React.useEffect(() => {
    if (!isActive || !currentStep) return;

    // Navigate if step specifies a route
    if (currentStep.route) {
      router.push(currentStep.route);
    }

    // Apply xray visibility
    if (currentStep.xrayVisible !== undefined) {
      setXrayVisible(currentStep.xrayVisible);
    }

    // Persist step in URL hash
    window.history.replaceState(null, "", `${window.location.pathname}#tour=${stepIndex}`);
  }, [stepIndex, isActive, currentStep, router, setXrayVisible]);

  const next = React.useCallback(() => {
    setStepIndex((prev) => {
      if (prev < TOUR_STEPS.length - 1) return prev + 1;
      return prev;
    });
  }, []);

  const back = React.useCallback(() => {
    setStepIndex((prev) => (prev > 0 ? prev - 1 : prev));
  }, []);

  const endTour = React.useCallback(() => {
    setIsActive(false);
    if (typeof window !== "undefined") {
      localStorage.setItem(TOUR_COMPLETE_KEY, "true");
    }
    window.history.replaceState(null, "", window.location.pathname);
    router.push("/");
  }, [router]);

  const startTour = React.useCallback(() => {
    setStepIndex(0);
    setIsActive(true);
    if (typeof window !== "undefined") {
      localStorage.removeItem(TOUR_COMPLETE_KEY);
    }
  }, []);

  const handleQuickReply = React.useCallback((_reply: string) => {
    // Quick replies on onboarding questions just advance the tour
    next();
  }, [next]);

  return (
    <TourContext.Provider
      value={{ isActive, stepIndex, currentStep, next, back, endTour, startTour, handleQuickReply }}
    >
      {children}
    </TourContext.Provider>
  );
}

export function useTour() {
  const context = React.useContext(TourContext);
  if (!context) throw new Error("useTour must be used within TourProvider");
  return context;
}

/**
 * Hook for the calendaring page to apply tour-driven state changes
 * (trust stage, chat message injection) that require local providers.
 */
export function useTourCalendaringEffects(
  loadSnapshot: ((stage: import("@/lib/agents/data").TrustStage, mem: import("@/components/providers/chat-provider").AgentMemory, msgs: import("@/components/providers/chat-provider").ChatMessage[]) => void) | undefined,
  addMessage: ((msg: { role: "user" | "agent"; content: string; quickReplies?: string[] }) => void) | undefined,
) {
  const { isActive, stepIndex, currentStep } = useTour();
  const appliedStepRef = React.useRef(-1);

  React.useEffect(() => {
    if (!isActive || !currentStep || appliedStepRef.current === stepIndex) return;
    appliedStepRef.current = stepIndex;

    // Apply trust stage snapshot
    if (currentStep.trustStage !== undefined && loadSnapshot) {
      // Import snapshots lazily to avoid circular deps
      import("@/lib/demo/snapshots").then(({ DEMO_SNAPSHOTS }) => {
        const snap = DEMO_SNAPSHOTS[currentStep.trustStage!];
        if (snap) {
          loadSnapshot(snap.trustStage, snap.memory, snap.messages);
        }
      });
    }

    // Inject chat message
    if (currentStep.chatMessage && addMessage) {
      setTimeout(() => {
        addMessage({ role: "agent", content: currentStep.chatMessage! });
      }, 400);
    }
  }, [stepIndex, isActive, currentStep, loadSnapshot, addMessage]);
}
