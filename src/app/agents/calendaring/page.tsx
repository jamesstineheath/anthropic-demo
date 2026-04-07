"use client";

import React from "react";
import { Calendar } from "lucide-react";
import { CalendarProvider } from "@/components/providers/calendar-provider";
import { ChatProvider, useChat } from "@/components/providers/chat-provider";
import { useTeam } from "@/components/providers/team-provider";
import { CalendarShell } from "@/components/calendar/calendar-shell";
import { ChatPanel } from "@/components/chat-panel";
import { XRayOverlay } from "@/components/xray-overlay";
import { DemoDialogueBridge } from "@/components/demo/demo-dialogue-bridge";
import { useTourCalendaringEffects } from "@/components/providers/tour-provider";

function CalendaringInner() {
  const { loadSnapshot, addMessage } = useChat();
  useTourCalendaringEffects(loadSnapshot, addMessage);
  return null;
}

function CalendaringLayout() {
  const { getTrustStage } = useTeam();
  const trustStage = getTrustStage("calendaring");
  const showCalendar = trustStage >= 1;

  return (
    <div className="flex h-full overflow-hidden">
      {/* Chat stream — expands full width at stage 0, ~40% otherwise */}
      <div
        className={`flex flex-col bg-background ${showCalendar ? "border-r border-border" : ""}`}
        data-tour="chat-panel"
        style={showCalendar ? { width: "420px", minWidth: "360px", maxWidth: "480px" } : { width: "100%" }}
      >
        <ChatPanel />
      </div>

      {/* Calendar artifact — only shown after calendar is connected */}
      {showCalendar && (
        <div
          className="flex flex-1 flex-col min-w-0 overflow-hidden"
          data-tour="calendar-artifact"
        >
          <div className="flex h-11 shrink-0 items-center gap-3 border-b border-border px-4 bg-background">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Calendar</span>
            <span className="text-xs text-muted-foreground">7 sources</span>
          </div>
          <div className="flex-1 overflow-hidden">
            <CalendarShell />
          </div>
        </div>
      )}
    </div>
  );
}

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
        <CalendaringInner />
        <DemoDialogueBridge />
        <CalendaringLayout />
        <XRayOverlay />
      </ChatProvider>
    </CalendarProvider>
  );
}
