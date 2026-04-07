import type { TrustStage } from "@/lib/agents/data";

export type DemoMode = "tour" | "interact" | "model";

export interface DemoDialogue {
  role: "user" | "agent";
  content: string;
}

export interface DemoStep {
  id: string;
  label: string;
  route: string;
  tab?: "discover" | "your-agents";
  trustStage?: TrustStage;

  /** Show the onboarding overlay instead of tour narration */
  onboarding?: boolean;
  /** Which onboarding slide to show (0-indexed) */
  onboardingSlide?: number;

  /** Tour-mode narration card */
  tour?: {
    title: string;
    body: string;
    position: "center" | "top-left" | "top-right" | "bottom-left" | "bottom-right";
    spotlight?: string;
    spotlightPadding?: number;
  };

  /** Model-mode context (shown in x-ray) */
  model?: {
    contextTokens: number;
    capabilitiesUnlocked: number;
    capabilitiesTotal: number;
    agentsContributing: number;
    details: string;
  };

  /** Dialogue to simulate with typing animation */
  dialogue?: DemoDialogue[];

  /** When true, append dialogue to existing chat instead of clearing */
  continueDialogue?: boolean;
}

export const DEMO_STEPS: DemoStep[] = [
  // ── Step 0: Claude Home Screen ──────────────────────────────────────
  {
    id: "home",
    label: "Claude Home",
    route: "/home",
    tour: {
      title: "Welcome to the Demo",
      body: "Use the Demo Navigator to step through this experience.\n\n↑ ↓ arrows move between steps\n← → arrows switch between Tour, Interact, and Model modes\n\nTour mode walks you through the story. Interact mode lets you explore freely. Model mode shows what's happening under the hood.\n\nYou can also drag this card and the navigator anywhere on screen.",
      position: "top-right",
    },
  },

  // ── Step 1: Introducing Agents ───────────────────────────────────────
  {
    id: "intro-agents",
    label: "Introducing Agents",
    route: "/home",
    tour: {
      title: "Introducing Claude Agents",
      body: "Agents are a new feature in Claude — specialized AI assistants that learn your preferences, understand your context, and earn your trust over time.\n\nLet's click into the Agents tab to see how it works.",
      position: "top-right",
      spotlight: "[data-tour='agents-nav']",
      spotlightPadding: 8,
    },
  },

  // ── Step 2: Onboarding — Meet Agents ────────────────────────────────
  {
    id: "onboarding-agents",
    label: "Meet Agents",
    route: "/",
    tab: "discover",
    onboarding: true,
    onboardingSlide: 0,
    tour: {
      title: "The Onboarding Experience",
      body: "First-time visitors see this walkthrough introducing agents, the trust model, and shared memory. Step through it with ↓ or click Next.",
      position: "bottom-left",
    },
  },

  // ── Step 3: Onboarding — Trust Model ────────────────────────────────
  {
    id: "onboarding-trust",
    label: "Trust Model",
    route: "/",
    tab: "discover",
    onboarding: true,
    onboardingSlide: 1,
  },

  // ── Step 4: Onboarding — Shared Memory ──────────────────────────────
  {
    id: "onboarding-memory",
    label: "Shared Memory",
    route: "/",
    tab: "discover",
    onboarding: true,
    onboardingSlide: 2,
  },

  // ── Step 5: Discover Tab ─────────────────────────────────────────────
  {
    id: "discover",
    label: "Discover Agents",
    route: "/",
    tab: "discover",
    tour: {
      title: "Your Agent Marketplace",
      body: "Browse agents across every area of your life — from calendaring to finances to fitness. Each one follows the same trust model. Add the ones that matter to you.",
      position: "top-right",
      spotlight: "[data-tour='agent-grid']",
      spotlightPadding: 16,
    },
  },

  // ── Step 6: Your Agents Tab ──────────────────────────────────────────
  {
    id: "your-agents",
    label: "Your Agents",
    route: "/",
    tab: "your-agents",
    tour: {
      title: "Your Agent Team",
      body: "These are the agents you've added. Each is at a different stage of trust — from brand new to fully integrated. The more you interact, the more capable they become.",
      position: "top-right",
    },
  },

  // ── Step 7: Enter Calendaring Agent ──────────────────────────────────
  {
    id: "enter-calendaring",
    label: "Calendar Agent",
    route: "/agents/calendaring",
    trustStage: 0 as TrustStage,
    tour: {
      title: "The Calendar Agent",
      body: "Right now it's at Stage 0 — brand new, no calendar connected yet. The agent needs to learn about you before it can help. On the left is your chat. Once it earns access, your calendar will appear on the right.",
      position: "top-right",
    },
    model: {
      contextTokens: 12000,
      capabilitiesUnlocked: 2,
      capabilitiesTotal: 24,
      agentsContributing: 0,
      details: "Read-only access. Can view calendar data but cannot create, modify, or delete events.",
    },
  },

  // ── Step 8: Agent introduces itself ─────────────────────────────────
  {
    id: "agent-intro",
    label: "Agent Introduction",
    route: "/agents/calendaring",
    trustStage: 0 as TrustStage,
    tour: {
      title: "The agent starts by learning",
      body: "It introduces itself and explains what it can see. These first interactions establish the relationship.",
      position: "top-right",
    },
    dialogue: [
      {
        role: "agent",
        content: "Hi! I'm your Calendar agent. I'd love to help manage your schedule — but first, I need to connect to your calendars and learn how you like to work.\n\nCan I connect to your Google Calendar?",
      },
    ],
  },

  // ── Step 9: User connects calendar ──────────────────────────────────
  {
    id: "user-connects-calendar",
    label: "Connecting Calendar",
    route: "/agents/calendaring",
    trustStage: 0 as TrustStage,
    continueDialogue: true,
    tour: {
      title: "Granting access",
      body: "The user grants calendar access. This is the first act of trust — sharing personal data with the agent.",
      position: "top-right",
    },
    dialogue: [
      {
        role: "user",
        content: "Yes, connect my Google Calendar.",
      },
    ],
  },

  // ── Step 10: Agent sees calendars and asks boundaries ───────────────
  {
    id: "agent-asks-boundaries",
    label: "Asking Boundaries",
    route: "/agents/calendaring",
    trustStage: 0 as TrustStage,
    continueDialogue: true,
    tour: {
      title: "Understanding your constraints",
      body: "Now connected, the agent sees 7 calendar sources. It immediately asks about hard boundaries — the foundation of its decision-making.",
      position: "top-right",
    },
    dialogue: [
      {
        role: "agent",
        content: "Connected! I can see **7 calendars** across your account — work, personal, family, and more.\n\nBefore I dive in, what times of day are absolutely off-limits for work? These become hard boundaries I'll always respect.",
      },
    ],
  },

  // ── Step 10: User shares boundaries ─────────────────────────────────
  {
    id: "user-shares-boundaries",
    label: "Sharing Boundaries",
    route: "/agents/calendaring",
    trustStage: 0 as TrustStage,
    continueDialogue: true,
    tour: {
      title: "Your answers shape behavior",
      body: "Every response teaches the agent about your priorities. These preferences are stored as memories and shared across your agent team.",
      position: "top-right",
    },
    dialogue: [
      {
        role: "user",
        content: "Evenings from 5-7:30pm are sacred — that's dad time with my kids. And Wednesday mornings are my deep focus block, no meetings ever.",
      },
    ],
  },

  // ── Step 11: Agent confirms boundaries ──────────────────────────────
  {
    id: "agent-confirms-boundaries",
    label: "Boundaries Set",
    route: "/agents/calendaring",
    trustStage: 0 as TrustStage,
    continueDialogue: true,
    tour: {
      title: "Boundaries become constraints",
      body: "The agent confirms what it learned and saves it to shared memory. Other agents on your team will respect these boundaries too.",
      position: "top-right",
    },
    dialogue: [
      {
        role: "agent",
        content: "Got it. I've set two hard boundaries:\n\n• **5:00–7:30pm daily**: Protected family time (Dad mode)\n• **Wednesday mornings**: Deep focus block, no meetings\n\nThese are now absolute — I'll never suggest scheduling over them, and I'll flag any conflicts immediately. I've also shared these with your other agents so they respect them too.",
      },
    ],
  },

  // ── Step 12: Trust Stage 1 ──────────────────────────────────────────
  {
    id: "trust-stage-1",
    label: "Stage 1: Observer",
    route: "/agents/calendaring",
    trustStage: 1 as TrustStage,
    tour: {
      title: "Stage 1: Informed Observer",
      body: "The agent now understands your basics. It can read all 7 calendars, answer questions, and detect conflicts — but still can't change anything.",
      position: "top-right",
    },
    model: {
      contextTokens: 30000,
      capabilitiesUnlocked: 5,
      capabilitiesTotal: 24,
      agentsContributing: 1,
      details: "Calendar read access across 7 sources. Can identify conflicts, summarize daily schedule, answer questions about availability.",
    },
    dialogue: [
      {
        role: "agent",
        content: "I've reviewed your calendar for this week. Quick summary:\n\n• **18 meetings** across work and personal\n• **2 conflicts** I've spotted (both on Tuesday)\n• Your busiest day is Tuesday with back-to-back meetings from 9am-4pm\n\nWant me to walk through the conflicts?",
      },
    ],
  },

  // ── Step 13: Trust Stage 2 — User asks ──────────────────────────────
  {
    id: "trust-stage-2-ask",
    label: "Stage 2: Advisor",
    route: "/agents/calendaring",
    trustStage: 2 as TrustStage,
    tour: {
      title: "Stage 2: Personal Advisor",
      body: "After a week of observation, the agent recognizes your patterns. It sees that Wednesday mornings are your most productive time and that you prefer meetings clustered, not scattered.",
      position: "top-right",
    },
    model: {
      contextTokens: 50000,
      capabilitiesUnlocked: 9,
      capabilitiesTotal: 24,
      agentsContributing: 3,
      details: "Pattern recognition active. Shared memory from Friend Keeper and Spending Tracker contributing context. Can suggest schedule optimizations.",
    },
    dialogue: [
      {
        role: "user",
        content: "How's my week looking?",
      },
    ],
  },

  // ── Step 14: Trust Stage 2 — Agent responds with patterns ───────────
  {
    id: "trust-stage-2-response",
    label: "Pattern Recognition",
    route: "/agents/calendaring",
    trustStage: 2 as TrustStage,
    continueDialogue: true,
    tour: {
      title: "Pattern recognition in action",
      body: "The agent doesn't just list events — it identifies energy patterns, flags risks, and offers to optimize. This is learned behavior, not scripted.",
      position: "top-right",
    },
    dialogue: [
      {
        role: "agent",
        content: "Your week is manageable but has one risk:\n\n**Monday-Wednesday**: Well-structured. Your deep focus block Wednesday is clean.\n**Thursday**: You have a 2-hour gap between meetings — perfect for the design review prep you keep pushing.\n**Friday**: Light, but your 1:1 with Lena is at 3pm which cuts into your natural wind-down.\n\nI've noticed you're most productive in 90+ minute blocks. Want me to start flagging when your schedule fragments below that?",
      },
    ],
  },

  // ── Step 15: Trust Stage 3 ──────────────────────────────────────────
  {
    id: "trust-stage-3",
    label: "Stage 3: Analyst",
    route: "/agents/calendaring",
    trustStage: 3 as TrustStage,
    tour: {
      title: "Stage 3: Active Analyst",
      body: "The agent now synthesizes across all your calendars to give you a schedule health score. It's seeing patterns you might miss.",
      position: "top-right",
    },
    model: {
      contextTokens: 74000,
      capabilitiesUnlocked: 14,
      capabilitiesTotal: 24,
      agentsContributing: 5,
      details: "Cross-calendar analysis. Sleep Coach, Fitness Coach, Friend Keeper, Spending Tracker all contributing. Can draft event modifications for approval.",
    },
    dialogue: [
      {
        role: "agent",
        content: "Schedule health: **62/100** (down from 71 last week).\n\nBreakdown:\n• **Meeting load** is normal (18 hrs, your average)\n• **Personal time** is compressed — you're solo parenting Mon-Wed with Sarah traveling, which means zero buffer\n• **Focus blocks** — none longer than 90 min this week\n\nBiggest risk: Tuesday is your anniversary and your densest meeting day. If anything runs long, your evening is gone.",
      },
    ],
  },

  // ── Step 16: Trust Stage 4 — Conflict detected ─────────────────────
  {
    id: "trust-stage-4-conflict",
    label: "Stage 4: Conflict",
    route: "/agents/calendaring",
    trustStage: 4 as TrustStage,
    tour: {
      title: "Stage 4: The Anniversary Conflict",
      body: "A meeting request lands for 6:30pm on your anniversary. The agent knows Sarah is Tier 1, the requestor is Tier 4. It recommends declining and proposes an alternative — all without you asking.",
      position: "top-right",
    },
    model: {
      contextTokens: 101000,
      capabilitiesUnlocked: 19,
      capabilitiesTotal: 24,
      agentsContributing: 6,
      details: "Autonomous action within boundaries. Relationship tier data, confidence 97%. Can decline meetings, propose alternatives, block time — all based on learned preferences.",
    },
    dialogue: [
      {
        role: "agent",
        content: "You just got a meeting request for Tuesday 6:30–7:30pm: 'Product Strategy Review' from Azita, marked urgent.\n\nI'd push back. Here's why:\n\n1. Tuesday is your anniversary (Chen Fam calendar)\n2. Dad mode starts at 5pm — you're solo parenting this week\n3. Even if you could attend, you'd miss bath time and dinner\n\nI can suggest Thursday 11am instead — you have a gap between Lena's 1:1 and your afternoon meetings, and Azita is free then too.\n\nWant me to propose the reschedule?",
      },
    ],
  },

  // ── Step 17: Trust Stage 4 — User approves ─────────────────────────
  {
    id: "trust-stage-4-approve",
    label: "User Approves",
    route: "/agents/calendaring",
    trustStage: 4 as TrustStage,
    continueDialogue: true,
    tour: {
      title: "Trust enables action",
      body: "The user approves with a single sentence. At Stage 4, the agent has earned enough trust to act on this kind of request.",
      position: "top-right",
    },
    dialogue: [
      {
        role: "user",
        content: "Yes, go ahead and reschedule it.",
      },
    ],
  },

  // ── Step 18: Trust Stage 4 — Agent acts ────────────────────────────
  {
    id: "trust-stage-4-action",
    label: "Autonomous Action",
    route: "/agents/calendaring",
    trustStage: 4 as TrustStage,
    continueDialogue: true,
    tour: {
      title: "Autonomous action, earned",
      body: "It declined the meeting, suggested an alternative, and blocked your evening — all with a professional message that doesn't reveal personal details. This is what progressive trust enables.",
      position: "top-right",
    },
    dialogue: [
      {
        role: "agent",
        content: "Done. I declined the meeting and sent this to Azita:\n\n> \"Alex has a personal commitment Tuesday evening that he can't move. He's available Thursday 11am–12pm if that works for the team, or he can review materials async Wednesday and send comments by EOD.\"\n\nI also blocked 5:30–9:00pm on your work calendar as \"Personal — Anniversary\" so nothing else lands there.\n\nHappy anniversary, by the way. 🎉",
      },
    ],
  },

  // ── Step 19: Trust Stage 5 — Burnout signals ───────────────────────
  {
    id: "trust-stage-5-signals",
    label: "Stage 5: Burnout",
    route: "/agents/calendaring",
    trustStage: 5 as TrustStage,
    tour: {
      title: "Stage 5: Burnout Detection",
      body: "The agent correlates 5 signals across 4 data sources. None alarming alone — together, they tell a story. This is cross-domain reasoning over your entire life context.",
      position: "top-right",
    },
    model: {
      contextTokens: 132800,
      capabilitiesUnlocked: 24,
      capabilitiesTotal: 24,
      agentsContributing: 7,
      details: "Full context window: 7 calendar sources, user preferences, shared memory from 7 agents, conversation history. Progressive trust flywheel: more trust → more data → better reasoning → more trust.",
    },
    dialogue: [
      {
        role: "agent",
        content: "I'm seeing some patterns I want to flag. Over the last 3 weeks:\n\n1. **Copper walks dropped from 5/week to 3/week.** You used to alternate with Sarah, but you've been skipping yours on office days.\n2. **Focus blocks are getting overwritten.** 4 weeks ago you had 8 hrs/week of protected DNS time. Last week: 3 hrs.\n3. **Dad mode is creeping.** Twice last week you had work messages after 7:30pm.\n4. **Social calendar is empty.** No dinners with friends, no date night, no Havdalah attendance in 2 weeks.\n5. **Meeting decline rate spiked.** You declined 8 meetings last week (vs. average of 4).\n\nNone of these alone is alarming. Together, they suggest you're running hot.\n\nWant me to protect Friday as a reset day?",
      },
    ],
  },

  // ── Step 20: Trust Stage 5 — User agrees ───────────────────────────
  {
    id: "trust-stage-5-agree",
    label: "User Agrees",
    route: "/agents/calendaring",
    trustStage: 5 as TrustStage,
    continueDialogue: true,
    tour: {
      title: "Trusting the recommendation",
      body: "A single sentence delegates a complex action. The agent has proven it understands what matters.",
      position: "top-right",
    },
    dialogue: [
      {
        role: "user",
        content: "Yeah, lock Friday down. No meetings, block the whole day.",
      },
    ],
  },

  // ── Step 21: Trust Stage 5 — Full delegation ───────────────────────
  {
    id: "trust-stage-5-action",
    label: "Full Delegation",
    route: "/agents/calendaring",
    trustStage: 5 as TrustStage,
    continueDialogue: true,
    tour: {
      title: "Full delegation in action",
      body: "The agent coordinates across calendars, declines meetings, reschedules a 1:1, and even notifies another agent. This is the progressive trust flywheel at full speed.",
      position: "top-right",
    },
    dialogue: [
      {
        role: "agent",
        content: "Friday is locked. I've:\n\n• Blocked 9am–5pm as \"Reset Day — No Meetings\"\n• Auto-declined 3 pending meeting requests for Friday\n• Moved your 1:1 with Lena to Thursday 4pm (she confirmed)\n• Added a morning reminder: \"Walk Copper, then deep work\"\n\nI also let your Fitness Coach agent know — it's suggesting a longer run Friday morning since your schedule is clear.",
      },
    ],
  },

  // ── Step 22: Memory ─────────────────────────────────────────────────
  {
    id: "memory",
    label: "Shared Memory",
    route: "/memory",
    tour: {
      title: "Shared Memory",
      body: "Everything your agents learn is stored here — preferences, patterns, relationships, routines. This is the shared context that makes agent collaboration possible.",
      position: "top-right",
    },
  },

  // ── Step 23: End ────────────────────────────────────────────────────
  {
    id: "end",
    label: "Summary",
    route: "/",
    tab: "discover",
    tour: {
      title: "Claude Agents",
      body: "AI that earns your trust over time.\n\nProgressive trust isn't just a safety concept — it's a product mechanic that makes AI better. More context, more capability, more value over time.\n\nBuilt as a prototype by Alex Chen.",
      position: "center",
    },
  },
];
