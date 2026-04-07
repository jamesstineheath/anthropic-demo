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
  // ═══════════════════════════════════════════════════════════════════════
  // PART 1: WELCOME
  // ═══════════════════════════════════════════════════════════════════════

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

  // ═══════════════════════════════════════════════════════════════════════
  // PART 2: MEMORY (v1)
  // ═══════════════════════════════════════════════════════════════════════

  // ── Step 1: Introducing Memory ──────────────────────────────────────
  {
    id: "intro-memory",
    label: "Introducing Memory",
    route: "/home",
    tour: {
      title: "Introducing Universal Memory",
      body: "Memory is a new feature in Claude that lets it learn and remember things about you across conversations. Instead of starting from scratch every time, Claude builds a persistent understanding of your preferences, relationships, and life context.\n\nLet's explore what this looks like.",
      position: "top-right",
      spotlight: "[data-tour='memory-nav']",
      spotlightPadding: 8,
    },
  },

  // ── Step 2: Memory Chat ────────────────────────────────────────────
  {
    id: "memory-chat",
    label: "Memory Chat",
    route: "/memory",
    tour: {
      title: "Talk to Your Memory",
      body: "This is the Memory interface. On the left is a conversational view — you can ask Claude what it knows about you, explore what it's learned, and correct anything that's wrong.\n\nThink of it as a conversation with your own context layer.",
      position: "top-right",
    },
  },

  // ── Step 3: Memory — Ask about schedule ────────────────────────────
  {
    id: "memory-ask-schedule",
    label: "Exploring Memories",
    route: "/memory",
    tour: {
      title: "Querying Your Knowledge",
      body: "You can ask natural questions like \"What do you know about my schedule?\" and Claude will draw from everything it's learned — both things you've said directly and patterns it's observed over time.",
      position: "top-right",
    },
    dialogue: [
      {
        role: "user",
        content: "What do you know about my schedule preferences?",
      },
    ],
  },

  // ── Step 4: Memory — Schedule response ──────────────────────────────
  {
    id: "memory-schedule-response",
    label: "Learned Preferences",
    route: "/memory",
    continueDialogue: true,
    tour: {
      title: "Learned, Not Programmed",
      body: "Claude didn't have a template for this. It assembled this understanding from onboarding questions, calendar patterns, and your corrections over time. Notice it cites where each piece of knowledge came from.",
      position: "top-right",
    },
    dialogue: [
      {
        role: "agent",
        content: "Your schedule preferences are some of my highest-confidence memories. I know you protect Wednesday mornings for deep work, have a hard 5:00–7:00pm family boundary every day, and prefer 25-minute meetings over 30-minute defaults.\n\nYour Calendar agent learned these through a combination of what you told me during onboarding and patterns observed over 6 weeks of behavior. I also know your commute pattern affects what meeting times are realistic on different days.",
      },
    ],
  },

  // ── Step 5: Memory — Ask about cross-agent ─────────────────────────
  {
    id: "memory-ask-cross-agent",
    label: "Cross-Agent Memory",
    route: "/memory",
    tour: {
      title: "Memory Across Agents",
      body: "The real power of Memory is that it's shared. When one agent learns something about you, every other agent benefits. This is how Claude builds a coherent understanding of your whole life.",
      position: "top-right",
    },
    dialogue: [
      {
        role: "user",
        content: "How do my agents share information?",
      },
    ],
  },

  // ── Step 6: Memory — Cross-agent response ──────────────────────────
  {
    id: "memory-cross-agent-response",
    label: "Shared Context",
    route: "/memory",
    continueDialogue: true,
    tour: {
      title: "The Universal Memory Layer",
      body: "This is the key insight: memories become more valuable when they're shared. A scheduling preference learned by one agent becomes a constraint respected by all of them. This is how personalization compounds over time.",
      position: "top-right",
    },
    dialogue: [
      {
        role: "agent",
        content: "Agents share context through the universal memory layer you're looking at right now. When your Calendar agent learns that you work from home on Fridays, your Date Night Planner can use that to suggest Friday evenings.\n\nWhen your Friend Keeper notices you haven't seen your college group in months, it can check your Calendar data for realistic windows to reconnect. Right now, 5 of your 13 memories involve cross-agent reasoning — marked with a ✨ sparkle icon.",
      },
    ],
  },

  // ── Step 7: Memory — Confidence and correction ─────────────────────
  {
    id: "memory-confidence",
    label: "Confidence Levels",
    route: "/memory",
    tour: {
      title: "Confidence & Correction",
      body: "Not all memories are equal. Claude tracks confidence levels for each one — high for things you've stated directly, lower for inferences. You can correct any memory, and your feedback recalibrates the model. Click \"Explore Memory\" to browse the knowledge base.",
      position: "top-right",
    },
    dialogue: [
      {
        role: "user",
        content: "What are you least confident about?",
      },
    ],
  },

  // ── Step 8: Memory — Confidence response ───────────────────────────
  {
    id: "memory-confidence-response",
    label: "Transparent Uncertainty",
    route: "/memory",
    continueDialogue: true,
    tour: {
      title: "Transparent About Uncertainty",
      body: "Claude is honest about what it doesn't know well. This transparency builds trust — you know exactly where it might be wrong, and your corrections make it better. This is a core design principle: AI should be auditable.",
      position: "top-right",
    },
    dialogue: [
      {
        role: "agent",
        content: "My lowest-confidence memories are based on inference rather than direct statements:\n\n• **School research** (65%) — inferred from a passing mention during scheduling\n• **College friend reconnection** (72%) — inferred from calendar absence, not anything you told me\n• **Nanny expense sensitivity** (70%) — from a single conversational reference\n\nThese are exactly where your feedback matters most. A thumbs-up or thumbs-down helps me calibrate.",
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // PART 3: AGENTS (v2)
  // ═══════════════════════════════════════════════════════════════════════

  // ── Step 9: Transition to Agents ───────────────────────────────────
  {
    id: "intro-agents",
    label: "Introducing Agents",
    route: "/home",
    tour: {
      title: "From Memory to Agents",
      body: "Memory gives Claude persistent context. Agents give it the ability to act on that context.\n\nAgents are specialized AI assistants that learn your preferences, understand your world, and earn your trust over time. Each one follows the same progressive trust model.\n\nLet's see how it works.",
      position: "top-right",
      spotlight: "[data-tour='agents-nav']",
      spotlightPadding: 8,
    },
  },

  // ── Step 10: Onboarding — Meet Agents ──────────────────────────────
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

  // ── Step 11: Onboarding — Trust Model ──────────────────────────────
  {
    id: "onboarding-trust",
    label: "Trust Model",
    route: "/",
    tab: "discover",
    onboarding: true,
    onboardingSlide: 1,
  },

  // ── Step 12: Onboarding — Shared Memory ────────────────────────────
  {
    id: "onboarding-memory",
    label: "Shared Memory",
    route: "/",
    tab: "discover",
    onboarding: true,
    onboardingSlide: 2,
  },

  // ── Step 13: Discover Tab ──────────────────────────────────────────
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

  // ── Step 14: Your Agents Tab ───────────────────────────────────────
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

  // ── Step 15: Enter Calendar Agent ──────────────────────────────────
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

  // ── Step 16: Agent introduces itself ───────────────────────────────
  {
    id: "agent-intro",
    label: "Agent Introduction",
    route: "/agents/calendaring",
    trustStage: 0 as TrustStage,
    tour: {
      title: "The agent starts by learning",
      body: "It introduces itself and explains what it needs. These first interactions establish the relationship.",
      position: "top-right",
    },
    dialogue: [
      {
        role: "agent",
        content: "Hi! I'm your Calendar agent. I'd love to help manage your schedule — but first, I need to connect to your calendars and learn how you like to work.\n\nCan I connect to your Google Calendar?",
      },
    ],
  },

  // ── Step 17: User connects calendar ────────────────────────────────
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

  // ── Step 18: Agent asks boundaries ─────────────────────────────────
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

  // ── Step 19: User shares boundaries ────────────────────────────────
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
        content: "Evenings from 5–7pm are sacred — that's family time. And Wednesday mornings are my deep focus block, no meetings ever.",
      },
    ],
  },

  // ── Step 20: Agent confirms boundaries ─────────────────────────────
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
        content: "Got it. I've set two hard boundaries:\n\n• **5:00–7:00pm daily**: Protected family time\n• **Wednesday mornings**: Deep focus block, no meetings\n\nThese are now absolute — I'll never suggest scheduling over them, and I'll flag any conflicts immediately. I've also shared these with your other agents so they respect them too.",
      },
    ],
  },

  // ── Step 21: Trust Stage 1 ─────────────────────────────────────────
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
        content: "I've reviewed your calendar for this week. Quick summary:\n\n• **18 meetings** across work and personal\n• **2 conflicts** I've spotted (both on Tuesday)\n• Your busiest day is Thursday with back-to-back meetings from 9am–4pm\n\nWant me to walk through the conflicts?",
      },
    ],
  },

  // ── Step 22: Trust Stage 2 — User asks ─────────────────────────────
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

  // ── Step 23: Trust Stage 2 — Agent responds ────────────────────────
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
        content: "Your week is manageable but has one risk:\n\n**Monday–Wednesday**: Well-structured. Your deep focus block Wednesday is clean.\n**Thursday**: You have a 2-hour gap between meetings — perfect for the design review prep you keep pushing.\n**Friday**: Light, but your 1:1 with Lena is at 3pm which cuts into your natural wind-down.\n\nI've noticed you're most productive in 90+ minute blocks. Want me to start flagging when your schedule fragments below that?",
      },
    ],
  },

  // ── Step 24: Trust Stage 3 ─────────────────────────────────────────
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
        content: "Schedule health: **62/100** (down from 71 last week).\n\nBreakdown:\n• **Meeting load** is normal (18 hrs, your average)\n• **Personal time** is compressed — you're solo parenting Mon–Wed with Sarah traveling, which means zero buffer\n• **Focus blocks** — none longer than 90 min this week\n\nBiggest risk: Tuesday is your anniversary and your densest meeting day. If anything runs long, your evening is gone.",
      },
    ],
  },

  // ── Step 25: Trust Stage 4 — Conflict ──────────────────────────────
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
        content: "You just got a meeting request for Tuesday 6:30–7:30pm: 'Product Strategy Review' from Azita, marked urgent.\n\nI'd push back. Here's why:\n\n1. Tuesday is your anniversary (Chen Fam calendar)\n2. Family time starts at 5pm — you're solo parenting this week\n3. Even if you could attend, you'd miss bath time and dinner\n\nI can suggest Thursday 11am instead — you have a gap between your 1:1 and afternoon meetings, and Azita is free then too.\n\nWant me to propose the reschedule?",
      },
    ],
  },

  // ── Step 26: Trust Stage 4 — User approves ─────────────────────────
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

  // ── Step 27: Trust Stage 4 — Agent acts ────────────────────────────
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

  // ── Step 28: Trust Stage 5 — Burnout signals ──────────────────────
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
        content: "I'm seeing some patterns I want to flag. Over the last 3 weeks:\n\n1. **Copper walks dropped from 5/week to 3/week.** You used to alternate with Sarah, but you've been skipping yours on office days.\n2. **Focus blocks are getting overwritten.** 4 weeks ago you had 8 hrs/week of protected DNS time. Last week: 3 hrs.\n3. **Family time is creeping.** Twice last week you had work messages after 7pm.\n4. **Social calendar is empty.** No dinners with friends, no date night in 2 weeks.\n5. **Meeting decline rate spiked.** You declined 8 meetings last week (vs. average of 4).\n\nNone of these alone is alarming. Together, they suggest you're running hot.\n\nWant me to protect Friday as a reset day?",
      },
    ],
  },

  // ── Step 29: Trust Stage 5 — User agrees ──────────────────────────
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

  // ── Step 30: Trust Stage 5 — Full delegation ──────────────────────
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

  // ═══════════════════════════════════════════════════════════════════════
  // PART 4: CONCLUSION
  // ═══════════════════════════════════════════════════════════════════════

  // ── Step 31: Summary ───────────────────────────────────────────────
  {
    id: "end",
    label: "Summary",
    route: "/",
    tab: "discover",
    tour: {
      title: "Memory + Agents",
      body: "Memory gives Claude persistent understanding. Agents give it the ability to act.\n\nTogether, they create AI that earns your trust over time. Progressive trust isn't just a safety concept — it's a product mechanic that makes AI better. More context, more capability, more value.\n\nBuilt as a prototype by Alex Chen.",
      position: "center",
    },
  },
];
