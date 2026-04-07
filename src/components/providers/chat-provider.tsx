"use client";

import * as React from "react";
import {
  ONBOARDING_SCRIPT,
  ONBOARDING_COMPLETE_MESSAGE,
  STAGE_1_RESPONSES,
  STAGE_1_FALLBACK,
  STAGE_2_RESPONSES,
  STAGE_2_FALLBACK,
  STAGE_3_RESPONSES,
  STAGE_3_FALLBACK,
  STAGE_4_RESPONSES,
  STAGE_4_FALLBACK,
  STAGE_5_RESPONSES,
  STAGE_5_FALLBACK,
  type Stage1Response,
  type ScriptedMessage,
} from "@/lib/chat/scripts";
import { useTeam } from "./team-provider";
import { useDemo } from "@/components/demo/demo-provider";
import type { TrustStage } from "@/lib/agents/data";

export interface ToolCall {
  name: string;
  status: "running" | "complete";
  detail?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "agent";
  content: string;
  timestamp: Date;
  quickReplies?: string[];
  toolCalls?: ToolCall[];
  savingMemory?: boolean;
}

export interface AgentMemory {
  chronotype?: string;
  meetingStyle?: string;
  protectedTime?: string;
  frustration?: string;
  [key: string]: string | undefined;
}

interface ChatContextValue {
  messages: ChatMessage[];
  sendMessage: (content: string) => void;
  addMessage: (msg: Omit<ChatMessage, "id" | "timestamp">) => void;
  clearMessages: () => void;
  setIsTyping: (typing: boolean) => void;
  isTyping: boolean;
  memory: AgentMemory;
  onboardingStep: number;
  isOnboarding: boolean;
  lastConfidence: { score: "high" | "medium" | "low"; reason: string } | null;
  loadSnapshot?: (stage: TrustStage, snapshotMemory: AgentMemory, snapshotMessages: ChatMessage[]) => void;
}

const ChatContext = React.createContext<ChatContextValue | undefined>(undefined);

const MEMORY_STORAGE_KEY = "claude-agent-memory";
const MESSAGES_STORAGE_KEY = "claude-agent-messages";

function dateReviver(_key: string, value: unknown) {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T/.test(value)) {
    return new Date(value);
  }
  return value;
}

// Stage-specific response lookup
const STAGE_RESPONSES: Record<number, Stage1Response[]> = {
  1: STAGE_1_RESPONSES,
  2: STAGE_2_RESPONSES,
  3: STAGE_3_RESPONSES,
  4: STAGE_4_RESPONSES,
  5: STAGE_5_RESPONSES,
};

const STAGE_FALLBACKS: Record<number, Stage1Response> = {
  1: STAGE_1_FALLBACK,
  2: STAGE_2_FALLBACK,
  3: STAGE_3_FALLBACK,
  4: STAGE_4_FALLBACK,
  5: STAGE_5_FALLBACK,
};

function scriptedToChat(msg: ScriptedMessage): ChatMessage {
  return {
    id: msg.id,
    role: "agent",
    content: msg.content,
    timestamp: new Date(),
    quickReplies: msg.quickReplies,
    toolCalls: msg.toolCalls,
    savingMemory: msg.savingMemory,
  };
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = React.useState(false);
  const [onboardingStep, setOnboardingStep] = React.useState(0);
  const [memory, setMemory] = React.useState<AgentMemory>({});
  const [interactionsAtLevel, setInteractionsAtLevel] = React.useState(0);
  const initializedRef = React.useRef(false);
  const [lastConfidence, setLastConfidence] = React.useState<{
    score: "high" | "medium" | "low";
    reason: string;
  } | null>(null);
  const { getTrustStage, setTrustStage, isOnTeam, mounted } = useTeam();
  const { mode } = useDemo();

  const trustStage = getTrustStage("calendaring");

  // Persist memory to localStorage
  React.useEffect(() => {
    if (Object.keys(memory).length > 0) {
      localStorage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(memory));
    }
  }, [memory]);

  // Persist messages to localStorage
  React.useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  // Initialize: load from localStorage or start onboarding
  const onTeam = isOnTeam("calendaring");
  React.useEffect(() => {
    if (initializedRef.current || !onTeam || !mounted) return;
    initializedRef.current = true;

    // If tour just reset state, start clean
    const tourResetFlag = sessionStorage.getItem("tour-reset-pending");
    if (tourResetFlag) {
      sessionStorage.removeItem("tour-reset-pending");
      return;
    }

    // In tour mode the DemoDialogueBridge owns the chat — never auto-start.
    if (mode === "tour") {
      return;
    }

    // Try to load persisted state
    const savedMemory = localStorage.getItem(MEMORY_STORAGE_KEY);
    const savedMessages = localStorage.getItem(MESSAGES_STORAGE_KEY);

    if (savedMemory && trustStage >= 1) {
      // Returning user — restore state, skip onboarding
      setMemory(JSON.parse(savedMemory));
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages, dateReviver));
      }
      setOnboardingStep(-1); // onboarding complete
      return;
    }

    if (trustStage === 0) {
      const firstMsg = ONBOARDING_SCRIPT[0].agentMessage;
      setIsTyping(true);
      setTimeout(() => {
        setMessages([scriptedToChat(firstMsg)]);
        setIsTyping(false);
        setOnboardingStep(1);
      }, firstMsg.delayMs);
    }
  }, [trustStage, onTeam, mounted, mode]);

  const clearMessages = React.useCallback(() => {
    setMessages([]);
    setIsTyping(false);
  }, []);

  const msgCounterRef = React.useRef(0);
  const addMessage = React.useCallback(
    (msg: Omit<ChatMessage, "id" | "timestamp">) => {
      const uid = `msg-${Date.now()}-${msgCounterRef.current++}`;
      setMessages((prev) => [
        ...prev,
        {
          ...msg,
          id: uid,
          timestamp: new Date(),
        },
      ]);
    },
    []
  );

  const addAgentMessage = React.useCallback(
    (content: string, quickReplies?: string[], delayMs: number = 600) => {
      setIsTyping(true);
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: `msg-${Date.now()}`,
              role: "agent",
              content,
              timestamp: new Date(),
              quickReplies,
            },
          ]);
          setIsTyping(false);
          resolve();
        }, delayMs);
      });
    },
    []
  );

  const sendMessage = React.useCallback(
    (content: string) => {
      // Add user message
      const userMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        role: "user",
        content,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);

      if (trustStage === 0 && onboardingStep > 0) {
        // Handle onboarding flow
        const currentScript = ONBOARDING_SCRIPT[onboardingStep - 1];
        if (currentScript) {
          const key = currentScript.responseKey;
          if (!key.startsWith("__")) {
            setMemory((prev) => ({ ...prev, [key]: content }));
          }
        }

        if (onboardingStep < ONBOARDING_SCRIPT.length) {
          const showStep = (stepIdx: number) => {
            const script = ONBOARDING_SCRIPT[stepIdx];
            const msg = script.agentMessage;
            setIsTyping(true);
            setTimeout(() => {
              setMessages((prev) => [...prev, scriptedToChat(msg)]);
              setIsTyping(false);
              setOnboardingStep(stepIdx + 1);
              // If this step auto-advances and there's a next step, show it
              if (script.autoAdvance && stepIdx + 1 < ONBOARDING_SCRIPT.length) {
                const nextNext = ONBOARDING_SCRIPT[stepIdx + 1];
                const nnMsg = nextNext.agentMessage;
                setIsTyping(true);
                setTimeout(() => {
                  setMessages((prev) => [...prev, scriptedToChat(nnMsg)]);
                  setIsTyping(false);
                  setOnboardingStep(stepIdx + 2);
                }, nnMsg.delayMs);
              }
            }, msg.delayMs);
          };
          showStep(onboardingStep);
        } else {
          // Store last answer then complete onboarding
          const lastScript = ONBOARDING_SCRIPT[ONBOARDING_SCRIPT.length - 1];
          setMemory((prev) => ({ ...prev, [lastScript.responseKey]: content }));

          const completeMsg = ONBOARDING_COMPLETE_MESSAGE;
          setIsTyping(true);
          setTimeout(() => {
            setMessages((prev) => [...prev, scriptedToChat(completeMsg)]);
            setIsTyping(false);
            setTrustStage("calendaring", 1 as TrustStage);
            setOnboardingStep(-1);
            setInteractionsAtLevel(0);
          }, completeMsg.delayMs);
        }
      } else if (trustStage >= 1) {
        // Stage 1-5 responses — sequential scripted playback
        const responses = STAGE_RESPONSES[trustStage] || STAGE_1_RESPONSES;
        const fallback = STAGE_FALLBACKS[trustStage] || STAGE_1_FALLBACK;

        const match = responses[interactionsAtLevel] ?? fallback;

        const responseContent = match.content
          .replace("{eventCount}", "23")
          .replace("{meetingCount}", "15")
          .replace("{meetingHours}", "12")
          .replace("{meetingPercent}", "30%");

        setLastConfidence({
          score: match.confidence,
          reason: match.confidenceReason,
        });

        addAgentMessage(responseContent, undefined, 800).then(() => {
          const newCount = interactionsAtLevel + 1;
          setInteractionsAtLevel(newCount);
        });
      }
    },
    [trustStage, onboardingStep, addAgentMessage, setTrustStage, interactionsAtLevel]
  );

  // Atomic snapshot loader for demo controller
  const loadSnapshot = React.useCallback(
    (stage: TrustStage, snapshotMemory: AgentMemory, snapshotMessages: ChatMessage[]) => {
      const now = new Date();
      const timestampedMessages = snapshotMessages.map((msg, i) => ({
        ...msg,
        timestamp: new Date(now.getTime() - (snapshotMessages.length - i) * 60000),
      }));
      setMessages(timestampedMessages);
      setMemory(snapshotMemory);
      setTrustStage("calendaring", stage);
      setOnboardingStep(stage === 0 ? 0 : -1);
      setLastConfidence(null);
      setInteractionsAtLevel(0);
      // Persist directly
      localStorage.setItem(MEMORY_STORAGE_KEY, JSON.stringify(snapshotMemory));
      localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(timestampedMessages));
    },
    [setTrustStage]
  );

  const isOnboarding = trustStage === 0 && onboardingStep >= 0;

  return (
    <ChatContext.Provider
      value={{
        messages,
        sendMessage,
        addMessage,
        clearMessages,
        setIsTyping,
        isTyping,
        memory,
        onboardingStep,
        isOnboarding,
        lastConfidence,
        loadSnapshot,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = React.useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
