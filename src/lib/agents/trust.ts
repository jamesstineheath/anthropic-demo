import type { TrustStage } from "./data";

export const TRUST_STAGE_DETAILS: Record<
  TrustStage,
  { name: string; shortDescription: string; description: string }
> = {
  0: {
    name: "Onboarding",
    shortDescription: "Getting to know you",
    description:
      "The agent asks about your preferences and begins building a profile. No actions are taken on your behalf.",
  },
  1: {
    name: "General Assistant",
    shortDescription: "Calendar queries, basic suggestions",
    description:
      "Can answer questions about your schedule, flag conflicts, and share basic observations. Still requires explicit requests.",
  },
  2: {
    name: "Personal Advisor",
    shortDescription: "Personalized scheduling",
    description:
      "Offers tailored suggestions based on your learned preferences. Proposes specific changes but always asks before acting.",
  },
  3: {
    name: "Active Analyst",
    shortDescription: "Pattern detection, optimization",
    description:
      "Analyzes scheduling patterns over time, identifies trends, and suggests structural improvements to your calendar.",
  },
  4: {
    name: "Proactive Partner",
    shortDescription: "Autonomous suggestions",
    description:
      "Proactively notifies you of issues and opportunities. Handles low-stakes scheduling autonomously, confirms high-stakes changes.",
  },
  5: {
    name: "Trusted Delegate",
    shortDescription: "Acts on your behalf",
    description:
      "Full scheduling authority within your defined boundaries. Resolves conflicts, coordinates with other agents, and manages your time proactively.",
  },
};
