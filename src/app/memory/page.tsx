"use client";

import * as React from "react";
import { Brain, PanelRightOpen, PanelRightClose } from "lucide-react";
import { MemoryChat } from "@/components/memory/memory-chat";
import { MemoryGrid } from "@/components/memory/memory-grid";
import { MemoryDetailSidebar } from "@/components/memory/memory-detail-sidebar";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

export default function MemoryPage() {
  const [gridOpen, setGridOpen] = React.useState(false);
  const [chatWidth, setChatWidth] = React.useState(420);
  const [selectedMemoryId, setSelectedMemoryId] = React.useState<string | null>(
    null
  );
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

        {/* Toggle button for Explore Memory panel */}
        <button
          onClick={() => setGridOpen(!gridOpen)}
          className="absolute top-2 right-3 flex items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors shadow-sm"
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

      {/* Detail modal */}
      <Dialog
        open={!!selectedMemoryId}
        onOpenChange={(open) => {
          if (!open) setSelectedMemoryId(null);
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="sm:max-w-lg max-h-[85vh] p-0 overflow-hidden flex flex-col"
        >
          {selectedMemoryId && (
            <MemoryDetailSidebar
              memoryId={selectedMemoryId}
              onClose={() => setSelectedMemoryId(null)}
              onNavigate={setSelectedMemoryId}
              className="h-full max-h-[85vh]"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
