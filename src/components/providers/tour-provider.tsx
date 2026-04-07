"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { TOUR_STEPS } from "@/components/tour/tour-steps";
import type { TourStep } from "@/components/tour/tour-steps";

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

  const currentStep = TOUR_STEPS[stepIndex] ?? null;

  // Auto-start on first visit
  React.useEffect(() => {
    const complete = typeof window !== "undefined" && localStorage.getItem(TOUR_COMPLETE_KEY);
    if (!complete) {
      // Small delay to let the page settle
      setTimeout(() => setIsActive(true), 300);
    }
  }, []);

  // Restore from URL hash
  React.useEffect(() => {
    const hash = window.location.hash;
    const match = hash.match(/tour=(\d+)/);
    if (match) {
      const idx = parseInt(match[1], 10);
      if (!isNaN(idx) && idx < TOUR_STEPS.length) {
        setStepIndex(idx);
        setIsActive(true);
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

    // Persist step in URL hash
    window.history.replaceState(null, "", `${window.location.pathname}#tour=${stepIndex}`);
  }, [stepIndex, isActive, currentStep, router]);

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
