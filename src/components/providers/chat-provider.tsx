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

interface AgentMemory {
  chronotype?: string;
  meetingStyle?: string;
  protectedTime?: string;
  frustration?: string;
}

interface ChatContextValue {
  messages: ChatMessage[];
  sendMessage: (content: string) => void;
  isTyping: boolean;
  memory: AgentMemory;
  onboardingStep: number;
  isOnboarding: boolean;
  lastConfidence: { score: "high" | "medium" | "low"; reason: string } | null;
}

const ChatContext = React.createContext<ChatContextValue | undefined>(undefined);

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
  const { getTrustStage, setTrustStage, isOnTeam } = useTeam();

  const trustStage = getTrustStage("calendaring");

  // Send the first onboarding message
  const onTeam = isOnTeam("calendaring");
  React.useEffect(() => {
    if (initializedRef.current || !onTeam) return;
    initializedRef.current = true;

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
  }, [trustStage, onTeam]);

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
          // Store the user's answer
          const key = currentScript.responseKey;
          if (key !== "__intro__") {
            setMemory((prev) => ({ ...prev, [key]: content }));
          }
        }

        if (onboardingStep < ONBOARDING_SCRIPT.length) {
          // Next onboarding question
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

          // Onboarding complete → advance to stage 1
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
            setOnboardingStep(-1); // Done
          }, completeMsg.delayMs);
        }
      } else if (trustStage >= 1) {
        // Stage 1+ responses
        const lowerContent = content.toLowerCase();
        const match =
          STAGE_1_RESPONSES.find((r) =>
            r.triggers.some((t) => lowerContent.includes(t))
          ) ?? STAGE_1_FALLBACK;

        // Fill in template variables
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
