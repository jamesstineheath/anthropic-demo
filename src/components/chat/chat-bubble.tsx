"use client";

import { Sparkles } from "lucide-react";
import type { ChatMessage } from "@/components/providers/chat-provider";
import { QuickReplies } from "./quick-replies";
import { cn } from "@/lib/utils";

interface ChatBubbleProps {
  message: ChatMessage;
  onQuickReply?: (reply: string) => void;
  isLastMessage?: boolean;
}

export function ChatBubble({
  message,
  onQuickReply,
  isLastMessage,
}: ChatBubbleProps) {
  const isAgent = message.role === "agent";

  // Simple markdown-like bold rendering
  const renderContent = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-semibold">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div
      className={cn(
        "flex gap-2.5",
        isAgent ? "justify-start" : "justify-end"
      )}
    >
      {isAgent && (
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 mt-0.5">
          <Sparkles className="h-3 w-3 text-primary" />
        </div>
      )}

      <div className={cn("max-w-[85%]", !isAgent && "order-first")}>
        <div
          className={cn(
            "rounded-2xl px-3.5 py-2.5 text-[15px] leading-relaxed",
            isAgent
              ? "bg-secondary text-foreground rounded-tl-md"
              : "bg-primary text-primary-foreground rounded-tr-md"
          )}
        >
          {message.content.split("\n").map((line, i) => (
            <p key={i} className={i > 0 ? "mt-1.5" : ""}>
              {renderContent(line)}
            </p>
          ))}
        </div>

        {/* Quick replies */}
        {isAgent &&
          isLastMessage &&
          message.quickReplies &&
          message.quickReplies.length > 0 &&
          onQuickReply && (
            <QuickReplies
              replies={message.quickReplies}
              onSelect={onQuickReply}
            />
          )}
      </div>
    </div>
  );
}
