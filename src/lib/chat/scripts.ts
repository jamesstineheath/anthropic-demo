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

// ---------------------------------------------------------------------------
// Stage 2: Personal Advisor — energy/focus patterns
// ---------------------------------------------------------------------------

export const STAGE_2_RESPONSES: Stage1Response[] = [
  {
    triggers: ["energy", "focus", "productive", "morning", "night", "tired", "best time"],
    content:
      "I've noticed a pattern in how you schedule focus time. On home days (Wed/Fri), you consistently block 9-11am or 1-3pm and actually keep them. On office days, your focus blocks get overwritten about 60% of the time.\n\nYour best uninterrupted work happens Wednesday mornings — you've protected that slot 4 out of the last 4 weeks.\n\nWant me to start declining non-essential meeting requests that land on Wednesday morning?",
    confidence: "high",
    confidenceReason:
      "Pattern observed across 4 weeks of calendar data (confidence: 78%)",
  },
  {
    triggers: ["schedule", "week", "this week", "what's on", "calendar", "busy"],
    content:
      "Your week has **{eventCount} events** across 7 calendars. Some things I'd flag based on what I've learned about your patterns:\n\n• **Tuesday** is your densest day — 6 meetings back-to-back from 10:30am. Given your commute, you won't settle in until ~10:15am.\n• **Wednesday** looks good — only AI @ Mill at 10am and your 1:1 with Annelise. Your morning focus block is protected.\n• **Friday** is light — just SW Demo at 10am. Good day for deep work.\n\nYour energy tends to dip after 3pm on office days. Thursday has O2 Sustaining Core at 3pm — that's right in your low-energy window.",
    confidence: "high",
    confidenceReason:
      "Calendar data + learned energy/commute patterns (2+ weeks observed)",
  },
  {
    triggers: ["commute", "office", "home", "remote", "location"],
    content:
      "Your office pattern: Mon/Tue/Thu at 950 Elm, Wed/Fri from home.\n\nCommute blocks average 45 minutes each way — you've marked them \"phone calls OK\" which is smart. I see you often take 1:1 calls during commute on Monday and Thursday.\n\nOne thing I'd flag: your Tuesday commute lands at 10:30am, but you have a meeting at 11:30am. That's tight if traffic is bad. Want me to suggest a buffer?",
    confidence: "medium",
    confidenceReason:
      "Commute data from calendar blocks + location patterns (3 weeks)",
  },
];

export const STAGE_2_FALLBACK: Stage1Response = {
  triggers: [],
  content:
    "At Stage 2, I'm starting to understand your energy patterns and preferences. Try asking about your focus time, energy levels, or how your home vs office days compare.\n\nI can also share what I've learned about your commute and meeting patterns.",
  confidence: "low",
  confidenceReason: "No matching pattern at Stage 2",
};

// ---------------------------------------------------------------------------
// Stage 3: Active Analyst — schedule health, rescheduling
// ---------------------------------------------------------------------------

export const STAGE_3_RESPONSES: Stage1Response[] = [
  {
    triggers: ["health", "score", "how am i", "balance", "overview", "status"],
    content:
      "Schedule health: **62/100** (down from 71 last week).\n\nBreakdown:\n• **Meeting load** is normal (18 hrs, your average)\n• **Personal time** is compressed — you're solo parenting Mon-Wed with Allegra traveling, which means zero buffer\n• **Focus blocks** — none longer than 90 min this week\n• **Dog walks** are happening (good sign), but you skipped your usual Friday afternoon downtime last week\n\nBiggest risk: Tuesday is your anniversary and your densest meeting day. If anything runs long, your evening is gone.",
    confidence: "medium",
    confidenceReason:
      "Cross-calendar synthesis: work (18 hrs meetings), Heath Fam (Allegra traveling), Maddie (normal hours), personal (dog walks 4/5)",
  },
  {
    triggers: ["conflict", "tuesday", "strategy", "product strategy", "reschedule", "move", "anniversary"],
    content:
      "You just got a meeting request for Tuesday 6:30-7:30pm: \"Product Strategy Review\" from Azita, marked urgent. I'd push back. Here's why:\n\n1. Tuesday is your anniversary (Heath Fam calendar)\n2. Dad mode starts at 5pm — you're solo parenting this week\n3. Even if you could attend, you'd miss bath time and dinner\n\nI can suggest Thursday 11am instead — you have a gap between Lena's 1:1 and your afternoon meetings, and Azita is free then too.\n\nWant me to propose the reschedule?",
    confidence: "high",
    confidenceReason:
      "Confidence 95%: Anniversary (Tier 1), Dad mode (hard constraint), solo parenting (Allegra traveling). Alternative slot verified across 2 calendars.",
  },
  {
    triggers: ["meeting", "meetings", "too many", "load", "hours"],
    content:
      "Meeting load analysis for this week:\n\n• **Total:** 18 hrs across 22 meetings\n• **Your sustainable range:** 18-22 hrs (you're at the low end — good)\n• **Distribution:** Mon 4hrs, Tue 5hrs, Wed 2hrs, Thu 4hrs, Fri 3hrs\n• **Back-to-back chains:** Tuesday has 3 meetings in a row (10:30am-1pm)\n\nCompared to your 4-week average, this is a typical week. But with Allegra traveling Mon-Wed, your personal load is higher than usual.\n\nI'm watching 3 meetings you've declined 5+ times — want me to start auto-declining those at Stage 4?",
    confidence: "high",
    confidenceReason:
      "Meeting data from 4 weeks of calendar history. Decline patterns tracked across 8 weeks.",
  },
];

export const STAGE_3_FALLBACK: Stage1Response = {
  triggers: [],
  content:
    "At Stage 3, I can analyze your schedule patterns in depth — try asking about your schedule health score, meeting load, or specific conflicts.\n\nI've also started tracking your meeting decline patterns and can suggest which recurring meetings to auto-decline.",
  confidence: "low",
  confidenceReason: "No matching pattern at Stage 3",
};

// ---------------------------------------------------------------------------
// Stage 4: Proactive Partner — focus protection, relationship-priority
// ---------------------------------------------------------------------------

export const STAGE_4_RESPONSES: Stage1Response[] = [
  {
    triggers: ["protect", "focus", "block", "decline", "wednesday", "friday"],
    content:
      "Based on 4 weeks of data, I'd like to propose protecting two time slots:\n\n**Wednesday 9-11am** — Your most productive focus window. You've kept it clear 4/4 weeks. I'll auto-decline non-essential meetings and suggest async alternatives.\n\n**Friday 9-11am** — Your second-best window. 3/4 weeks protected. Same policy.\n\nFor office days (Mon/Tue/Thu), I won't auto-protect yet — your schedule is more variable and I need more data on which meetings you actually value.\n\nShould I turn on protection for the Wednesday and Friday blocks?",
    confidence: "high",
    confidenceReason:
      "Permission checkpoint. Wednesday: 100% confidence (4/4 weeks). Friday: 75% (3/4 weeks). Threshold for auto-protect: 85%.",
  },
  {
    triggers: ["anniversary", "declined", "azita", "handled", "what did you do", "personal"],
    content:
      "I declined the Product Strategy Review on your behalf. Here's what I sent to Azita:\n\n> \"James has a personal commitment Tuesday evening that he can't move. He's available Thursday 11am-12pm if that works for the team, or he can review materials async Wednesday and send comments by EOD.\"\n\nI also blocked 5:30-9:00pm on your work calendar as \"Personal — Anniversary\" so nothing else lands there. Allegra's back Wednesday night, so Thursday onward your evenings are shared again.\n\nHappy anniversary, by the way.",
    confidence: "high",
    confidenceReason:
      "Autonomous action within approved rules. Relationship tier: Allegra = T1, Azita = T3. Decision: Partner > Work (unless emergency). Confidence: 97%.",
  },
  {
    triggers: ["schedule", "week", "this week", "what's on", "calendar"],
    content:
      "Your week at a glance — filtered through what I know about your priorities:\n\n**Protected:** Dad mode 5-7:30pm daily ✅, Wed morning focus ✅, Fri morning focus ✅\n**Flagged:** Tuesday is your anniversary — I've blocked the evening. Solo parenting Mon-Wed (Allegra in San Diego).\n**Auto-declined:** SW+XFN Weekly (Mon), Charcoal Supply/Demand (Tue) — per your decline patterns.\n**Action needed:** Product Strategy Review conflict on Tuesday evening — [resolved, declined with alternative].\n\nYour schedule health is trending up from 62 to 68 after the auto-declines.",
    confidence: "high",
    confidenceReason:
      "Full calendar synthesis + approved auto-decline rules + relationship tier framework active.",
  },
];

export const STAGE_4_FALLBACK: Stage1Response = {
  triggers: [],
  content:
    "At Stage 4, I'm actively protecting your time and resolving conflicts using relationship priorities. Try asking about focus time protection, what I've declined on your behalf, or how I'd handle a specific conflict.\n\nI can also walk through my decision framework for any action I've taken.",
  confidence: "low",
  confidenceReason: "No matching pattern at Stage 4",
};

// ---------------------------------------------------------------------------
// Stage 5: Trusted Delegate — auto-decline, burnout prediction
// ---------------------------------------------------------------------------

export const STAGE_5_RESPONSES: Stage1Response[] = [
  {
    triggers: ["auto", "decline", "declined", "meetings", "saved", "report"],
    content:
      "I auto-declined 3 meetings this week based on your rules:\n\n1. **SW+XFN Weekly** (Mon 10:30am) — You've declined this 6 of the last 8 weeks. Auto-decline, read notes async.\n2. **Charcoal Supply/Demand** (Tue 12pm) — Consistently declined. Not your domain.\n3. **Software Design Weekly** (Wed 1pm) — Conflicts with No Recurring Wednesday policy.\n\nNone were from Tier 1-2 stakeholders. Your meeting load dropped from 22 hrs to 18 hrs as a result.\n\nOverride any of these?",
    confidence: "high",
    confidenceReason:
      "Permission rules active. Hard constraints honored (never decline: Kristen, Lena, exec). Confidence 95%+ per decline. Weekly savings: 4 hrs.",
  },
  {
    triggers: ["burnout", "stressed", "exhausted", "overwhelmed", "patterns", "signals", "worried", "tired"],
    content:
      "I'm seeing some patterns I want to flag. Over the last 3 weeks:\n\n1. **Copper walks dropped from 5/week to 3/week.** You used to alternate with Allegra, but you've been skipping yours on office days.\n2. **Focus blocks are getting overwritten.** 4 weeks ago you had 8 hrs/week of protected DNS time. Last week: 3 hrs.\n3. **Dad mode is creeping.** Twice last week you had work messages after 7:30pm (your usual hard stop).\n4. **Social calendar is empty.** No dinners with friends, no date night, no Havdalah attendance in 2 weeks.\n5. **Meeting decline rate spiked.** You declined 8 meetings last week (vs. average of 4).\n\nNone of these alone is alarming. Together, they suggest you're running hot. This week should be better with Allegra back, but I'd recommend protecting Friday as a reset day.\n\nI can clear your afternoon if you want.",
    confidence: "medium",
    confidenceReason:
      "Cross-domain synthesis: 5 signals from 4 data sources (Work calendar, Heath Fam, Maddie, Personal). Context: ~132,800 tokens across 8 contributing agents. This is reasoning over heterogeneous personal context, not retrieval.",
  },
  {
    triggers: ["schedule", "week", "this week", "what's on", "calendar"],
    content:
      "Weekly delegate report:\n\n**Auto-actions taken:**\n• Declined 3 meetings (saved 4 hrs)\n• Protected Wed/Fri morning focus blocks\n• Blocked Tuesday evening for anniversary\n• Extended Maddie's hours Mon-Wed (Allegra traveling)\n\n**Schedule health:** 68/100 (↑6 from last week)\n**Meeting load:** 18 hrs (within target)\n**Focus time:** 7 hrs protected (↑4 from last week)\n**Burnout signals:** 2 of 5 active (Copper walks ↓, social calendar empty)\n\n**Recommendation:** Book a dinner with friends this weekend. Your social calendar has been empty for 2 weeks.",
    confidence: "high",
    confidenceReason:
      "Full autonomous report. 8 shared memory sources contributing. Cross-calendar coordination active.",
  },
];

export const STAGE_5_FALLBACK: Stage1Response = {
  triggers: [],
  content:
    "At Stage 5, I'm operating as your trusted delegate. I auto-decline meetings, protect your focus time, coordinate across all 7 calendars, and monitor for burnout signals.\n\nTry asking for my weekly report, what I've declined, or whether I'm seeing any concerning patterns.",
  confidence: "low",
  confidenceReason: "No matching pattern at Stage 5",
};
