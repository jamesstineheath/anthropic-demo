"use client";

import React, { useState } from "react";
import { PanelRightClose, PanelRightOpen, MessageSquare, X } from "lucide-react";
import { CalendarProvider } from "@/components/providers/calendar-provider";
import { ChatProvider } from "@/components/providers/chat-provider";
import { useTeam } from "@/components/providers/team-provider";
import { CalendarShell } from "@/components/calendar/calendar-shell";
import { ChatMessages } from "@/components/chat/chat-messages";
import { ChatInput } from "@/components/chat/chat-input";
import { AgentPanel } from "@/components/agent-panel";
import { XRayOverlay } from "@/components/xray-overlay";
import { DemoController } from "@/components/demo-controller";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function CalendaringPage() {
  const [showPanel, setShowPanel] = useState(true);
  const [showChat, setShowChat] = useState(true);
  const { isOnTeam, addAgent } = useTeam();

  // Auto-add calendaring to team when visiting the page
  React.useEffect(() => {
    if (!isOnTeam("calendaring")) {
      addAgent("calendaring");
    }
  }, [isOnTeam, addAgent]);

  return (
    <CalendarProvider>
      <ChatProvider>
        <div className="flex h-full">
          {/* Main area: calendar + chat */}
          <div className="flex flex-1 flex-col overflow-hidden">
            {/* Calendar */}
            <div className={cn("flex-1 overflow-hidden", showChat && "flex-[2]")}>
              <CalendarShell />
            </div>

            {/* Chat area */}
            {showChat && (
              <div className="flex flex-col border-t border-border bg-background" style={{ maxHeight: "45%" }}>
                <div className="flex items-center justify-between px-4 py-1.5 border-b border-border">
                  <span className="text-[11px] font-medium text-muted-foreground">
                    Chat
                  </span>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => setShowChat(false)}
                    className="text-muted-foreground"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
                <ChatMessages />
                <ChatInput />
              </div>
            )}

            {/* Collapsed chat toggle */}
            {!showChat && (
              <div className="border-t border-border">
                <button
                  onClick={() => setShowChat(true)}
                  className="flex w-full items-center gap-2 px-4 py-2.5 text-[12px] text-muted-foreground hover:bg-accent transition-colors"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  Open chat
                </button>
              </div>
            )}
          </div>

          {/* Right panel */}
          {showPanel && (
            <aside className="hidden w-[280px] shrink-0 border-l border-border bg-card md:block">
              <div className="flex items-center justify-between border-b border-border px-4 py-2">
                <span className="text-xs font-semibold text-foreground">
                  Calendaring
                </span>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => setShowPanel(false)}
                  className="text-muted-foreground"
                >
                  <PanelRightClose className="h-3.5 w-3.5" />
                </Button>
              </div>
              <AgentPanel />
            </aside>
          )}

          {/* Panel toggle when collapsed */}
          {!showPanel && (
            <div className="hidden md:flex shrink-0 border-l border-border">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowPanel(true)}
                className="m-1 text-muted-foreground"
              >
                <PanelRightOpen className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* X-Ray overlay */}
        <XRayOverlay />
        {/* Demo controller */}
        <DemoController />
      </ChatProvider>
    </CalendarProvider>
  );
}
