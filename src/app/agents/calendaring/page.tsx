"use client";

import React from "react";
import { Calendar } from "lucide-react";
import { CalendarProvider } from "@/components/providers/calendar-provider";
import { ChatProvider } from "@/components/providers/chat-provider";
import { useTeam } from "@/components/providers/team-provider";
import { CalendarShell } from "@/components/calendar/calendar-shell";
import { ChatPanel } from "@/components/chat-panel";
import { XRayOverlay } from "@/components/xray-overlay";
import { DemoController } from "@/components/demo-controller";

export default function CalendaringPage() {
  const { isOnTeam, addAgent } = useTeam();

  React.useEffect(() => {
    if (!isOnTeam("calendaring")) {
      addAgent("calendaring");
    }
  }, [isOnTeam, addAgent]);

  return (
    <CalendarProvider>
      <ChatProvider>
        <div className="flex h-full overflow-hidden">
          {/* Chat stream — left side, ~40% */}
          <div
            className="flex flex-col border-r border-border bg-background"
            data-tour="chat-panel"
            style={{ width: "420px", minWidth: "360px", maxWidth: "480px" }}
          >
            <ChatPanel />
          </div>

          {/* Calendar artifact — right side, fills remaining space */}
          <div
            className="flex flex-1 flex-col min-w-0 overflow-hidden"
            data-tour="calendar-artifact"
          >
            {/* Artifact header bar */}
            <div className="flex h-11 shrink-0 items-center gap-3 border-b border-border px-4 bg-background">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Calendar</span>
              <span className="text-xs text-muted-foreground">7 sources</span>
            </div>

            {/* Calendar content */}
            <div className="flex-1 overflow-hidden">
              <CalendarShell />
            </div>
          </div>
        </div>

        <XRayOverlay />
        <DemoController />
      </ChatProvider>
    </CalendarProvider>
  );
}
