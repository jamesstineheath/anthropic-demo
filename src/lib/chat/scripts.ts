export interface ScriptedMessage {
  id: string;
  role: "agent";
  content: string;
  quickReplies?: string[];
  delayMs: number;
}

export interface ScriptStep {
  agentMessage: ScriptedMessage;
  responseKey: string; // key for storing the user's answer
}

export const ONBOARDING_SCRIPT: ScriptStep[] = [
  {
    agentMessage: {
      id: "onboard-0",
      role: "agent",
      content:
        "Hi! I'm your Calendaring agent. Right now I can help with general scheduling questions and time management tips. As I learn about you, I'll unlock more personalized capabilities.\n\nLet's start with a few quick questions.",
      delayMs: 800,
    },
    responseKey: "__intro__",
  },
  {
    agentMessage: {
      id: "onboard-1",
      role: "agent",
      content: "Are you more of a morning person or a night owl?",
      quickReplies: ["Night owl", "Morning person", "It depends"],
      delayMs: 600,
    },
    responseKey: "chronotype",
  },
  {
    agentMessage: {
      id: "onboard-2",
      role: "agent",
      content:
        "Do you prefer meetings clustered together or spread throughout the day?",
      quickReplies: ["Clustered", "Spread out", "No preference"],
      delayMs: 600,
    },
    responseKey: "meetingStyle",
  },
  {
    agentMessage: {
      id: "onboard-3",
      role: "agent",
      content: "Any days or times that should always stay free?",
      quickReplies: [
        "5-7:30pm (kids)",
        "Wed/Fri mornings",
        "Both of those",
        "Let me type...",
      ],
      delayMs: 600,
    },
    responseKey: "protectedTime",
  },
  {
    agentMessage: {
      id: "onboard-4",
      role: "agent",
      content: "What's your biggest scheduling frustration?",
      quickReplies: [
        "Childcare coordination",
        "Too many calendars",
        "Both of those",
        "Let me type...",
      ],
      delayMs: 600,
    },
    responseKey: "frustration",
  },
];

export const ONBOARDING_COMPLETE_MESSAGE: ScriptedMessage = {
  id: "onboard-complete",
  role: "agent",
  content:
    "Got it — I've already learned a few things about you. I'm now at **Stage 1: General Assistant**. I can answer questions about your schedule and share observations.\n\nTry asking me about your week, or I'll point out things I've noticed.",
  delayMs: 1000,
};

export interface Stage1Response {
  triggers: string[];
  content: string;
  confidence: "high" | "medium" | "low";
  confidenceReason: string;
}

export const STAGE_1_RESPONSES: Stage1Response[] = [
  {
    triggers: ["schedule", "week", "this week", "what's on", "calendar", "busy"],
    content:
      "Looking at your week — you have **{eventCount} events** scheduled. I notice a couple of things:\n\n• You have **2 scheduling conflicts** this week (Wednesday and Thursday). Want me to flag the details?\n• Your deep work blocks on Tuesday and Thursday look good, but Wednesday is pretty packed.\n\nWant me to walk through any specific day?",
    confidence: "high",
    confidenceReason: "Direct calendar data reference",
  },
  {
    triggers: ["conflict", "double", "overlap", "clash"],
    content:
      'I found **2 conflicts** this week:\n\n1. **Wednesday 2:00 PM** — "Design Review" and "Product Strategy Sync" overlap completely.\n2. **Thursday 9:15 AM** — "Investor Update Prep" overlaps with your standup.\n\nAt my current stage I can flag these, but I\'d need to reach Stage 2 before I can suggest specific resolutions.',
    confidence: "high",
    confidenceReason: "Direct calendar conflict detection",
  },
  {
    triggers: ["meeting", "meetings", "too many"],
    content:
      "This week you have **{meetingCount} meetings** totaling about **{meetingHours} hours**. That's roughly {meetingPercent} of your work hours.\n\nYour meeting-free blocks are:\n• Tuesday 1–4 PM (deep work)\n• Thursday 1–4 PM (deep work)\n• Wednesday 9–11 AM (writing time)\n\nOnce I reach Stage 3, I'll be able to analyze meeting patterns over time and suggest optimizations.",
    confidence: "medium",
    confidenceReason: "Calendar data + stated preference match",
  },
  {
    triggers: ["tomorrow", "today", "monday", "tuesday", "wednesday", "thursday", "friday"],
    content:
      "Here's what I see for that day — check your calendar view for the details. I can see the events but at Stage 1, I'm still building a picture of your priorities. As I learn more about which meetings matter most to you, my suggestions will get sharper.",
    confidence: "medium",
    confidenceReason: "Limited contextual understanding at Stage 1",
  },
  {
    triggers: ["help", "what can you do", "capabilities"],
    content:
      "At **Stage 1 (General Assistant)**, I can:\n\n✅ Answer questions about your schedule\n✅ Flag calendar conflicts\n✅ Share basic observations\n\nAs I learn more, I'll unlock:\n🔒 **Stage 2:** Personalized scheduling suggestions\n🔒 **Stage 3:** Pattern detection and optimization\n🔒 **Stage 4:** Proactive notifications\n🔒 **Stage 5:** Autonomous rescheduling\n\nWhat would you like to know about your schedule?",
    confidence: "high",
    confidenceReason: "Static capability information",
  },
];

export const STAGE_1_FALLBACK: Stage1Response = {
  triggers: [],
  content:
    "I'm still learning at Stage 1, so I'm best at answering direct questions about your schedule. Try asking about your week, upcoming conflicts, or meeting load.\n\nAs I advance to higher stages, I'll be able to handle more complex requests and even take proactive action.",
  confidence: "low",
  confidenceReason: "No matching pattern — limited Stage 1 capabilities",
};
