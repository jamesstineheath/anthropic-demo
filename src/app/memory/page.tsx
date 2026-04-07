"use client";

import * as React from "react";
import { Brain, PanelRightOpen, PanelRightClose } from "lucide-react";
import { MemoryChat } from "@/components/memory/memory-chat";
import { MemoryGrid } from "@/components/memory/memory-grid";
import { MemoryDetailSidebar } from "@/components/memory/memory-detail-sidebar";
import { useDemo } from "@/components/demo/demo-provider";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

// Step IDs that control the Memory UI during tour mode
const GRID_OPEN_STEPS = [
  "memory-open-grid",
  "memory-select-card",
  "memory-confidence-explain",
  "memory-feedback",
  "memory-feedback-result",
];
const DETAIL_OPEN_STEPS = [
  "memory-select-card",
  "memory-confidence-explain",
  "memory-feedback",
  "memory-feedback-result",
];
const FEEDBACK_STEPS = ["memory-feedback", "memory-feedback-result"];
const CONFIRMED_STEPS = ["memory-feedback-result"];

const TOUR_MEMORY_ID = "mem-3"; // "Prefers 25-minute meetings over 30-minute defaults"

export default function MemoryPage() {
  const { mode, currentStep } = useDemo();
  const isTour = mode === "tour";
  const stepId = currentStep.id;

  // Tour-driven state
  const tourGridOpen = isTour && GRID_OPEN_STEPS.includes(stepId);
  const tourDetailOpen = isTour && DETAIL_OPEN_STEPS.includes(stepId);
  const tourFeedbackHint = isTour && FEEDBACK_STEPS.includes(stepId);
  const tourConfirmed = isTour && CONFIRMED_STEPS.includes(stepId);

  const [gridOpen, setGridOpen] = React.useState(false);
  const [chatWidth, setChatWidth] = React.useState(420);
  const [selectedMemoryId, setSelectedMemoryId] = React.useState<string | null>(
    null
  );

  // Sync tour-driven state
  React.useEffect(() => {
    if (!isTour) return;
    setGridOpen(tourGridOpen);
    setSelectedMemoryId(tourDetailOpen ? TOUR_MEMORY_ID : null);
  }, [isTour, tourGridOpen, tourDetailOpen]);
  const isDragging = React.useRef(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleMouseDown = React.useCallback(() => {
    isDragging.current = true;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";
  }, []);

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newWidth = e.clientX - rect.left;
      setChatWidth(Math.max(300, Math.min(newWidth, 600)));
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <div ref={containerRef} className="flex h-full overflow-hidden">
      {/* Chat — expands full width when grid is closed */}
      <div
        className="flex flex-col bg-background relative"
        style={gridOpen ? { width: chatWidth, flexShrink: 0 } : { flex: 1 }}
      >
        <MemoryChat />

        {/* Toggle button for Explore Memory panel — vertically centered in the header row */}
        <button
          onClick={() => setGridOpen(!gridOpen)}
          className="absolute top-0 right-0 h-[37px] flex items-center gap-1.5 border-b border-l border-border bg-background px-3 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors rounded-bl-lg"
        >
          <Brain className="h-3.5 w-3.5" />
          <span>Explore Memory</span>
          {gridOpen ? (
            <PanelRightClose className="h-3.5 w-3.5" />
          ) : (
            <PanelRightOpen className="h-3.5 w-3.5" />
          )}
        </button>
      </div>

      {gridOpen && (
        <>
          {/* Draggable divider */}
          <div
            onMouseDown={handleMouseDown}
            className="w-1 shrink-0 cursor-col-resize bg-border hover:bg-primary/30 transition-colors"
          />

          {/* Memory browser — right side */}
          <MemoryGrid
            selectedMemoryId={selectedMemoryId}
            onSelectMemory={setSelectedMemoryId}
            className="flex-1 min-w-0"
          />
        </>
      )}

      {/* Detail modal — non-modal so sidebar remains interactive */}
      <Dialog
        modal={false}
        open={!!selectedMemoryId}
        onOpenChange={(open) => {
          if (!open) setSelectedMemoryId(null);
        }}
      >
        <DialogContent
          showCloseButton={false}
          showOverlay={false}
          className="sm:max-w-lg max-h-[85vh] p-0 overflow-hidden flex flex-col"
        >
          {selectedMemoryId && (
            <MemoryDetailSidebar
              memoryId={selectedMemoryId}
              onClose={() => setSelectedMemoryId(null)}
              onNavigate={setSelectedMemoryId}
              className="h-full max-h-[85vh]"
              tourFeedbackHint={tourFeedbackHint}
              tourConfirmed={tourConfirmed}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
