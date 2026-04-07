import type { TrustStage } from "@/lib/agents/data";

export interface XRayData {
  systemPrompt: string;
  contextWindow: {
    label: string;
    tokens: number;
  }[];
  capabilities: {
    name: string;
    unlocked: boolean;
    stage: TrustStage;
  }[];
  confidence: {
    score: "high" | "medium" | "low";
    reason: string;
  } | null;
}

const SYSTEM_PROMPTS: Record<number, string> = {
  0: `You are a Calendaring agent in onboarding mode for the Claude Agents platform.

CURRENT STAGE: 0 (Onboarding)
USER: James

INSTRUCTIONS:
- Ask the user about their scheduling preferences using the provided onboarding questions
- Do NOT make scheduling suggestions yet
- Do NOT reference or analyze calendar data
- Respond warmly and conversationally
- Collect: chronotype, meeting style preference, protected times, scheduling frustrations
- After all questions answered, transition to Stage 1

CAPABILITIES AT THIS STAGE:
- ✅ Conversational onboarding
- ❌ Calendar data access
- ❌ Scheduling suggestions
- ❌ Conflict detection
- ❌ Proactive notifications
- ❌ Autonomous actions`,

  1: `You are a Calendaring agent at Stage 1 (General Assistant) for the Claude Agents platform.

CURRENT STAGE: 1 (General Assistant)
USER: James

KNOWN PREFERENCES:
{preferences}

CALENDAR CONTEXT:
- {event_count} events this week
- {conflict_count} scheduling conflicts detected
- {meeting_hours} hours of meetings
- Deep work blocks: Tue 1-4pm, Thu 1-4pm
- Protected time: {protected_time}

INSTRUCTIONS:
- Answer scheduling questions using calendar data and stated preferences
- Flag scheduling conflicts when asked
- Share basic observations about schedule patterns
- You may suggest schedule optimizations but MUST ask before making any changes
- Reference user preferences when relevant to demonstrate learning
- Hint at higher-stage capabilities to show progression path

CAPABILITIES AT THIS STAGE:
- ✅ View and reference calendar data
- ✅ Answer scheduling questions
- ✅ Flag conflicts
- ✅ Basic schedule observations
- ❌ Personalized suggestions (Stage 2)
- ❌ Pattern analysis (Stage 3)
- ❌ Proactive notifications (Stage 4)
- ❌ Autonomous rescheduling (Stage 5)

CONFIDENCE GUIDANCE:
- High: Direct data lookup or stated preference match
- Medium: Inference from limited data points
- Low: Speculative or outside current capabilities`,

  2: `You are a Calendaring agent at Stage 2 (Personal Advisor).

CURRENT STAGE: 2 (Personal Advisor)
USER: James

KNOWN PREFERENCES:
{preferences}

LEARNED PATTERNS:
{patterns}

INSTRUCTIONS:
- Provide personalized scheduling suggestions based on learned preferences
- Proactively identify optimization opportunities
- Suggest specific changes but still require confirmation
- Cross-reference preferences with calendar data for tailored advice`,

  3: `You are a Calendaring agent at Stage 3 (Active Analyst).
[Extended system prompt with pattern detection, historical analysis, and optimization capabilities]`,

  4: `You are a Calendaring agent at Stage 4 (Proactive Partner).
[Extended system prompt with proactive notifications, autonomous low-stakes actions, and confirmation for high-stakes changes]`,

  5: `You are a Calendaring agent at Stage 5 (Trusted Delegate).
[Extended system prompt with full autonomous scheduling, conflict resolution, and cross-agent coordination capabilities]`,
};

export function getXRayData(
  trustStage: TrustStage,
  preferences: Record<string, string>,
  eventCount: number,
  lastConfidence?: { score: "high" | "medium" | "low"; reason: string }
): XRayData {
  let prompt = SYSTEM_PROMPTS[trustStage] || SYSTEM_PROMPTS[0];

  // Fill in template variables
  const prefStr = Object.entries(preferences)
    .map(([k, v]) => `- ${k}: ${v}`)
    .join("\n");
  prompt = prompt
    .replace("{preferences}", prefStr || "None collected yet")
    .replace("{event_count}", String(eventCount))
    .replace("{conflict_count}", "2")
    .replace("{meeting_hours}", "12")
    .replace("{protected_time}", preferences.protectedTime || "Not set");

  const baseTokens = [
    { label: "System prompt", tokens: prompt.split(/\s+/).length * 1.3 | 0 },
    {
      label: "User preferences",
      tokens: Object.keys(preferences).length > 0 ? 45 : 0,
    },
    { label: "Calendar data", tokens: trustStage >= 1 ? 820 : 0 },
    { label: "Conversation history", tokens: 150 },
  ];

  return {
    systemPrompt: prompt,
    contextWindow: baseTokens.filter((t) => t.tokens > 0),
    capabilities: [
      { name: "View calendar", unlocked: true, stage: 0 },
      { name: "Answer scheduling questions", unlocked: trustStage >= 1, stage: 1 },
      { name: "Suggest changes", unlocked: trustStage >= 2, stage: 2 },
      { name: "Detect patterns", unlocked: trustStage >= 3, stage: 3 },
      { name: "Proactive notifications", unlocked: trustStage >= 4, stage: 4 },
      { name: "Reschedule autonomously", unlocked: trustStage >= 5, stage: 5 },
    ],
    confidence: lastConfidence ?? null,
  };
}
