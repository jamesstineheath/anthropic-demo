"use client";

import Image from "next/image";
import { Brain, Check, Loader2, Wrench } from "lucide-react";
import type { ChatMessage } from "@/components/providers/chat-provider";
import { cn } from "@/lib/utils";

interface ChatBubbleProps {
  message: ChatMessage;
  isLastMessage?: boolean;
}

export function ChatBubble({
  message,
  isLastMessage: _isLastMessage,
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
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E8DDD3]/50 mt-0.5">
          <Image src="/claude-logo.svg" alt="Claude" width={14} height={14} />
        </div>
      )}

      <div className={cn("max-w-[85%]", !isAgent && "order-first")}>
        {/* Tool calls */}
        {isAgent && message.toolCalls && message.toolCalls.length > 0 && (
          <div className="mb-2 space-y-1">
            {message.toolCalls.map((tc, i) => (
              <div
                key={i}
                className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs text-muted-foreground"
              >
                {tc.status === "running" ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Check className="h-3 w-3 text-green-600" />
                )}
                <Wrench className="h-3 w-3" />
                <span className="font-medium">{tc.name}</span>
                {tc.detail && <span className="text-muted-foreground/60">{tc.detail}</span>}
              </div>
            ))}
          </div>
        )}

        {/* Saving memory indicator */}
        {isAgent && message.savingMemory && (
          <div className="mb-2 flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-1.5 text-xs text-muted-foreground">
            <Brain className="h-3 w-3 text-amber-600" />
            <span className="font-medium">Saving to memory</span>
          </div>
        )}

        {/* Message content */}
        {message.content && (
          <div
            className={cn(
              "rounded-2xl px-3.5 py-2.5 text-base leading-relaxed",
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
        )}

      </div>
    </div>
  );
}
