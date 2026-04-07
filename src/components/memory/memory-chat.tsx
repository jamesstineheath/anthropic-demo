"use client";

import * as React from "react";
import { Plus, FolderOpen, AudioLines, ChevronDown, Brain, User } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { MEMORY_ITEMS } from "@/lib/memory/data";
import { useDemo } from "@/components/demo/demo-provider";
import { DEMO_STEPS } from "@/components/demo/demo-steps";

interface MemoryChatMessage {
  id: string;
  role: "user" | "agent";
  content: string;
}

const PROMPT_SUGGESTIONS = [
  "What do you know about my schedule preferences?",
  "How do my agents share information?",
  "What are you least confident about?",
  "What patterns have you noticed across my life?",
];

/**
 * Scripted responses keyed by substring match on user input.
 * Falls back to a general response.
 */
const RESPONSE_MAP: { match: RegExp; response: string }[] = [
  {
    match: /schedule|calendar|time|meeting/i,
    response:
      "Your schedule preferences are some of my highest-confidence memories. I know you protect Wednesday mornings for deep work, have a hard 5:00\u20137:30pm family boundary every day, and prefer 25-minute meetings over 30-minute defaults. Your Calendar agent learned these through a combination of what you told me during onboarding and patterns observed over 6 weeks of behavior. I also know your commute pattern (in-office Mon/Tue/Thu, home Wed/Fri) affects what meeting times are realistic on different days.",
  },
  {
    match: /share|cross.?agent|agents.*talk|information.*between/i,
    response:
      "Agents share context through the universal memory layer you're looking at right now. When your Calendar agent learns that you work from home on Fridays, your Date Night Planner can use that to suggest Friday evenings (no commute, nanny available). When your Friend Keeper notices you haven't seen your college group in months, it can check your Calendar data for realistic windows to reconnect. The memories marked with a \u2728 sparkle icon are ones where multiple agents contributed or benefit. Right now, 5 of your 13 memories involve cross-agent reasoning.",
  },
  {
    match: /confident|confidence|unsure|least|uncertain/i,
    response:
      "My lowest-confidence memories are the ones based on inference rather than direct statements. The school research memory (65%) is based on a passing mention during a scheduling conversation, so I could be wrong about the specifics. Your college friend group reconnection (72%) is inferred from calendar absence rather than anything you told me directly. And your nanny expense sensitivity (70%) came from a single conversational reference. These are exactly the kinds of memories where your feedback matters most: a thumbs-up or thumbs-down on the knowledge base panel helps me calibrate.",
  },
  {
    match: /pattern|across|life|notice|connect/i,
    response:
      "The most interesting pattern I see is a tension between your stated goals and your actual scheduling. You want 3 workouts a week but average 1.5, because deep work and meetings keep winning the morning priority contest on your WFH days. Similarly, you want to be more social but keep deprioritizing friend time. These aren't failures, they're resource allocation problems. A Chief of Staff meta-agent could reason across your Calendar, Fitness, and Friend Keeper contexts to suggest concrete tradeoffs: maybe one Wednesday morning becomes workout-then-lunch-with-a-friend, protecting both goals in a single block.",
  },
  {
    match: /allegra|partner|family|kid|children|nanny/i,
    response:
      "I know Sarah handles school pickup on Tuesdays and Thursdays, which gives you more afternoon flexibility on those days. Your 5:00\u20137:30pm boundary is non-negotiable family time. The nanny covers Mon/Wed/Fri pickups, and her Friday schedule extends to 7pm, which is why Friday evenings work best for date nights. I've built this picture from what you've stated directly, your calendar patterns, and cross-referencing across agents. The family context is some of the most interconnected knowledge I have because it affects scheduling, finances, health, and relationships simultaneously.",
  },
  {
    match: /work|ceo|product review|mill/i,
    response:
      "Your weekly product review with the CEO on Tuesdays at 10am is flagged as your highest-stakes recurring meeting. I know you block prep time before it and avoid scheduling anything in the preceding hour. Your Meeting Prep agent uses this to prioritize preparation materials. I also know you prefer to avoid more than 3 back-to-back meetings, and when it happens, your engagement drops in subsequent conversations. On in-office days (Mon/Tue/Thu), your schedule tends to be denser, which is why you protect WFH days for focused work.",
  },
];

const FALLBACK_RESPONSE =
  "I have 13 memories across 6 domains of your life. The strongest clusters are around your daily schedule and work patterns, where I have high confidence from both stated preferences and observed behavior. The most interesting memories are the cross-agent ones: knowledge that becomes more valuable because multiple agents can reason over it together. Is there a specific domain you'd like to explore?";

function getResponse(input: string): string {
  for (const { match, response } of RESPONSE_MAP) {
    if (match.test(input)) return response;
  }
  return FALLBACK_RESPONSE;
}

export function MemoryChat() {
  const [messages, setMessages] = React.useState<MemoryChatMessage[]>([]);
  const [input, setInput] = React.useState("");
  const [isTyping, setIsTyping] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const { mode, stepIndex, currentStep, visibleDialogue, isTyping: demoIsTyping } = useDemo();
  const prevStepRef = React.useRef(stepIndex);

  // Tour mode: inject demo dialogue into chat
  const isTourOnMemory = mode === "tour" && currentStep.route === "/memory";

  // Build tour messages from chain replay + visible dialogue
  const [tourMessages, setTourMessages] = React.useState<MemoryChatMessage[]>([]);
  const lastInjectedRef = React.useRef(0);

  React.useEffect(() => {
    if (!isTourOnMemory) return;
    const isStepChange = prevStepRef.current !== stepIndex;
    prevStepRef.current = stepIndex;

    if (isStepChange) {
      lastInjectedRef.current = visibleDialogue.length;
      // Replay chain
      const chain: MemoryChatMessage[] = [];
      if (currentStep.continueDialogue) {
        let i = stepIndex - 1;
        while (i >= 0) {
          const step = DEMO_STEPS[i];
          if (step.dialogue) {
            for (const msg of step.dialogue) {
              chain.push({ id: `tour-${i}-${chain.length}`, role: msg.role, content: msg.content });
            }
          }
          if (!step.continueDialogue) break;
          i--;
        }
      }
      setTourMessages(chain);
    }
  }, [stepIndex, isTourOnMemory, currentStep, visibleDialogue]);

  // Inject new visible dialogue entries
  React.useEffect(() => {
    if (!isTourOnMemory || !currentStep.dialogue?.length) return;
    if (visibleDialogue.length < lastInjectedRef.current) {
      lastInjectedRef.current = 0;
    }
    const newMsgs = visibleDialogue.slice(lastInjectedRef.current);
    if (newMsgs.length > 0) {
      setTourMessages(prev => [
        ...prev,
        ...newMsgs.map((msg, i) => ({
          id: `tour-vis-${Date.now()}-${i}`,
          role: msg.role,
          content: msg.content,
        })),
      ]);
      lastInjectedRef.current = visibleDialogue.length;
    }
  }, [visibleDialogue, isTourOnMemory, currentStep]);

  // Clear tour messages when leaving memory route in tour
  React.useEffect(() => {
    if (!isTourOnMemory) {
      setTourMessages([]);
      lastInjectedRef.current = 0;
    }
  }, [isTourOnMemory]);

  const displayMessages = isTourOnMemory ? tourMessages : messages;
  const displayIsTyping = isTourOnMemory ? demoIsTyping : isTyping;

  const scrollToBottom = React.useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  React.useEffect(() => {
    scrollToBottom();
  }, [displayMessages, displayIsTyping, scrollToBottom]);

  const handleSend = React.useCallback(
    (text: string) => {
      if (!text.trim() || isTyping) return;

      const userMsg: MemoryChatMessage = {
        id: `user-${Date.now()}`,
        role: "user",
        content: text.trim(),
      };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsTyping(true);

      // Simulate response delay
      setTimeout(() => {
        const response = getResponse(text);
        const agentMsg: MemoryChatMessage = {
          id: `agent-${Date.now()}`,
          role: "agent",
          content: response,
        };
        setMessages((prev) => [...prev, agentMsg]);
        setIsTyping(false);
      }, 800 + Math.random() * 600);
    },
    [isTyping]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSend(input);
  };

  const showEmptyState = displayMessages.length === 0 && !displayIsTyping;

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="shrink-0 border-b border-border px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image src="/claude-logo.svg" alt="Claude" width={16} height={16} />
          <span className="text-sm font-medium text-foreground">Memory</span>
        </div>
        <span className="text-xs text-muted-foreground">
          {MEMORY_ITEMS.length} memories
        </span>
      </div>

      {/* Messages area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {showEmptyState && (
          <div className="flex flex-col items-center justify-center h-full text-center px-6 space-y-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
              <Brain className="h-5 w-5 text-primary" />
            </div>
            <div className="space-y-1.5">
              <p className="text-sm font-medium text-foreground">
                Universal Memory
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
                Everything your agents have learned about you, shared across
                your entire team. Ask me anything about what I know.
              </p>
            </div>
            {!isTourOnMemory && (
              <div className="space-y-2 w-full max-w-xs pt-2">
                {PROMPT_SUGGESTIONS.map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => handleSend(prompt)}
                    className="w-full text-left rounded-lg border border-border px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-accent/50 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {displayMessages.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex gap-2.5",
              msg.role === "user" ? "justify-end" : "justify-start"
            )}
          >
            {msg.role === "agent" && (
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 mt-0.5">
                <Image src="/claude-logo.svg" alt="Claude" width={14} height={14} />
              </div>
            )}
            <div
              className={cn(
                "rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed max-w-[85%]",
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-sm"
                  : "bg-muted text-foreground rounded-bl-sm"
              )}
            >
              {msg.content}
            </div>
            {msg.role === "user" && (
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted mt-0.5">
                <User className="h-3 w-3 text-muted-foreground" />
              </div>
            )}
          </div>
        ))}

        {displayIsTyping && (
          <div className="flex gap-2.5">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 mt-0.5">
              <Image src="/claude-logo.svg" alt="Claude" width={14} height={14} />
            </div>
            <div className="rounded-2xl rounded-bl-sm bg-muted px-3.5 py-2.5">
              <div className="flex gap-1">
                <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:0ms]" />
                <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:150ms]" />
                <div className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:300ms]" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input — Claude.ai style */}
      <div className="shrink-0 px-3 pb-3 pt-1">
        <form onSubmit={handleSubmit}>
          <div className="rounded-xl border border-border bg-card focus-within:border-primary/40 focus-within:ring-1 focus-within:ring-primary/20 transition-colors">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Reply..."
              className="w-full bg-transparent px-4 pt-3 pb-2 text-sm placeholder:text-muted-foreground/50 focus:outline-none"
            />
            <div className="flex items-center justify-between px-3 pb-2">
              <div className="flex items-center gap-1">
                <button type="button" tabIndex={-1} className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground/50 hover:text-muted-foreground transition-colors cursor-default">
                  <Plus className="h-4 w-4" />
                </button>
                <button type="button" tabIndex={-1} className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground/50 hover:text-muted-foreground transition-colors cursor-default">
                  <FolderOpen className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button type="button" tabIndex={-1} className="flex items-center gap-1 text-xs text-muted-foreground cursor-default">
                  <span>Opus 4.6</span>
                  <ChevronDown className="h-3 w-3" />
                </button>
                <button type="button" tabIndex={-1} className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground/50 hover:text-muted-foreground transition-colors cursor-default">
                  <AudioLines className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </form>
        <p className="text-center text-xs text-muted-foreground/50 mt-2">
          Claude is AI and can make mistakes. Please double-check responses.
        </p>
      </div>
    </div>
  );
}
