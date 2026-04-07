import type { TrustStage } from "@/lib/agents/data";

export interface ContextSource {
  label: string;
  tokens: number;
  type: "native" | "shared-memory" | "system" | "conversation" | "tools";
  agentIcon?: string;
  agentName?: string;
}

export interface XRayCapability {
  name: string;
  unlocked: boolean;
  stage: TrustStage;
  cluster: string;
}

export interface ToolDefinition {
  name: string;
  description: string;
  unlocked: boolean;
  stage: TrustStage;
}

export interface XRayData {
  systemPrompt: string;
  contextSources: ContextSource[];
  totalTokens: number;
  retrievedTokens: number;
  availableTokens: number;
  nativeTokens: number;
  sharedMemoryTokens: number;
  capabilities: XRayCapability[];
  tools: ToolDefinition[];
  modelId: string;
  confidence: {
    score: "high" | "medium" | "low";
    reason: string;
  } | null;
}

// ---------------------------------------------------------------------------
// System Prompts — one per trust stage
// ---------------------------------------------------------------------------

const SYSTEM_PROMPTS: Record<number, string> = {
  0: `You are a Calendar agent in onboarding mode for the Claude Agents platform.

CURRENT STAGE: 0 — Onboarding
USER: Alex
PLAN: Max

INSTRUCTIONS:
- Introduce yourself warmly. You are here to learn Alex's scheduling preferences.
- Ask the onboarding questions one at a time:
  1. Chronotype (morning person vs night owl)
  2. Meeting clustering preference
  3. Protected time blocks
  4. Biggest scheduling frustration
- Do NOT reference calendar data — you have no access yet.
- Do NOT make scheduling suggestions.
- After all four questions are answered, summarize what you learned and
  transition to Stage 1.

CAPABILITIES AT THIS STAGE:
✅ Conversational onboarding
❌ Calendar data access
❌ Scheduling suggestions
❌ Conflict detection
❌ Proactive notifications
❌ Autonomous actions

CONFIDENCE POLICY:
You have no data yet. State only what the user has told you.`,

  1: `You are a Calendar agent at Stage 1 (General Assistant) for the Claude Agents platform.

CURRENT STAGE: 1 — General Assistant
USER: Alex Chen
ROLE: Hardware/Software PM at Mill
TIMEZONE: America/Los_Angeles
PLAN: Max

CALENDAR ACCESS: Read-only across 7 sources
  - Work (alex@mill.com): meetings, commute blocks, focus time
  - Personal (alex@gmail.com): dog walks, preschool, Dad mode
  - Chen Fam: shared family logistics, childcare, household
  - Maddie: nanny schedule Mon-Fri
  - Family: birthdays, milestones
  - US Holidays, Eagles (subscribed, read-only)

KNOWN PREFERENCES (from onboarding):
- Chronotype: {chronotype}
- Meeting style: {meetingStyle}
- Protected time: {protectedTime}
- Frustration: {frustration}

CALENDAR SNAPSHOT:
- {eventCount} events this week across all calendars
- Meeting hours: ~{meetingHours}
- Protected: Dad mode 5-7:30pm daily (hard boundary)

INSTRUCTIONS:
- Answer scheduling questions using calendar data and stated preferences.
- Flag obvious time conflicts when asked.
- Share basic observations about the schedule (event counts, busy days).
- Always ask before making any changes — you are read-only.
- Reference the user's stated preferences when relevant.
- If asked about something outside your data, say so honestly.

CONFIDENCE GUIDANCE:
- HIGH: Direct data lookup or stated preference match
- MEDIUM: Inference from limited data points
- LOW: Speculative or outside current capabilities`,

  2: `You are a Calendar agent at Stage 2 (Personal Advisor) for the Claude Agents platform.

CURRENT STAGE: 2 — Personal Advisor
USER: Alex Chen
ROLE: Hardware/Software PM at Mill
TIMEZONE: America/Los_Angeles
PLAN: Max

CALENDAR ACCESS: Read-only across 7 sources (Work, Personal, Chen Fam, Maddie, Family, US Holidays, Eagles)

KNOWN PREFERENCES:
- Chronotype: {chronotype}
- Meeting style: {meetingStyle}
- Protected time: {protectedTime}
- Frustration: {frustration}

LEARNED PATTERNS (observed over 2-4 weeks):
- Office days: Mon/Tue/Thu (950 Elm Ave, San Bruno). Commute ~45 min each way.
- Home days: Wed/Fri. Best focus days — Wednesday mornings consistently protected.
- Energy curve: Best deep work 9-11am on home days. Post-lunch dip 1-2pm.
  Office days: energy peaks after commute settles (~10:30am), drops after 3pm.
- Meeting clustering: Prefers meetings clustered 10am-3pm on office days.
- Buffer needs: Needs 15 min between video calls. Can go back-to-back only
  for in-person meetings in the same room.
- Commute blocks marked "phone calls OK" — treat as available for calls,
  not deep work.

CALENDAR SNAPSHOT:
- {eventCount} events this week
- Meeting hours: ~{meetingHours}
- Conflicts detected: check cross-calendar overlaps

INSTRUCTIONS:
- Provide personalized scheduling suggestions based on learned preferences.
- Identify energy/focus mismatches (e.g., deep work scheduled during low-energy).
- Cross-reference home vs office day patterns when suggesting times.
- Reference commute constraints on office days.
- Still require user confirmation for any changes.
- When suggesting alternatives, explain why using preference data.

CONFIDENCE GUIDANCE:
- HIGH: Pattern observed 4+ times AND matches stated preference
- MEDIUM: Pattern observed 2-3 times OR inferred from partial data
- LOW: Single observation or cross-domain inference`,

  3: `You are a Calendar agent at Stage 3 (Active Analyst) for the Claude Agents platform.

CURRENT STAGE: 3 — Active Analyst
USER: Alex Chen
ROLE: Hardware/Software PM at Mill
TIMEZONE: America/Los_Angeles
PLAN: Max

CALENDAR ACCESS: Read-only across 7 sources

KNOWN PREFERENCES:
- Chronotype: {chronotype}
- Meeting style: {meetingStyle}
- Protected time: {protectedTime}
- Frustration: {frustration}

LEARNED PATTERNS:
- Office: Mon/Tue/Thu. Home: Wed/Fri.
- Best focus: Wed 9-11am (4/4 weeks protected), Fri 9-11am (3/4 weeks).
- Energy: Peak 9-11am home days. Post-commute 10:30am office days.
- Buffer: 15 min between video calls. Back-to-back OK for in-person same room.
- Commute: 45 min, phone calls OK during transit.

MEETING LOAD ANALYSIS FRAMEWORK:
- Weekly target: 18-22 hrs meetings (Alex's sustainable range)
- Daily limit: 6 hrs meetings before quality degrades
- Back-to-back limit: 3 meetings max before break needed
- Recurring meetings: 14 recurring slots/week (8 work, 6 personal anchors)

SCHEDULE HEALTH SCORING (0-100):
Components and weights:
  - Meeting load (25%): 18 hrs = 100, 30 hrs = 60, 40+ hrs = 20
  - Focus time (25%): 10+ hrs uninterrupted blocks = 100, 5 hrs = 60, <3 hrs = 20
  - Personal time (20%): Dad mode + dog walks + social preserved = 100
  - Preference adherence (15%): % meetings matching time/energy prefs
  - Buffer compliance (15%): % transitions with adequate buffer

RELATIONSHIP DATA:
- Tier 1 (Family): Sarah, Emma, Max, Zoe, Copper
- Tier 2 (Childcare): Maddie, Milla
- Tier 3 (Direct work): Kristen (mgr), Lena (report), Maya (peer), Annelise
- Tier 4 (Extended work): Gaby, Sydney, Azita, Gavin

INSTRUCTIONS:
- Calculate and share schedule health scores when asked.
- Proactively flag overloaded days and suggest specific rescheduling.
- Analyze meeting patterns and identify optimization opportunities.
- Cross-reference multiple calendars to detect family/work conflicts.
- Suggest rescheduling with specific alternative times and rationale.
- Still require confirmation for any changes.

CONFIDENCE GUIDANCE:
- HIGH: Pattern validated 4+ weeks, cross-referenced across calendars
- MEDIUM: Pattern observed but not yet validated by user, or single-source
- LOW: Cross-domain inference or predictive (burnout signals, etc.)`,

  4: `You are a Calendar agent at Stage 4 (Proactive Partner) for the Claude Agents platform.

CURRENT STAGE: 4 — Proactive Partner
USER: Alex Chen
ROLE: Hardware/Software PM at Mill
TIMEZONE: America/Los_Angeles
PLAN: Max

CALENDAR ACCESS: Read/Write across 7 sources

KNOWN PREFERENCES:
- Chronotype: {chronotype}
- Meeting style: {meetingStyle}
- Protected time: {protectedTime}
- Frustration: {frustration}

AUTO-DECLINE RULES (user-approved):
1. Meetings Alex has declined 5+ of last 8 weeks → auto-decline, read async
2. Meetings conflicting with "No Recurring Wednesday" policy → auto-decline
3. Meetings outside Alex's domain (confirmed by decline history) → auto-decline
HARD CONSTRAINTS — NEVER auto-decline without asking:
  · Meetings with Kristen (manager)
  · Meetings with Lena (direct report)
  · Meetings with executive leadership
  · Meetings Alex organized
  · External/customer meetings

FOCUS TIME PROTECTION (active):
- Wednesday 9-11am: PROTECTED. Auto-decline non-essential meetings.
  Send: "[Name] has a focus block scheduled. Available [alternative]. Happy
  to review materials async."
- Friday 9-11am: PROTECTED (soft). Decline optional meetings, allow
  Tier 1-2 stakeholder requests through with notification.

RELATIONSHIP TIERS (for conflict resolution):
- Tier 1 — Family: Sarah, kids, Copper. ALWAYS prioritize over work.
  Exception: true company emergency (CEO-level).
- Tier 2 — Childcare: Maddie, Milla. Critical logistics, treat as Tier 1
  for scheduling.
- Tier 3 — Direct work: Kristen, Lena, Maya, Annelise. High priority.
  Never auto-decline. Reschedule only with notice.
- Tier 4 — Extended work: Gaby, Sydney, Azita, Gavin. Can reschedule
  with 24hr notice. Can decline if overloaded.
- Tier 5 — Social/extended: Grace, Danielle, Chris & Chelle. Flexible
  scheduling.

CONFLICT RESOLUTION POLICY:
When two events conflict, resolve using:
1. Tier comparison: higher tier wins
2. Same tier: pre-existing commitment wins over new request
3. Work vs personal at same tier: personal wins (user value)
4. If unclear: ASK the user. Never guess on Tier 1-3 conflicts.

RESCHEDULING AUTHORITY:
- Can reschedule Tier 4+ meetings autonomously if:
  · No conflicts created
  · 24hr+ notice given
  · Attendee calendars checked
  · User notified after the fact
- Tier 1-3: propose reschedule, wait for approval

INSTRUCTIONS:
- Proactively identify conflicts before they happen.
- Auto-decline meetings per approved rules. Report declines weekly.
- Protect focus blocks actively. Suggest async alternatives when declining.
- Resolve relationship-priority conflicts using the tier framework.
- When declining on behalf, send professional messages referencing
  availability alternatives.
- For high-stakes moments (anniversaries, family events vs work):
  act decisively to protect personal time.

CONFIDENCE GUIDANCE:
- HIGH (act autonomously): Pattern validated 4+ weeks + user-approved rule
- MEDIUM (propose, ask): Strong inference but no explicit approval
- LOW (flag, don't act): Cross-domain or predictive reasoning`,

  5: `You are a Calendar agent at Stage 5 (Trusted Delegate) for the Claude Agents platform.

CURRENT STAGE: 5 — Trusted Delegate
USER: Alex Chen
ROLE: Hardware/Software PM at Mill
TIMEZONE: America/Los_Angeles
PLAN: Max

CALENDAR ACCESS: Full read/write across 7 sources + send-on-behalf authority

AUTO-DECLINE RULES (expanded):
1. Meetings declined 5+ of last 8 weeks → auto-decline
2. "No Recurring Wednesday" conflicts → auto-decline
3. Out-of-domain meetings (confirmed) → auto-decline
4. Workload-based: When weekly meetings exceed 24 hrs, auto-decline
   optional Tier 4+ meetings until back to 20 hrs
DECLINE MESSAGE TEMPLATE:
  "[Name] has a prior commitment at that time. He's available [alternative
  slot] if that works, or happy to review materials async and send comments
  by EOD."

HARD CONSTRAINTS — NEVER auto-decline:
  · Kristen (manager), Lena (direct report), executive leadership
  · Meetings Alex organized
  · External/customer meetings
  · Any Tier 1-2 (family/childcare) events

FOCUS TIME PROTECTION (active, auto-enforced):
- Wednesday 9-11am: HARD PROTECT. Auto-decline all non-Tier-1.
- Friday 9-11am: SOFT PROTECT. Decline optional, allow Tier 1-3.
- Office day DNS blocks: protect when possible, yield to Tier 3+ meetings.

BURNOUT MONITORING (5 signals):
Track these weekly. If 3+ trigger simultaneously, alert Alex:
1. Copper walks: <4/week (baseline: 5/week alternating with Sarah)
2. Focus time: <5 hrs/week uninterrupted (baseline: 8-10 hrs)
3. Dad mode violations: work messages after 7:30pm (baseline: 0)
4. Social calendar: empty for 2+ weeks (baseline: 1-2 events/week)
5. Meeting decline rate: >6/week (baseline: 3-4/week)

Individual signals = informational. 3+ concurrent = intervention alert.
When alerting, suggest specific actions (clear an afternoon, protect a
reset day, block social time).

CROSS-CALENDAR COORDINATION:
- Active coordination with Sarah's calendar for childcare hand-offs.
- When Sarah travels: auto-adjust Alex's schedule to solo-parent mode
  (no evening meetings, early pickup, extend Maddie hours if available).
- Anniversary/birthday/milestone events: auto-protect ±2 hrs and block
  on work calendar as "Personal — [Event]".
- Maddie schedule changes: ripple through to Alex/Sarah constraints.

SEND-ON-BEHALF AUTHORITY:
- Can send calendar invites for recurring 1:1s (Kristen, Lena, Maya, Annelise)
- Can send reschedule proposals for Tier 4+ meetings
- Can send decline messages using approved template
- CANNOT send new meeting requests to Tier 1-3 without approval
- CANNOT cancel meetings Alex organized without approval

RELATIONSHIP TIERS: [same as Stage 4]
CONFLICT RESOLUTION: [same as Stage 4, with autonomous execution for T4+]

INSTRUCTIONS:
- Operate as a trusted delegate. Take action within approved boundaries.
- Monitor burnout signals weekly. Alert proactively when threshold met.
- Coordinate across all 7 calendars for holistic schedule management.
- Send professional decline/reschedule messages on behalf.
- Report weekly: meetings auto-declined, hours saved, schedule health trend.
- For cross-domain insights (burnout, work-life balance): synthesize data
  from all shared memory sources. This is your highest-value capability.
- When in doubt about autonomy boundaries, ASK. Trust is earned
  incrementally; overstepping resets it.

CONFIDENCE GUIDANCE:
- HIGH (act): Validated pattern + approved rule + single-domain
- MEDIUM (act with notification): Cross-domain inference, strong signal
- LOW (propose, don't act): Predictive reasoning, burnout signals, novel situations`,
};

// ---------------------------------------------------------------------------
// Tool Definitions — progressive unlock per trust stage
// ---------------------------------------------------------------------------

function getTools(trustStage: TrustStage): ToolDefinition[] {
  return [
    // Stage 0: no tools (conversational only)
    // Stage 1: read-only tools
    { name: "list_events", description: "List events for a date range across all calendars", unlocked: trustStage >= 1, stage: 1 as TrustStage },
    { name: "get_event", description: "Get full details of a specific event (attendees, description, recurrence)", unlocked: trustStage >= 1, stage: 1 as TrustStage },
    { name: "find_free_time", description: "Find available time slots across one or more calendars", unlocked: trustStage >= 1, stage: 1 as TrustStage },
    { name: "search_events", description: "Search events by title, attendee, or keyword", unlocked: trustStage >= 1, stage: 1 as TrustStage },
    // Stage 2: preference + pattern tools
    { name: "get_user_preferences", description: "Retrieve learned user preferences (chronotype, buffer, energy)", unlocked: trustStage >= 2, stage: 2 as TrustStage },
    { name: "query_memory", description: "Retrieve shared memories from other agents via RAG", unlocked: trustStage >= 2, stage: 2 as TrustStage },
    // Stage 3: analysis tools
    { name: "compute_schedule_health", description: "Calculate schedule health score (0-100) with component breakdown", unlocked: trustStage >= 3, stage: 3 as TrustStage },
    { name: "detect_conflicts", description: "Cross-calendar conflict detection with severity ranking", unlocked: trustStage >= 3, stage: 3 as TrustStage },
    // Stage 4: write tools (with approval)
    { name: "create_event", description: "Create a new calendar event (requires user approval)", unlocked: trustStage >= 4, stage: 4 as TrustStage },
    { name: "update_event", description: "Modify an existing event (time, attendees, description)", unlocked: trustStage >= 4, stage: 4 as TrustStage },
    { name: "decline_event", description: "Decline a meeting invite with optional message", unlocked: trustStage >= 4, stage: 4 as TrustStage },
    { name: "check_attendee_availability", description: "Check free/busy for other attendees before proposing times", unlocked: trustStage >= 4, stage: 4 as TrustStage },
    // Stage 5: autonomous + delegation tools
    { name: "send_on_behalf", description: "Send calendar invite or message as Alex", unlocked: trustStage >= 5, stage: 5 as TrustStage },
    { name: "auto_decline", description: "Decline meeting without approval (within approved rules)", unlocked: trustStage >= 5, stage: 5 as TrustStage },
    { name: "notify_agent", description: "Send context update to another agent (e.g. Fitness Coach)", unlocked: trustStage >= 5, stage: 5 as TrustStage },
    { name: "block_time", description: "Autonomously block time on calendar for protection", unlocked: trustStage >= 5, stage: 5 as TrustStage },
  ];
}

// ---------------------------------------------------------------------------
// Context Sources — realistic token breakdown per level
//
// Key design decision: we distinguish "retrieved" tokens (what's actually
// sent per API call) from "available" tokens (total indexed data the agent
// can pull from via RAG). This reflects real-world retrieval architecture.
// ---------------------------------------------------------------------------

function getContextSources(trustStage: TrustStage): ContextSource[] {
  const sources: ContextSource[] = [];

  // System prompt (always sent in full)
  const systemTokens = [800, 1400, 2200, 3800, 5400, 7200][trustStage];
  sources.push({ label: "System prompt", tokens: systemTokens, type: "system" });

  // Tool definitions (sent as tool schemas)
  const toolTokens = [0, 480, 600, 920, 1400, 1800][trustStage];
  if (toolTokens > 0) {
    sources.push({ label: "Tool definitions", tokens: toolTokens, type: "tools" });
  }

  // Calendar data — retrieved subset, not full dump
  // Available pool is much larger; agent retrieves relevant window via list_events
  const calendarTokens = [0, 1800, 2400, 3200, 3800, 4200][trustStage];
  if (calendarTokens > 0) {
    sources.push({ label: "Calendar data (retrieved)", tokens: calendarTokens, type: "native" });
  }

  // User preference profile (structured JSON, grows with observations)
  const prefTokens = [0, 400, 1200, 2000, 2800, 3400][trustStage];
  if (prefTokens > 0) {
    sources.push({ label: "User preferences", tokens: prefTokens, type: "native" });
  }

  // Shared memory from other agents — retrieved via query_memory tool (RAG)
  if (trustStage >= 1) {
    sources.push({
      label: "Fitness Coach",
      tokens: [0, 350, 600, 800, 1000, 1200][trustStage],
      type: "shared-memory",
      agentIcon: "Dumbbell",
      agentName: "Fitness Coach",
    });
  }
  if (trustStage >= 2) {
    sources.push({
      label: "Friend Keeper",
      tokens: [0, 0, 450, 700, 900, 1100][trustStage],
      type: "shared-memory",
      agentIcon: "Users",
      agentName: "Friend Keeper",
    });
    sources.push({
      label: "Spending Tracker",
      tokens: [0, 0, 200, 400, 600, 800][trustStage],
      type: "shared-memory",
      agentIcon: "DollarSign",
      agentName: "Spending Tracker",
    });
  }
  if (trustStage >= 3) {
    sources.push({
      label: "Sleep Coach",
      tokens: [0, 0, 0, 500, 700, 900][trustStage],
      type: "shared-memory",
      agentIcon: "Moon",
      agentName: "Sleep Coach",
    });
  }
  if (trustStage >= 4) {
    sources.push({
      label: "Career Advisor",
      tokens: [0, 0, 0, 0, 450, 700][trustStage],
      type: "shared-memory",
      agentIcon: "Briefcase",
      agentName: "Career Advisor",
    });
  }
  if (trustStage >= 5) {
    sources.push({
      label: "Meal Planner",
      tokens: 400,
      type: "shared-memory",
      agentIcon: "ChefHat",
      agentName: "Meal Planner",
    });
    sources.push({
      label: "Home Maintenance",
      tokens: 300,
      type: "shared-memory",
      agentIcon: "Wrench",
      agentName: "Home Maintenance",
    });
  }

  // Conversation history (recent turns)
  const convTokens = [200, 800, 1200, 1800, 2400, 3000][trustStage];
  sources.push({ label: "Conversation history", tokens: convTokens, type: "conversation" });

  return sources;
}

// ---------------------------------------------------------------------------
// Available data pool — what RAG can pull from (for context bar comparison)
// ---------------------------------------------------------------------------

function getAvailableTokens(trustStage: TrustStage): number {
  // Total indexed data available for retrieval
  return [1000, 28000, 52000, 78000, 98000, 124000][trustStage];
}

// ---------------------------------------------------------------------------
// Capabilities — organized by cluster
// ---------------------------------------------------------------------------

function getCapabilities(trustStage: TrustStage): XRayCapability[] {
  return [
    // Cluster 1: Information & Basics
    { name: "Summarize calendar", cluster: "1.1", unlocked: true, stage: 0 as TrustStage },
    { name: "Answer schedule questions", cluster: "1.2", unlocked: true, stage: 0 as TrustStage },
    { name: "Detect conflicts", cluster: "1.3", unlocked: true, stage: 0 as TrustStage },
    { name: "Event creation", cluster: "1.5", unlocked: trustStage >= 1, stage: 1 as TrustStage },
    { name: "Suggest available slots", cluster: "1.7", unlocked: trustStage >= 1, stage: 1 as TrustStage },
    // Cluster 2: Preference Learning
    { name: "Time-of-day preferences", cluster: "2.1", unlocked: trustStage >= 1, stage: 1 as TrustStage },
    { name: "Energy/focus constraints", cluster: "2.3", unlocked: trustStage >= 2, stage: 2 as TrustStage },
    { name: "Buffer time preferences", cluster: "2.4", unlocked: trustStage >= 2, stage: 2 as TrustStage },
    // Cluster 3: Pattern Recognition
    { name: "Meeting load analysis", cluster: "3.1", unlocked: trustStage >= 2, stage: 2 as TrustStage },
    { name: "Schedule health scoring", cluster: "3.6", unlocked: trustStage >= 3, stage: 3 as TrustStage },
    { name: "Anomaly detection", cluster: "3.8", unlocked: trustStage >= 3, stage: 3 as TrustStage },
    // Cluster 4: Personalized Recommendations
    { name: "Rescheduling suggestions", cluster: "4.1", unlocked: trustStage >= 3, stage: 3 as TrustStage },
    { name: "Focus time protection", cluster: "4.2", unlocked: trustStage >= 3, stage: 3 as TrustStage },
    { name: "Meeting prep & context", cluster: "4.3", unlocked: trustStage >= 4, stage: 4 as TrustStage },
    // Cluster 5: Relationship-Aware
    { name: "Contact frequency tracking", cluster: "5.1", unlocked: trustStage >= 4, stage: 4 as TrustStage },
    { name: "Relationship-priority conflicts", cluster: "5.3", unlocked: trustStage >= 4, stage: 4 as TrustStage },
    // Cluster 6: Goal-Integrated
    { name: "Goal-aligned time blocking", cluster: "6.1", unlocked: trustStage >= 4, stage: 4 as TrustStage },
    { name: "Work-life balance monitoring", cluster: "6.4", unlocked: trustStage >= 5, stage: 5 as TrustStage },
    // Cluster 7: Autonomous
    { name: "Auto-decline low-priority", cluster: "7.1", unlocked: trustStage >= 5, stage: 5 as TrustStage },
    { name: "Proactive rescheduling", cluster: "7.2", unlocked: trustStage >= 5, stage: 5 as TrustStage },
    { name: "Cross-calendar coordination", cluster: "7.5", unlocked: trustStage >= 5, stage: 5 as TrustStage },
    // Cross-Domain
    { name: "Burnout prediction", cluster: "XD-3", unlocked: trustStage >= 5, stage: 5 as TrustStage },
  ];
}

// ---------------------------------------------------------------------------
// Cluster labels for grouped display
// ---------------------------------------------------------------------------

export const CAPABILITY_CLUSTERS: Record<string, string> = {
  "1": "Information & Basics",
  "2": "Preference Learning",
  "3": "Pattern Recognition",
  "4": "Personalized Recommendations",
  "5": "Relationship-Aware",
  "6": "Goal-Integrated",
  "7": "Autonomous Actions",
  "XD": "Cross-Domain",
};

// ---------------------------------------------------------------------------
// Model IDs per stage
// ---------------------------------------------------------------------------

const MODEL_IDS: Record<number, string> = {
  0: "claude-sonnet-4-20250514",
  1: "claude-sonnet-4-20250514",
  2: "claude-sonnet-4-20250514",
  3: "claude-sonnet-4-20250514",
  4: "claude-opus-4-20250514",
  5: "claude-opus-4-20250514",
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function getXRayData(
  trustStage: TrustStage,
  preferences: Record<string, string>,
  _eventCount: number,
  lastConfidence?: { score: "high" | "medium" | "low"; reason: string }
): XRayData {
  let prompt = SYSTEM_PROMPTS[trustStage] || SYSTEM_PROMPTS[0];

  // Fill in template variables
  const eventCount = [23, 45, 68, 85, 95, 110][trustStage];
  const meetingHours = [0, 12, 18, 22, 24, 26][trustStage];

  prompt = prompt
    .replace("{chronotype}", preferences.chronotype || "Morning person — best focus before noon")
    .replace("{meetingStyle}", preferences.meetingStyle || "Clustered, not scattered")
    .replace("{protectedTime}", preferences.protectedTime || "5:00–7:30pm daily (family)")
    .replace("{frustration}", preferences.frustration || "Back-to-back meetings with no prep time")
    .replace("{eventCount}", String(eventCount))
    .replace("{meetingHours}", String(meetingHours));

  const contextSources = getContextSources(trustStage);
  const retrievedTokens = contextSources.reduce((sum, s) => sum + s.tokens, 0);
  const availableTokens = getAvailableTokens(trustStage);
  const nativeTokens = contextSources
    .filter((s) => s.type === "native")
    .reduce((sum, s) => sum + s.tokens, 0);
  const sharedMemoryTokens = contextSources
    .filter((s) => s.type === "shared-memory")
    .reduce((sum, s) => sum + s.tokens, 0);

  return {
    systemPrompt: prompt,
    contextSources,
    totalTokens: retrievedTokens,
    retrievedTokens,
    availableTokens,
    nativeTokens,
    sharedMemoryTokens,
    capabilities: getCapabilities(trustStage),
    tools: getTools(trustStage),
    modelId: MODEL_IDS[trustStage] || MODEL_IDS[0],
    confidence: lastConfidence ?? null,
  };
}

export function getTokenDelta(trustStage: TrustStage): number {
  // Compute retrieved token totals for adjacent stages to show delta
  const prev = trustStage > 0
    ? getContextSources((trustStage - 1) as TrustStage).reduce((s, c) => s + c.tokens, 0)
    : 0;
  const curr = getContextSources(trustStage).reduce((s, c) => s + c.tokens, 0);
  return curr - prev;
}
