"use client";

import { useRef, useEffect } from "react";
import { useChat } from "@/components/providers/chat-provider";
import { ChatBubble } from "./chat-bubble";

export function ChatMessages() {
  const { messages, sendMessage, isTyping } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  if (messages.length === 0 && !isTyping) return null;

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
    >
      {messages.map((msg, i) => (
        <ChatBubble
          key={msg.id}
          message={msg}
          isLastMessage={i === messages.length - 1}
          onQuickReply={sendMessage}
        />
      ))}

      {isTyping && (
        <div className="flex items-center gap-2.5">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <div className="flex gap-0.5">
              <div className="h-1 w-1 rounded-full bg-primary/60 animate-bounce [animation-delay:0ms]" />
              <div className="h-1 w-1 rounded-full bg-primary/60 animate-bounce [animation-delay:150ms]" />
              <div className="h-1 w-1 rounded-full bg-primary/60 animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
          <div className="rounded-2xl rounded-tl-md bg-secondary px-3.5 py-2.5 text-[13px] text-muted-foreground">
            <div className="flex gap-1">
              <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:0ms]" />
              <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:150ms]" />
              <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
