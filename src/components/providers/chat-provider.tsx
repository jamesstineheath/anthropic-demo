"use client";

import * as React from "react";
import {
  ONBOARDING_SCRIPT,
  ONBOARDING_COMPLETE_MESSAGE,
  STAGE_1_RESPONSES,
  STAGE_1_FALLBACK,
} from "@/lib/chat/scripts";
import { useTeam } from "./team-provider";
import type { TrustStage } from "@/lib/agents/data";

export interface ChatMessage {
  id: string;
  role: "user" | "agent";
  content: string;
  timestamp: Date;
  quickReplies?: string[];
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

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = React.useState(false);
  const [onboardingStep, setOnboardingStep] = React.useState(0);
  const [memory, setMemory] = React.useState<AgentMemory>({});
  const initializedRef = React.useRef(false);
  const [lastConfidence, setLastConfidence] = React.useState<{
    score: "high" | "medium" | "low";
    reason: string;
  } | null>(null);
  const { getTrustStage, setTrustStage, isOnTeam, mounted } = useTeam();

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
        setMessages([
          {
            id: firstMsg.id,
            role: "agent",
            content: firstMsg.content,
            timestamp: new Date(),
            quickReplies: firstMsg.quickReplies,
          },
        ]);
        setIsTyping(false);
        setOnboardingStep(1);
      }, firstMsg.delayMs);
    }
  }, [trustStage, onTeam, mounted]);

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
          if (key !== "__intro__") {
            setMemory((prev) => ({ ...prev, [key]: content }));
          }
        }

        if (onboardingStep < ONBOARDING_SCRIPT.length) {
          const nextScript = ONBOARDING_SCRIPT[onboardingStep];
          const nextMsg = nextScript.agentMessage;
          setIsTyping(true);
          setTimeout(() => {
            setMessages((prev) => [
              ...prev,
              {
                id: nextMsg.id,
                role: "agent",
                content: nextMsg.content,
                timestamp: new Date(),
                quickReplies: nextMsg.quickReplies,
              },
            ]);
            setIsTyping(false);
            setOnboardingStep((prev) => prev + 1);
          }, nextMsg.delayMs);
        } else {
          // Store last answer then complete onboarding
          const lastScript = ONBOARDING_SCRIPT[ONBOARDING_SCRIPT.length - 1];
          setMemory((prev) => ({ ...prev, [lastScript.responseKey]: content }));

          const completeMsg = ONBOARDING_COMPLETE_MESSAGE;
          setIsTyping(true);
          setTimeout(() => {
            setMessages((prev) => [
              ...prev,
              {
                id: completeMsg.id,
                role: "agent",
                content: completeMsg.content,
                timestamp: new Date(),
              },
            ]);
            setIsTyping(false);
            setTrustStage("calendaring", 1 as TrustStage);
            setOnboardingStep(-1);
          }, completeMsg.delayMs);
        }
      } else if (trustStage >= 1) {
        // Stage 1+ responses
        const lowerContent = content.toLowerCase();
        const match =
          STAGE_1_RESPONSES.find((r) =>
            r.triggers.some((t) => lowerContent.includes(t))
          ) ?? STAGE_1_FALLBACK;

        let responseContent = match.content
          .replace("{eventCount}", "23")
          .replace("{meetingCount}", "15")
          .replace("{meetingHours}", "12")
          .replace("{meetingPercent}", "30%");

        setLastConfidence({
          score: match.confidence,
          reason: match.confidenceReason,
        });

        addAgentMessage(responseContent, undefined, 800);
      }
    },
    [trustStage, onboardingStep, addAgentMessage, setTrustStage]
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
