"use client";

import { useChat } from "@/components/providers/chat-provider";
import { useTeam } from "@/components/providers/team-provider";
import { ChatMessages } from "@/components/chat/chat-messages";
import { ChatInput } from "@/components/chat/chat-input";
import { TRUST_STAGE_LABELS } from "@/lib/agents/data";

export function ChatPanel() {
  const { memory } = useChat();
  const { getTrustStage } = useTeam();
  const trustStage = getTrustStage("calendaring");
  const stageName = TRUST_STAGE_LABELS[trustStage];

  // Show a couple of key memory items as subtle context
  const memoryItems = Object.entries(memory)
    .filter(([k]) => ["chronotype", "meetingStyle", "protectedTime"].includes(k))
    .slice(0, 2);

  return (
    <div className="flex h-full flex-col">
      {/* Trust level header */}
      <div className="shrink-0 border-b border-border px-4 py-2 flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">Chat</span>
        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
          L{trustStage} · {stageName}
        </span>
      </div>

      {/* Memory context (shown when onboarding is complete) */}
      {memoryItems.length > 0 && (
        <div className="shrink-0 border-b border-border px-4 py-2 space-y-0.5">
          {memoryItems.map(([key, value]) => (
            <div key={key} className="flex items-start gap-1.5 text-[13px] text-muted-foreground">
              <span className="capitalize shrink-0 text-muted-foreground/60">
                {key.replace(/([A-Z])/g, " $1").toLowerCase()}:
              </span>
              <span className="truncate">{value as string}</span>
            </div>
          ))}
        </div>
      )}

      {/* Messages — flex-1 scrollable */}
      <div className="flex-1 overflow-hidden flex flex-col min-h-0">
        <ChatMessages />
      </div>

      {/* Input */}
      <ChatInput />
    </div>
  );
}
