export type AgentCategory =
  | "Daily Life"
  | "Health & Wellness"
  | "Money"
  | "Relationships"
  | "Life Events"
  | "Learning & Growth"
  | "Work"
  | "Creative";

export type TrustStage = 0 | 1 | 2 | 3 | 4 | 5;

export interface AgentPrerequisite {
  agentId: string;
  minTrustStage: TrustStage;
}

export interface Agent {
  id: string;
  name: string;
  category: AgentCategory;
  description: string;
  icon: string;
  trustStage: TrustStage;
  isDeepAgent: boolean;
  isMeta: boolean;
  prerequisites?: AgentPrerequisite[];
  comingSoon?: boolean;
}

export const TRUST_STAGE_LABELS: Record<TrustStage, string> = {
  0: "New",
  1: "Observer",
  2: "Personal Advisor",
  3: "Active Analyst",
  4: "Proactive Partner",
  5: "Trusted Delegate",
};

export const CATEGORIES: AgentCategory[] = [
  "Daily Life",
  "Health & Wellness",
  "Money",
  "Relationships",
  "Life Events",
  "Learning & Growth",
  "Work",
  "Creative",
];

export const AGENTS: Agent[] = [
  // ── Daily Life ──────────────────────────────────────────────
  {
    id: "calendaring",
    name: "Calendar",
    category: "Daily Life",
    description:
      "Manages your schedule intelligently, learning your priorities and preferences to protect your time.",
    icon: "Calendar",
    trustStage: 0,
    isDeepAgent: true,
    isMeta: false,
  },
  {
    id: "grocery-shopper",
    name: "Grocery Shopper",
    category: "Daily Life",
    description:
      "Builds smart grocery lists from your meals, dietary needs, and household inventory patterns.",
    icon: "ShoppingCart",
    trustStage: 0,
    isDeepAgent: false,
    isMeta: false,
  },
  {
    id: "meal-planner",
    name: "Meal Planner",
    category: "Daily Life",
    description:
      "Plans weekly meals around your tastes, nutrition goals, and what's already in your kitchen.",
    icon: "ChefHat",
    trustStage: 0,
    isDeepAgent: false,
    isMeta: false,
  },
  {
    id: "home-maintenance",
    name: "Home Maintenance",
    category: "Daily Life",
    description:
      "Tracks seasonal upkeep, warranty deadlines, and repair tasks so nothing falls through the cracks.",
    icon: "Wrench",
    trustStage: 0,
    isDeepAgent: false,
    isMeta: false,
  },
  {
    id: "errand-runner",
    name: "Errand Runner",
    category: "Daily Life",
    description:
      "Batches and routes your errands efficiently, syncing with your calendar for optimal timing.",
    icon: "MapPin",
    trustStage: 0,
    isDeepAgent: false,
    isMeta: false,
  },

  // ── Health & Wellness ───────────────────────────────────────
  {
    id: "fitness-coach",
    name: "Fitness Coach",
    category: "Health & Wellness",
    description:
      "Designs workouts that adapt to your progress, energy levels, and available equipment.",
    icon: "Dumbbell",
    trustStage: 0,
    isDeepAgent: false,
    isMeta: false,
  },
  {
    id: "sleep-coach",
    name: "Sleep Coach",
    category: "Health & Wellness",
    description:
      "Analyzes your sleep patterns and habits to build a personalized routine for better rest.",
    icon: "Moon",
    trustStage: 0,
    isDeepAgent: false,
    isMeta: false,
  },
  {
    id: "stress-recovery",
    name: "Stress & Recovery",
    category: "Health & Wellness",
    description:
      "Monitors your stress signals and suggests evidence-based recovery strategies throughout your day.",
    icon: "Heart",
    trustStage: 0,
    isDeepAgent: false,
    isMeta: false,
  },
  {
    id: "symptom-tracker",
    name: "Symptom Tracker",
    category: "Health & Wellness",
    description:
      "Logs symptoms over time, identifies patterns, and helps you communicate clearly with your doctor.",
    icon: "Stethoscope",
    trustStage: 0,
    isDeepAgent: false,
    isMeta: false,
  },
  {
    id: "patient-advocate",
    name: "Patient Advocate",
    category: "Health & Wellness",
    description:
      "Prepares you for medical appointments with organized history, questions, and insurance details.",
    icon: "ShieldCheck",
    trustStage: 0,
    isDeepAgent: false,
    isMeta: false,
  },
  {
    id: "nutrition-tracker",
    name: "Nutrition Tracker",
    category: "Health & Wellness",
    description:
      "Tracks what you eat and gently guides you toward your nutritional goals without judgment.",
    icon: "Apple",
    trustStage: 0,
    isDeepAgent: false,
    isMeta: false,
  },

  // ── Money ───────────────────────────────────────────────────
  {
    id: "spending-tracker",
    name: "Spending Tracker",
    category: "Money",
    description:
      "Categorizes your spending and surfaces insights about where your money actually goes.",
    icon: "Wallet",
    trustStage: 0,
    isDeepAgent: false,
    isMeta: false,
  },
  {
    id: "bill-manager",
    name: "Bill Manager",
    category: "Money",
    description:
      "Tracks due dates, flags unusual charges, and ensures you never miss a payment.",
    icon: "Receipt",
    trustStage: 0,
    isDeepAgent: false,
    isMeta: false,
  },
  {
    id: "savings-coach",
    name: "Savings Coach",
    category: "Money",
    description:
      "Sets achievable savings milestones and finds painless ways to set money aside consistently.",
    icon: "PiggyBank",
    trustStage: 0,
    isDeepAgent: false,
    isMeta: false,
  },
  {
    id: "investment-learner",
    name: "Investment Learner",
    category: "Money",
    description:
      "Explains investment concepts at your level and helps you think through financial decisions.",
    icon: "TrendingUp",
    trustStage: 0,
    isDeepAgent: false,
    isMeta: false,
  },

  // ── Relationships ───────────────────────────────────────────
  {
    id: "friend-keeper",
    name: "Friend Keeper",
    category: "Relationships",
    description:
      "Remembers important details about your friends and nudges you to stay in touch meaningfully.",
    icon: "Users",
    trustStage: 0,
    isDeepAgent: false,
    isMeta: false,
  },
  {
    id: "date-night-planner",
    name: "Date Night Planner",
    category: "Relationships",
    description:
      "Curates date ideas based on your shared interests, budget, and what you haven't tried yet.",
    icon: "Wine",
    trustStage: 0,
    isDeepAgent: false,
    isMeta: false,
  },
  {
    id: "gift-finder",
    name: "Gift Finder",
    category: "Relationships",
    description:
      "Suggests thoughtful gifts by remembering people's interests, wishlists, and past presents.",
    icon: "Gift",
    trustStage: 0,
    isDeepAgent: false,
    isMeta: false,
  },
  {
    id: "family-check-in",
    name: "Family Check-in",
    category: "Relationships",
    description:
      "Helps you maintain regular family connections with reminders, conversation starters, and coordination.",
    icon: "Phone",
    trustStage: 0,
    isDeepAgent: false,
    isMeta: false,
  },

  // ── Life Events ─────────────────────────────────────────────
  {
    id: "wedding-planner",
    name: "Wedding Planner",
    category: "Life Events",
    description:
      "Organizes timelines, vendor contacts, and budgets to keep your wedding planning on track.",
    icon: "PartyPopper",
    trustStage: 0,
    isDeepAgent: false,
    isMeta: false,
  },
  {
    id: "new-parent-guide",
    name: "New Parent Guide",
    category: "Life Events",
    description:
      "Provides stage-appropriate guidance, tracks milestones, and answers questions as your baby grows.",
    icon: "Baby",
    trustStage: 0,
    isDeepAgent: false,
    isMeta: false,
  },
  {
    id: "moving-coach",
    name: "Moving Coach",
    category: "Life Events",
    description:
      "Manages your moving checklist, coordinates logistics, and keeps the transition stress-free.",
    icon: "Truck",
    trustStage: 0,
    isDeepAgent: false,
    isMeta: false,
  },
  {
    id: "pet-parent",
    name: "Pet Parent",
    category: "Life Events",
    description:
      "Tracks vet visits, feeding schedules, and health records for your furry family members.",
    icon: "PawPrint",
    trustStage: 0,
    isDeepAgent: false,
    isMeta: false,
  },
  {
    id: "travel-planner",
    name: "Travel Planner",
    category: "Life Events",
    description:
      "Plans trips around your preferences, handles logistics, and builds flexible itineraries you'll love.",
    icon: "Plane",
    trustStage: 0,
    isDeepAgent: false,
    isMeta: false,
  },

  // ── Learning & Growth ───────────────────────────────────────
  {
    id: "study-partner",
    name: "Study Partner",
    category: "Learning & Growth",
    description:
      "Adapts to your learning style with practice questions, explanations, and spaced repetition.",
    icon: "BookOpen",
    trustStage: 0,
    isDeepAgent: false,
    isMeta: false,
  },
  {
    id: "book-coach",
    name: "Book Coach",
    category: "Learning & Growth",
    description:
      "Recommends reads based on your interests, tracks your list, and sparks discussion on what you've read.",
    icon: "Library",
    trustStage: 0,
    isDeepAgent: false,
    isMeta: false,
  },
  {
    id: "career-advisor",
    name: "Career Advisor",
    category: "Learning & Growth",
    description:
      "Helps you navigate career decisions with structured thinking about goals, skills, and opportunities.",
    icon: "Briefcase",
    trustStage: 0,
    isDeepAgent: false,
    isMeta: false,
  },
  {
    id: "language-tutor",
    name: "Language Tutor",
    category: "Learning & Growth",
    description:
      "Teaches through conversation, adapting difficulty and topics to your proficiency and interests.",
    icon: "Languages",
    trustStage: 0,
    isDeepAgent: false,
    isMeta: false,
  },

  // ── Work ────────────────────────────────────────────────────
  {
    id: "meeting-prep",
    name: "Meeting Prep",
    category: "Work",
    description:
      "Briefs you before meetings with agendas, attendee context, and suggested talking points.",
    icon: "Presentation",
    trustStage: 0,
    isDeepAgent: false,
    isMeta: false,
  },
  {
    id: "email-drafter",
    name: "Email Drafter",
    category: "Work",
    description:
      "Drafts emails in your voice, matching tone and formality to each recipient and context.",
    icon: "Mail",
    trustStage: 0,
    isDeepAgent: false,
    isMeta: false,
  },
  {
    id: "focus-guard",
    name: "Focus Guard",
    category: "Work",
    description:
      "Protects your deep work time by managing interruptions and batching notifications intelligently.",
    icon: "Timer",
    trustStage: 0,
    isDeepAgent: false,
    isMeta: false,
  },
  {
    id: "project-tracker",
    name: "Project Tracker",
    category: "Work",
    description:
      "Keeps your projects organized with status updates, deadline tracking, and blocker identification.",
    icon: "KanbanSquare",
    trustStage: 0,
    isDeepAgent: false,
    isMeta: false,
  },

  // ── Creative ────────────────────────────────────────────────
  {
    id: "writing-partner",
    name: "Writing Partner",
    category: "Creative",
    description:
      "Collaborates on your writing with feedback, brainstorming, and editing that respects your voice.",
    icon: "Pen",
    trustStage: 0,
    isDeepAgent: false,
    isMeta: false,
  },
  {
    id: "side-project-coach",
    name: "Side Project Coach",
    category: "Creative",
    description:
      "Keeps your passion projects moving forward with accountability, planning, and creative problem-solving.",
    icon: "Rocket",
    trustStage: 0,
    isDeepAgent: false,
    isMeta: false,
  },
];

export const META_AGENTS: Agent[] = [
  {
    id: "chief-of-staff",
    name: "Chief of Staff",
    category: "Daily Life",
    description:
      "Orchestrates your agent team, resolves conflicts between agents, and surfaces what matters most today.",
    icon: "Crown",
    trustStage: 0,
    isDeepAgent: false,
    isMeta: true,
    prerequisites: [
      { agentId: "calendaring", minTrustStage: 4 },
      { agentId: "spending-tracker", minTrustStage: 4 },
      { agentId: "email-drafter", minTrustStage: 3 },
    ],
  },
  {
    id: "life-coach",
    name: "Life Coach",
    category: "Learning & Growth",
    description:
      "Connects insights across your agents to help you see the bigger picture and align daily actions with long-term goals.",
    icon: "Compass",
    trustStage: 0,
    isDeepAgent: false,
    isMeta: true,
    prerequisites: [
      { agentId: "career-advisor", minTrustStage: 3 },
      { agentId: "fitness-coach", minTrustStage: 3 },
      { agentId: "savings-coach", minTrustStage: 3 },
    ],
  },
  {
    id: "health-manager",
    name: "Health Manager",
    category: "Health & Wellness",
    description:
      "Synthesizes data from your health agents to provide a holistic view and coordinate care decisions.",
    icon: "HeartPulse",
    trustStage: 0,
    isDeepAgent: false,
    isMeta: true,
    prerequisites: [
      { agentId: "fitness-coach", minTrustStage: 4 },
      { agentId: "sleep-coach", minTrustStage: 3 },
      { agentId: "symptom-tracker", minTrustStage: 3 },
      { agentId: "nutrition-tracker", minTrustStage: 3 },
    ],
  },
];

export const ALL_AGENTS: Agent[] = [...AGENTS, ...META_AGENTS];

export function getAgentById(id: string): Agent | undefined {
  return ALL_AGENTS.find((a) => a.id === id);
}

export function getAgentsByCategory(category: AgentCategory): Agent[] {
  return AGENTS.filter((a) => a.category === category);
}

export function getCategoryCounts(): Record<AgentCategory, number> {
  const counts = {} as Record<AgentCategory, number>;
  for (const cat of CATEGORIES) {
    counts[cat] = AGENTS.filter((a) => a.category === cat).length;
  }
  return counts;
}
