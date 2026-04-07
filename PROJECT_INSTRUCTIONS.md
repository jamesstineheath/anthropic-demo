# Project Instructions

## The Assignment

Anthropic PM take-home. Three deliverables: a 1-page capability prediction, a 2-3 page product proposal, and a working prototype that demonstrates the product concept. The written parts are in progress in a separate Google Doc (ID: 1nnNX3ztlx6UhE3PlOE3ZPbr5yh5ycPNOqGXi9cZn0LI). This project is the prototype.

If the take-home is accepted, Part 2 is a 60-minute on-site presentation: 20-25 min presenting the prediction, product rationale, and demoing the prototype to a Research PM and EM; 25-30 min Technical Design Discussion on what it takes to go from prototype to MVP; 10 min open Q&A. The demo must work as both a self-serve experience and a presenter-driven walkthrough.

## What We're Trying to Prove

The written proposal argues that templated agents with progressive trust are a compelling consumer product for Anthropic. The prototype's job is to make that argument tangible. A reviewer should walk away believing:

1. Progressive trust is a product mechanic, not just a safety concept. Gating capabilities behind confidence makes the product better, not just safer.
2. This is a platform, not a feature. The system is extensible across use cases.
3. This is good for Anthropic's business. Deeper engagement creates memory-based stickiness, natural upsell to Pro/Max, and enterprise pull.

The demo doesn't need to do everything. It needs to do enough to make the reviewer's imagination fill in the rest.

## The Capability Prediction (context for the prototype)

The prediction: a step improvement in reliable reasoning across large, heterogeneous personal context. Not just bigger context windows, but models that actively synthesize across disparate pieces of personal information to produce judgment-level outputs. Today's models hold the tokens but degrade on tasks requiring connections across information spread far apart in the window. The prediction is that this failure mode gets substantially better in the next 12 months.

This matters for the prototype because the product concept depends on agents that share a universal memory. As memory grows across agents (preferences, relationships, goals, routines, logistics), the context becomes massive and the reasoning required is cross-domain. A calendaring agent suggesting dinner with a specific friend needs to simultaneously weigh: the relationship, recency of contact, the friend's availability patterns, the user's schedule flexibility this week, a restaurant near the friend's office, and the user's stated goal of being more social. That's not a retrieval problem. It's a reasoning-over-context problem, and it ties directly to Anthropic's strengths in alignment and reliability research.

The demo should make this connection visible. Higher-level agent capabilities should require cross-domain reasoning that wouldn't work with simple retrieval. The x-ray mode should let reviewers see the context growing and the model reasoning across it.

## Primary Goal

Build an amazing demo that nails the prompt and wows the hiring team. It should demonstrate James's skills as a PM and builder: product taste, systems thinking, attention to detail, ability to ship. It should be publicly available and hosted.

## How We Work

This is an iterative build across multiple sessions. Each session should leave the demo in a shippable state, even if incomplete. No session should end with broken builds or half-finished features.

**Principles:**

- **Product thinking over engineering.** Every screen, interaction, and piece of copy should reveal a deliberate product decision. The demo is a product argument, not a code sample.
- **Show depth on one thing, breadth on the rest.** Go deep on one agent's full progression experience. Show breadth through the marketplace and team views. Don't spread effort evenly.
- **Feel like Anthropic.** The aesthetic should read as "this could ship as a Claude feature." Reference Claude.ai's design language. This is not a hackathon project.
- **Confidence over completeness.** It's better to have 3 polished screens than 7 rough ones. If something isn't ready, cut it rather than ship it janky.
- **Interactive, not just visual.** The reviewer should click, provide input, and see the system respond. Static mockups don't satisfy the prompt.
- **Presentation-ready.** The demo will be shown on a projector or screenshare during a 60-minute on-site. Design for generous typography, high contrast, and natural stopping points for narration. The x-ray mode is load-bearing for the Technical Design Discussion with the EM.
- **Honest about its boundaries.** The gap between prototype and production should be visible, not hidden. The EM will probe for judgment about what's hard. Transparency about what's simulated, paired with clear opinions about what real implementation requires, is stronger than hiding the seams.

## Constraints

- **Stack:** Next.js (App Router), TypeScript, Tailwind, shadcn/ui, Vercel.
- **Vercel team:** james-heaths-projects (team ID: team_kKIZp9h6LYSQsNrpISNWAbcb)
- **Repo:** New GitHub repo under jamesstineheath org
- **No real backend.** Demo state lives in memory or localStorage. Resets on refresh are fine.
- **No real integrations.** Calendar data, contacts, etc. are simulated. The demo demonstrates the product concept, not API plumbing.
- **Publicly hosted.** Must be accessible via a URL with no login required.
- **Time-boxed.** This is a take-home, not a startup. Scope aggressively.

## Key Design Decisions

These were debated and decided during project planning:

**Calendaring is the deep agent.** Not because it's novel, but because progressive trust is self-evident in scheduling. Everyone immediately understands why an AI shouldn't reschedule your meeting with your boss before it understands your priorities. The competitor comparison (Reclaim, Motion) becomes an asset: those tools skip the trust-building, which is exactly the mistake this product addresses.

**The demo has three layers.** Layer 1: the platform (marketplace, agent roster, the system). Layer 2: the deep agent (calendaring, full interactive progression). Layer 3: emergent value (a glimpse of cross-agent collaboration and the "Chief of Staff" endgame). Layer 3 can be lightweight, but it must exist. It's what turns "nice feature" into "this is a platform."

**X-ray mode shows the model layer.** A toggle or persistent panel that visualizes what's happening under the hood alongside the consumer experience: context retrieval, confidence scoring, system prompt at current trust level, why capabilities are locked/unlocked. This differentiates the demo from a product pitch into a systems-thinking demonstration. It also naturally showcases the capability prediction. The x-ray view should enrich the experience, not interrupt it. It is the primary artifact for the Technical Design Discussion with the EM.

**Progressive trust, not gamification.** The progression should feel like a relationship deepening, not a character leveling up. Avoid gaming metaphors (XP, unlocks, achievements) that would read as engagement dark patterns to an Anthropic audience. Frame levels as "trust stages" or similar. The tone is safety-aligned, not dopamine-loop-aligned.

## Scoping Decisions

**Navigation: hybrid guided-then-explore.** The demo opens with a short guided walkthrough (60-90 seconds) that ensures the reviewer hits every key moment: the marketplace, adding an agent, a level-up, the x-ray view, and the cross-agent glimpse. After the walkthrough, the reviewer is dropped into the full product to explore freely. The guided path also serves as the presenter-led walkthrough for the on-site. It should have natural pause points for narration.

**Chat interaction: scripted responses, with live API as a stretch goal.** The calendaring agent's chat uses pre-written response trees. This keeps the demo fast, fully controlled, and buildable. If time allows, upgrade to live Claude API calls with a system prompt constraining the agent to its current trust level. The scripted version must be good enough to ship as the final demo.

**Trust levels: 5 stages with internal gradients, all interactive.** The full arc from first interaction to autonomous coordination. Each stage should feel meaningfully different from the last, with clear capability jumps and visible context growth. Within each stage, autonomy has gradients: low-stakes actions happen freely, high-stakes actions require confirmation. Trust is continuous, not discrete. Onboarding (Stage 0) is explicit: the agent introduces itself, explains its limitations, and asks smart bootstrapping questions that immediately improve the next interaction. This is the centerpiece, so it justifies the investment.

The stages: Stage 0 (Onboarding), Stage 1 (General Assistant), Stage 2 (Personal Advisor), Stage 3 (Active Analyst), Stage 4 (Proactive Partner), Stage 5 (Trusted Delegate). Details will be refined during building, but the arc is: prove competence on generic tasks, learn preferences, analyze real data, make cross-domain proactive suggestions, act autonomously within explicit boundaries.

**Every agent has a work surface, not just a chat.** The Calendaring agent's work surface is a fully functional calendar UI with year, month, week, 3-day, day, and agenda views, plus event creation and editing. The agent's suggestions, analysis, and actions materialize on this surface, not just in chat. The chat/interaction layer sits alongside the work surface. This is a critical architectural signal: every agent in the marketplace would have its own domain-appropriate work surface (the Fitness Coach has a workout log, the Spending Tracker has a transaction feed). Only the Calendaring work surface needs to be built for the demo, but the concept should be visible in the agent card designs and describable during the on-site. Calendar features should be prioritized by whether they serve the trust narrative (agent suggesting a reschedule with reasoning > drag-to-reschedule).

## Agent Marketplace Roster

Informed by Anthropic's 81K global interview study (anthropic.com/features/81k-interviews). Categories are navigational (how a user finds what they need), not analytical. Calendaring is the only fully interactive agent in v1. All others are static cards that communicate platform breadth. If time permits, additional agents can be fleshed out.

**Daily Life:** Calendaring (deep agent), Grocery Shopper, Meal Planner, Home Maintenance, Errand Runner

**Health & Wellness:** Fitness Coach, Sleep Coach, Stress & Recovery, Symptom Tracker, Patient Advocate, Nutrition Tracker

**Money:** Spending Tracker, Bill Manager, Savings Coach, Investment Learner

**Relationships:** Friend Keeper, Date Night Planner, Gift Finder, Family Check-in

**Life Events:** Wedding Planner, New Parent Guide, Moving Coach, Pet Parent, Travel Planner

**Learning & Growth:** Study Partner, Book Coach, Career Advisor, Language Tutor

**Work:** Meeting Prep, Email Drafter, Focus Guard, Project Tracker

**Creative:** Writing Partner, Side Project Coach

33 agents across 8 categories. Each agent should have a name, one-sentence description, and an icon. Each card communicates what the agent does and why trust progression matters for that domain.

**Meta Agents (locked, shown separately with dependency maps):** Chief of Staff (requires Level 4+ in Calendaring, Spending Tracker, and Family Check-in, plus Level 3+ in two others), Life Coach (requires Level 3+ in at least 3 personal agents), Health Manager (requires Level 3+ in Fitness Coach, Sleep Coach, Symptom Tracker, Nutrition Tracker, and Stress & Recovery). Meta agents visually show which component agents feed into them and at what trust level. This single UI detail communicates the platform vision and the emergent value of the agent team.

## What to Avoid

- Over-engineering infrastructure that doesn't show in the demo
- Generic UI that could be any SaaS product (it should feel like Claude)
- Hand-wavy capabilities that sound impressive but aren't grounded
- Scope creep into features that don't serve the core argument
- Polish on low-leverage surfaces (e.g., a settings page) at the expense of the core experience
- Gaming metaphors or engagement patterns that conflict with Anthropic's brand
- Showing the technical layer in a way that feels canned or undermines credibility
- Hiding the prototype's limitations instead of having clear opinions about what production requires
