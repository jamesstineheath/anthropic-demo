# Session Log

## Session 1 — April 6, 2026

### What happened

Debated and finalized project instructions for the Anthropic take-home demo prototype. No code written yet. All planning decisions are captured in PROJECT_INSTRUCTIONS.md.

### Key decisions made

1. **Calendaring is the deep agent.** Considered Writing Coach, Personal Chief of Staff, and Relationship Manager. Calendaring won because progressive trust is self-evident in scheduling (nobody needs it explained why an AI shouldn't reschedule your boss meeting). Chief of Staff was reframed as a capstone meta-agent that requires a trained team of agents underneath it, not a starting point.

2. **X-ray mode showing the model layer** is a first-class feature, not a nice-to-have. It becomes the primary artifact for the Technical Design Discussion with the EM during the on-site. Shows context retrieval, confidence scoring, system prompt at current trust level, capability gating logic.

3. **Progressive trust, not gamification.** Explicitly avoid XP bars, achievement unlocks, and gaming metaphors. Anthropic's brand is safety and restraint. The progression should feel like a relationship deepening.

4. **Hybrid navigation: guided walkthrough then free explore.** Also serves as the presenter-led path for the on-site presentation.

5. **Scripted chat, live API as stretch.** Pre-written response trees for the calendaring agent. Upgrade to live Claude API if time permits.

6. **5 trust levels, all interactive.** Full arc from first interaction to autonomous coordination.

7. **On-site presentation shapes the demo.** Part 2 (if accepted) is a 60-min on-site: 20-25 min presentation + demo, 25-30 min Technical Design Discussion with EM, 10 min Q&A. The demo needs natural pause points for narration and the x-ray mode is load-bearing for the technical discussion.

8. **Agent marketplace roster finalized.** 33 agents across 8 categories (Daily Life, Health & Wellness, Money, Relationships, Life Events, Learning & Growth, Work, Creative) plus 3 meta agents (Chief of Staff, Life Coach, Health Manager) shown locked with dependency maps. Informed by Anthropic's 81K global interview study. Full roster in PROJECT_INSTRUCTIONS.md.

9. **Trust stages refined with internal gradients.** 6 stages (0-5): Onboarding, General Assistant, Personal Advisor, Active Analyst, Proactive Partner, Trusted Delegate. Each stage has internal autonomy gradients (low-stakes actions happen freely, high-stakes require confirmation). Trust is continuous, not discrete. Onboarding is explicit and sets the tone for the relationship.

10. **Every agent has a work surface, not just a chat.** The Calendaring agent needs a fully functional calendar UI (year, month, week, 3-day, day, agenda views) with event creation/editing. The agent's suggestions materialize on this surface. This is an architectural concept that extends to every agent (Fitness Coach has a workout log, Spending Tracker has a transaction feed), but only Calendaring is built. Calendar features prioritized by whether they serve the trust narrative.

### Capability prediction alignment

The prediction is about reliable reasoning across large, heterogeneous personal context. The product depends on agents sharing universal memory, which creates massive cross-domain context. Higher-level agent capabilities (e.g., suggesting dinner with a specific friend by synthesizing relationship recency, schedule flexibility, restaurant proximity, and social goals simultaneously) require reasoning that can't be solved by retrieval alone. The demo should make this visible, especially through the x-ray mode at higher trust levels.

### Key reference material

- Anthropic 81K interview study: https://www.anthropic.com/features/81k-interviews (domains of value, quotes, concerns)
- Unreliability is #1 concern at 26.7%, directly supports capability prediction and progressive trust thesis
- Quotes page has strong material for the presentation: https://www.anthropic.com/features/81k-interviews#quotes
- Written proposal Google Doc: 1nnNX3ztlx6UhE3PlOE3ZPbr5yh5ycPNOqGXi9cZn0LI

### What's next

- Begin building: scaffold project, deploy to Vercel, start on marketplace and agent data model
- Define the 5 trust levels for the Calendaring agent (specific capabilities, unlock criteria, scripted interactions at each level)
- Design the x-ray mode (what it shows at each level, how it ties to capability prediction)
- Design the guided walkthrough flow

### Open questions

- What does the cross-agent / Layer 3 glimpse actually look like in the demo?
- How does the guided walkthrough transition to free exploration?
- What specific scripted interactions does each trust level contain?
- What does the x-ray mode show at each level?

---

## Session 2 — April 6, 2026 (Phase 1)

### What happened

Scaffolded the entire project, built the agent data model, marketplace UI, and deployed to Vercel. Phase 1 is complete and live.

### What was built

1. **Project scaffold**: Next.js 16 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui (base-ui), next-themes, lucide-react
2. **Claude.ai warm palette**: Custom CSS variables in oklch color space — cream background, warm gray text, terracotta (#D97757) accent, 12px border radius. Full dark mode support.
3. **Agent data model** (`src/lib/agents/data.ts`): All 33 agents across 8 categories + 3 meta agents with TypeScript types, descriptions, lucide icon mappings, and helper functions
4. **Marketplace UI**: Hero header, responsive 3-column agent card grid, category filtering via URL search params, "Add to Team" / "Remove" interactions
5. **Sidebar**: Category navigation with counts, "Your Team" section with persistent state, Meta Agents section with lock icons
6. **App shell**: Persistent sidebar + main content layout, X-Ray Mode toggle (UI only), theme toggle, mobile hamburger sidebar (Sheet), footer badge
7. **Agent detail placeholder**: `/agents/[id]` route with back link, agent info, and Phase 2 placeholder
8. **State management**: TeamProvider (React context + localStorage persistence), XRayProvider (React context), mounted flag pattern for hydration safety
9. **Deployment**: GitHub repo (jamesstineheath/anthropic-demo), Vercel production deployment

### Technical decisions

- **shadcn/ui v4 uses base-ui** (not Radix): No `asChild` prop on Trigger components — render children directly inside triggers instead
- **Next.js 16**: `params` and `searchParams` are Promises that must be awaited
- **Category filtering via URL search params**: Shareable, back-button friendly, no extra state needed
- **Icon map pattern**: Explicit imports of 37 lucide icons mapped by string name — tree-shakeable, no dynamic imports
- **oklch color space**: Used for all CSS variables to match shadcn/ui v4 conventions

### Live URLs

- **Vercel**: https://anthropic-demo-beige.vercel.app
- **GitHub**: https://github.com/jamesstineheath/anthropic-demo

### Verified

- [x] `npm run build` passes with no errors
- [x] All 33 agents + 3 meta agents render correctly
- [x] Category filtering works (sidebar clicks filter grid, URL updates)
- [x] "Add to Team" adds agent to sidebar, persists on refresh via localStorage
- [x] Dark mode toggle works with warm dark palette
- [x] Mobile responsive: sidebar collapses to hamburger, grid reflows
- [x] Agent detail placeholder page renders correctly
- [x] Meta agents show prerequisites as badge pills
- [x] Overall aesthetic matches Claude.ai's warm, spacious design language

### What's next (Phase 2)

- Build the Calendaring deep agent detail page with calendar work surface
- Implement trust stage progression (interactive stages 0-5)
- Build the chat interface with scripted responses
- Implement X-Ray Mode functionality (showing model internals at each trust level)
