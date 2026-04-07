"use client";

import { useChat } from "@/components/providers/chat-provider";
import { ChatMessages } from "@/components/chat/chat-messages";
import { ChatInput } from "@/components/chat/chat-input";

export function ChatPanel() {
  const { memory } = useChat();

  // Show a couple of key memory items as subtle context
  const memoryItems = Object.entries(memory)
    .filter(([k]) => ["chronotype", "meetingStyle", "protectedTime"].includes(k))
    .slice(0, 2);

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="shrink-0 border-b border-border px-4 py-2 flex items-center">
        <span className="text-sm font-medium text-foreground">Chat</span>
      </div>

      {/* Memory context (shown when onboarding is complete) */}
      {memoryItems.length > 0 && (
        <div className="shrink-0 border-b border-border px-4 py-2 space-y-0.5">
          {memoryItems.map(([key, value]) => (
            <div key={key} className="flex items-start gap-1.5 text-sm text-muted-foreground">
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
