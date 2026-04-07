"use client";

import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TourNarratorProps {
  title: string;
  body: string;
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";
  stepNumber: number;
  totalSteps: number;
  onNext: () => void;
  onBack: () => void;
  showBack: boolean;
  waitingForAction: boolean;
  quickReplies?: string[];
  onQuickReply?: (reply: string) => void;
  isEndCard?: boolean;
  onEndTour?: () => void;
  onRestartTour?: () => void;
}

const POSITION_CLASSES = {
  "top-left": "top-6 left-6",
  "top-right": "top-6 right-6",
  "bottom-left": "bottom-6 left-6",
  "bottom-right": "bottom-6 right-6",
  "center": "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
};

export function TourNarrator({
  title,
  body,
  position,
  stepNumber,
  totalSteps,
  onNext,
  onBack,
  showBack,
  waitingForAction,
  quickReplies,
  onQuickReply,
  isEndCard,
  onEndTour,
  onRestartTour,
}: TourNarratorProps) {
  return (
    <div
      className={cn(
        "absolute z-[75] w-[420px] max-w-[calc(100vw-2rem)]",
        "bg-white dark:bg-zinc-900",
        "rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-700",
        "p-6",
        POSITION_CLASSES[position]
      )}
    >
      {/* Claude orange accent bar */}
      <div className="h-1 w-8 rounded-full bg-[#d97757] mb-4" />

      <h3 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-3 leading-tight">
        {title}
      </h3>
      <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-400 mb-5 whitespace-pre-line">
        {body}
      </p>

      {/* Quick reply chips */}
      {quickReplies && quickReplies.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-5">
          {quickReplies.map((reply) => (
            <button
              key={reply}
              onClick={() => onQuickReply?.(reply)}
              className="px-3 py-1.5 text-sm rounded-lg border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              {reply}
            </button>
          ))}
        </div>
      )}

      {/* End card buttons */}
      {isEndCard ? (
        <div className="flex flex-col gap-2">
          <button
            onClick={onEndTour}
            className="w-full px-4 py-2.5 text-sm font-semibold bg-[#d97757] text-white rounded-lg hover:bg-[#c4684b] transition-colors"
          >
            Explore the Demo
          </button>
          <button
            onClick={onRestartTour}
            className="w-full px-4 py-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
          >
            Restart Tour
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-400">
            {stepNumber} / {totalSteps}
          </span>
          <div className="flex items-center gap-2">
            {showBack && (
              <button
                onClick={onBack}
                className="flex items-center gap-1 px-3 py-1.5 text-sm text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
              >
                <ChevronLeft className="h-3.5 w-3.5" />
                Back
              </button>
            )}
            {!waitingForAction && !quickReplies?.length && (
              <button
                onClick={onNext}
                className="flex items-center gap-1 px-4 py-2 text-sm font-semibold bg-[#d97757] text-white rounded-lg hover:bg-[#c4684b] transition-colors"
              >
                Next
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            )}
            {waitingForAction && (
              <span className="px-3 py-1.5 text-sm text-zinc-400 italic">
                Click the highlighted area
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
