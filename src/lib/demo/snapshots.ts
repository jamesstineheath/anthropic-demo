import type { TrustStage } from "@/lib/agents/data";
import type { AgentMemory, ChatMessage } from "@/components/providers/chat-provider";

export interface DemoSnapshot {
  trustStage: TrustStage;
  memory: AgentMemory;
  messages: ChatMessage[];
}

// Messages use placeholder timestamps — loadSnapshot() assigns real ones.
const ts = new Date(0);

const LEVEL_0_MESSAGES: ChatMessage[] = [
  {
    id: "onboard-0",
    role: "agent",
    content:
      "Hi! I'm your Calendaring agent. Right now I can help with general scheduling questions and time management tips. As I learn about you, I'll unlock more personalized capabilities.\n\nLet's start with a few quick questions.",
    timestamp: ts,
    quickReplies: ["Night owl", "Morning person", "It depends"],
  },
];

const LEVEL_1_MESSAGES: ChatMessage[] = [
  // Onboarding Q&A
  { id: "s-0", role: "agent", content: "Hi! I'm your Calendaring agent. Right now I can help with general scheduling questions and time management tips. As I learn about you, I'll unlock more personalized capabilities.\n\nLet's start with a few quick questions.", timestamp: ts },
  { id: "s-1", role: "agent", content: "Are you more of a morning person or a night owl?", timestamp: ts },
  { id: "u-1", role: "user", content: "Night owl", timestamp: ts },
  { id: "s-2", role: "agent", content: "Do you prefer meetings clustered together or spread throughout the day?", timestamp: ts },
  { id: "u-2", role: "user", content: "Clustered", timestamp: ts },
  { id: "s-3", role: "agent", content: "Any days or times that should always stay free?", timestamp: ts },
  { id: "u-3", role: "user", content: "Both of those", timestamp: ts },
  { id: "s-4", role: "agent", content: "What's your biggest scheduling frustration?", timestamp: ts },
  { id: "u-4", role: "user", content: "Both of those", timestamp: ts },
  { id: "s-done", role: "agent", content: "Got it — I've already learned a few things about you. I'm now at **Stage 1: General Assistant**. I can answer questions about your schedule and share observations.\n\nTry asking me about your week, or I'll point out things I've noticed.", timestamp: ts },
];

const LEVEL_2_MESSAGES: ChatMessage[] = [
  ...LEVEL_1_MESSAGES,
  // Stage 1 interactions leading to advancement
  { id: "u-5", role: "user", content: "What does my week look like?", timestamp: ts },
  { id: "s-5", role: "agent", content: "Looking at your week — you have **23 events** scheduled. I notice a couple of things:\n\n• You have **2 scheduling conflicts** this week (Wednesday and Thursday). Want me to flag the details?\n• Your deep work blocks on Tuesday and Thursday look good, but Wednesday is pretty packed.\n\nWant me to walk through any specific day?", timestamp: ts },
  { id: "u-6", role: "user", content: "Tell me about the conflicts", timestamp: ts },
  { id: "s-6", role: "agent", content: "I found **2 conflicts** this week:\n\n1. **Wednesday 2:00 PM** — \"Design Review\" and \"Product Strategy Sync\" overlap completely.\n2. **Thursday 9:15 AM** — \"Investor Update Prep\" overlaps with your standup.\n\nAt my current stage I can flag these, but I'd need to reach Stage 2 before I can suggest specific resolutions.", timestamp: ts },
  { id: "u-7", role: "user", content: "How many meetings do I have?", timestamp: ts },
  { id: "s-7", role: "agent", content: "This week you have **15 meetings** totaling about **12 hours**. That's roughly 30% of your work hours.\n\nYour meeting-free blocks are:\n• Tuesday 1–4 PM (deep work)\n• Thursday 1–4 PM (deep work)\n• Wednesday 9–11 AM (writing time)\n\nOnce I reach Stage 3, I'll be able to analyze meeting patterns over time and suggest optimizations.", timestamp: ts },
  { id: "s-lvl2", role: "agent", content: "I've earned enough trust to advance.\n\nI'm now at **Stage 2: Personal Advisor**. I have new capabilities — ask me what's changed.", timestamp: ts },
];

const LEVEL_3_MESSAGES: ChatMessage[] = [
  ...LEVEL_2_MESSAGES,
  // Stage 2 interaction — energy/focus
  { id: "u-8", role: "user", content: "When am I most productive?", timestamp: ts },
  { id: "s-8", role: "agent", content: "I've noticed a pattern in how you schedule focus time. On home days (Wed/Fri), you consistently block 9-11am or 1-3pm and actually keep them. On office days, your focus blocks get overwritten about 60% of the time.\n\nYour best uninterrupted work happens Wednesday mornings — you've protected that slot 4 out of the last 4 weeks.\n\nWant me to start declining non-essential meeting requests that land on Wednesday morning?", timestamp: ts },
  { id: "s-lvl3", role: "agent", content: "I've earned enough trust to advance.\n\nI'm now at **Stage 3: Active Analyst**. I have new capabilities — ask me what's changed.", timestamp: ts },
];

const LEVEL_4_MESSAGES: ChatMessage[] = [
  ...LEVEL_3_MESSAGES,
  // Stage 3 interaction — schedule health
  { id: "u-9", role: "user", content: "How's my schedule health?", timestamp: ts },
  { id: "s-9", role: "agent", content: "Schedule health: **62/100** (down from 71 last week).\n\nBreakdown:\n• **Meeting load** is normal (18 hrs, your average)\n• **Personal time** is compressed — you're solo parenting Mon-Wed with Allegra traveling, which means zero buffer\n• **Focus blocks** — none longer than 90 min this week\n• **Dog walks** are happening (good sign), but you skipped your usual Friday afternoon downtime last week\n\nBiggest risk: Tuesday is your anniversary and your densest meeting day. If anything runs long, your evening is gone.", timestamp: ts },
  { id: "s-lvl4", role: "agent", content: "I've earned enough trust to advance.\n\nI'm now at **Stage 4: Proactive Partner**. I have new capabilities — ask me what's changed.", timestamp: ts },
];

const LEVEL_5_MESSAGES: ChatMessage[] = [
  ...LEVEL_4_MESSAGES,
  // Stage 4 interaction — anniversary conflict (emotional high point)
  { id: "u-10", role: "user", content: "What did you do about the anniversary conflict?", timestamp: ts },
  { id: "s-10", role: "agent", content: "I declined the Product Strategy Review on your behalf. Here's what I sent to Azita:\n\n> \"James has a personal commitment Tuesday evening that he can't move. He's available Thursday 11am-12pm if that works for the team, or he can review materials async Wednesday and send comments by EOD.\"\n\nI also blocked 5:30-9:00pm on your work calendar as \"Personal — Anniversary\" so nothing else lands there. Allegra's back Wednesday night, so Thursday onward your evenings are shared again.\n\nHappy anniversary, by the way.", timestamp: ts },
  { id: "s-lvl5", role: "agent", content: "I've earned enough trust to advance.\n\nI'm now at **Stage 5: Trusted Delegate**. I have new capabilities — ask me what's changed.", timestamp: ts },
];

const BASE_MEMORY: AgentMemory = {
  chronotype: "Night owl",
  meetingStyle: "Clustered",
  protectedTime: "Both of those",
  frustration: "Both of those",
};

export const DEMO_SNAPSHOTS: Record<number, DemoSnapshot> = {
  0: {
    trustStage: 0 as TrustStage,
    memory: {},
    messages: LEVEL_0_MESSAGES,
  },
  1: {
    trustStage: 1 as TrustStage,
    memory: { ...BASE_MEMORY },
    messages: LEVEL_1_MESSAGES,
  },
  2: {
    trustStage: 2 as TrustStage,
    memory: {
      ...BASE_MEMORY,
      officePattern: "Mon/Tue/Thu office, Wed/Fri home",
      commuteTime: "45 min each way",
      declinePatterns: "SW+XFN Weekly, Charcoal Supply/Demand",
    },
    messages: LEVEL_2_MESSAGES,
  },
  3: {
    trustStage: 3 as TrustStage,
    memory: {
      ...BASE_MEMORY,
      officePattern: "Mon/Tue/Thu office, Wed/Fri home",
      commuteTime: "45 min each way",
      declinePatterns: "SW+XFN Weekly, Charcoal Supply/Demand",
      focusPattern: "Wed 9-11am (4/4 weeks), Fri 9-11am (3/4 weeks)",
      energyCurve: "Best deep work 9-11am home days. Post-commute 10:30am office days.",
    },
    messages: LEVEL_3_MESSAGES,
  },
  4: {
    trustStage: 4 as TrustStage,
    memory: {
      ...BASE_MEMORY,
      officePattern: "Mon/Tue/Thu office, Wed/Fri home",
      commuteTime: "45 min each way",
      declinePatterns: "SW+XFN Weekly, Charcoal Supply/Demand, Software Design Weekly",
      focusPattern: "Wed 9-11am (4/4 weeks), Fri 9-11am (3/4 weeks)",
      energyCurve: "Best deep work 9-11am home days. Post-commute 10:30am office days.",
      scheduleHealthScore: "62/100",
      soloParentingWeek: "Allegra in San Diego Mon-Wed",
    },
    messages: LEVEL_4_MESSAGES,
  },
  5: {
    trustStage: 5 as TrustStage,
    memory: {
      ...BASE_MEMORY,
      officePattern: "Mon/Tue/Thu office, Wed/Fri home",
      commuteTime: "45 min each way",
      declinePatterns: "SW+XFN Weekly, Charcoal Supply/Demand, Software Design Weekly",
      focusPattern: "Wed 9-11am (4/4 weeks), Fri 9-11am (3/4 weeks)",
      energyCurve: "Best deep work 9-11am home days. Post-commute 10:30am office days.",
      scheduleHealthScore: "68/100",
      soloParentingWeek: "Allegra in San Diego Mon-Wed",
      autoDeclineRules: "5+ declines in 8 weeks, No Recurring Wed, out-of-domain",
      anniversaryProtected: "Tuesday evening blocked, Azita meeting declined",
    },
    messages: LEVEL_5_MESSAGES,
  },
};
