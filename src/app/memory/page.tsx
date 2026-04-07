"use client";

import * as React from "react";
import { MemoryChat } from "@/components/memory/memory-chat";
import { MemoryGrid } from "@/components/memory/memory-grid";
import { MemoryDetailSidebar } from "@/components/memory/memory-detail-sidebar";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

export default function MemoryPage() {
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
      {/* Chat — left side */}
      <div
        className="flex shrink-0 flex-col bg-background"
        style={{ width: chatWidth }}
      >
        <MemoryChat />
      </div>

      {/* Draggable divider */}
      <div
        onMouseDown={handleMouseDown}
        className="w-1 shrink-0 cursor-col-resize bg-border hover:bg-primary/30 transition-colors"
      />

      {/* Knowledge browser — right side (full width now) */}
      <MemoryGrid
        selectedMemoryId={selectedMemoryId}
        onSelectMemory={setSelectedMemoryId}
        className="flex-1 min-w-0"
      />

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
