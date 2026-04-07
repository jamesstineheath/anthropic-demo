"use client";

import * as React from "react";
import { useDemo } from "@/components/demo/demo-provider";
import { useChat } from "@/components/providers/chat-provider";
import { DEMO_STEPS } from "@/components/demo/demo-steps";

/**
 * Bridge component that injects demo dialogue into the ChatPanel.
 * Must be rendered inside both DemoProvider and ChatProvider.
 * When a demo step has dialogue and the mode is "tour",
 * it plays the messages into the actual chat UI with typing indicators.
 *
 * For steps with `continueDialogue`, it reconstructs the full conversation
 * chain from prior steps so that the chat always shows the correct history,
 * even after a page reload.
 */
export function DemoDialogueBridge() {
  const { mode, stepIndex, currentStep, visibleDialogue, isTyping: demoIsTyping } = useDemo();
  const { addMessage, clearMessages, setIsTyping } = useChat();
  const lastInjectedRef = React.useRef(0);
  const prevStepRef = React.useRef(stepIndex);
  const hasInitRef = React.useRef(false);

  // On first mount or step change: clear chat and replay the conversation chain
  React.useEffect(() => {
    const isStepChange = prevStepRef.current !== stepIndex;
    prevStepRef.current = stepIndex;

    if (!hasInitRef.current || isStepChange) {
      hasInitRef.current = true;
      // Sync to current visibleDialogue length so the injection effect
      // doesn't re-inject stale messages from the previous step
      // (child effects run before parent, so DemoProvider hasn't reset yet)
      lastInjectedRef.current = visibleDialogue.length;

      if (mode === "tour") {
        clearMessages();

        // If this step continues a dialogue chain, replay prior messages instantly
        if (currentStep.continueDialogue) {
          const chain: Array<{ role: "user" | "agent"; content: string }> = [];
          let i = stepIndex - 1;
          while (i >= 0) {
            const step = DEMO_STEPS[i];
            if (step.dialogue) {
              chain.unshift(...step.dialogue);
            }
            if (!step.continueDialogue) break;
            i--;
          }
          for (const msg of chain) {
            addMessage({ role: msg.role, content: msg.content });
          }
        }
      }
    }
  }, [stepIndex, mode, currentStep.continueDialogue, clearMessages, addMessage, visibleDialogue]);

  // Sync typing indicator from demo to chat
  React.useEffect(() => {
    if (mode !== "tour" || !currentStep.dialogue?.length) return;
    setIsTyping(demoIsTyping);
  }, [demoIsTyping, mode, currentStep, setIsTyping]);

  // Inject new dialogue entries into the chat panel as they appear
  React.useEffect(() => {
    if (mode !== "tour" || !currentStep.dialogue?.length) return;

    // Detect DemoProvider reset (visibleDialogue shrunk after step change)
    if (visibleDialogue.length < lastInjectedRef.current) {
      lastInjectedRef.current = 0;
    }

    const newMessages = visibleDialogue.slice(lastInjectedRef.current);
    for (const msg of newMessages) {
      addMessage({ role: msg.role, content: msg.content });
    }
    lastInjectedRef.current = visibleDialogue.length;
  }, [visibleDialogue, mode, currentStep, addMessage]);

  return null;
}
