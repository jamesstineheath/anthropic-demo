"use client";

import { useTour } from "@/components/providers/tour-provider";
import { TourSpotlight } from "./tour-spotlight";
import { TourNarrator } from "./tour-narrator";
import { TOUR_STEPS } from "./tour-steps";

export function TourOverlay() {
  const { isActive, stepIndex, currentStep, next, back, endTour, handleQuickReply } = useTour();

  if (!isActive || !currentStep) return null;

  const isEndCard = currentStep.id === "end-card";
  const isInteractive = currentStep.waitForAction === "click";
  const hasQuickReplies = Boolean(currentStep.quickReplies?.length);

  return (
    <div className="fixed inset-0 z-[70]">
      {/* Spotlight backdrop */}
      <TourSpotlight
        selector={currentStep.spotlightSelector}
        padding={currentStep.spotlightPadding}
        interactive={isInteractive}
      />

      {/* Narrator card */}
      <TourNarrator
        title={currentStep.narratorTitle}
        body={currentStep.narratorBody}
        position={currentStep.narratorPosition}
        stepNumber={stepIndex + 1}
        totalSteps={TOUR_STEPS.length}
        onNext={next}
        onBack={back}
        showBack={stepIndex > 0}
        waitingForAction={currentStep.waitForAction === "click" || currentStep.waitForAction === "chat-reply"}
        quickReplies={hasQuickReplies ? currentStep.quickReplies : undefined}
        onQuickReply={handleQuickReply}
        isEndCard={isEndCard}
        onEndTour={endTour}
        onRestartTour={() => {
          // restart
          window.location.href = window.location.pathname + "#tour=0";
          window.location.reload();
        }}
      />
    </div>
  );
}
