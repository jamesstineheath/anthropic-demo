"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { useChat } from "@/components/providers/chat-provider";
import { useTeam } from "@/components/providers/team-provider";
import { useDemo } from "@/components/demo/demo-provider";
import { TRUST_STAGE_DETAILS } from "@/lib/agents/trust";
import { ChatBubble } from "./chat-bubble";

const STAGE_PROMPTS: Record<number, string[]> = {
  0: [
    "Tell me about your typical day",
    "What does your week look like?",
  ],
  1: [
    "What's on my calendar today?",
    "Do I have any conflicts this week?",
    "When is my next free hour?",
  ],
  2: [
    "When should I schedule a dentist appointment?",
    "Find me a focus block this week",
    "Is Tuesday or Thursday better for a long meeting?",
  ],
  3: [
    "Am I overscheduled this week?",
    "What patterns do you see in my energy levels?",
    "How can I protect more deep work time?",
  ],
  4: [
    "Block focus time before my Thursday deadline",
    "Move my 1:1 to a better slot",
    "What should I change about next week?",
  ],
  5: [
    "Handle my scheduling for the rest of the week",
    "Resolve the conflict on Wednesday",
    "Coordinate dinner with Sarah this weekend",
  ],
};

export function ChatMessages() {
  const { messages, sendMessage, isTyping } = useChat();
  const { getTrustStage } = useTeam();
  const { mode } = useDemo();
  const scrollRef = useRef<HTMLDivElement>(null);
  const trustStage = getTrustStage("calendaring");

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  if (messages.length === 0 && !isTyping) {
    const stageDetails = TRUST_STAGE_DETAILS[trustStage];
    const prompts = STAGE_PROMPTS[trustStage] || STAGE_PROMPTS[1];

    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E8DDD3]/50 mb-4">
          <Image src="/claude-logo.svg" alt="Claude" width={20} height={20} />
        </div>
        <h3 className="text-base font-semibold text-foreground mb-1">
          Calendar Agent
        </h3>
        <p className="text-sm text-muted-foreground text-center mb-6 max-w-[280px] leading-relaxed">
          {stageDetails.description}
        </p>

        {mode !== "tour" && (
          <div className="w-full max-w-[300px] space-y-2">
            <div className="text-xs font-medium text-muted-foreground/60 uppercase tracking-wider mb-2 text-center">
              Try asking
            </div>
            {prompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => sendMessage(prompt)}
                className="w-full text-left rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground hover:border-primary/30 hover:bg-accent/50 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

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
        />
      ))}

      {isTyping && (
        <div className="flex items-center gap-2.5">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E8DDD3]/50">
            <div className="flex gap-0.5">
              <div className="h-1 w-1 rounded-full bg-primary/60 animate-bounce [animation-delay:0ms]" />
              <div className="h-1 w-1 rounded-full bg-primary/60 animate-bounce [animation-delay:150ms]" />
              <div className="h-1 w-1 rounded-full bg-primary/60 animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
          <div className="rounded-2xl rounded-tl-md bg-secondary px-3.5 py-2.5 text-sm text-muted-foreground">
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
