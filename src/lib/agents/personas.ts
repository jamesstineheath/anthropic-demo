import { AGENTS, META_AGENTS, type Agent } from "./data";

export interface Persona {
  id: string;
  name: string;
  shortBio: string;
  avatar: string;
  location: string;
  role: string;
  context: string[];
  recommendedAgents: string[];
  metaAgents: string[];
  isInteractive: boolean;
}

export const PERSONAS: Persona[] = [
  {
    id: "james",
    name: "Alex",
    shortBio: "Product Manager, Bay Area. Partner, 3 kids, dog.",
    avatar: "A",
    location: "Marin County, CA",
    role: "Hardware/Software PM at Mill",
    context: [
      "Manages 7 calendars across work, family, nanny, and household",
      "3 kids including a toddler in daycare, partner Sarah",
      "In office Mon/Tue/Thu, home Wed/Fri",
      "Hard boundary: Dad mode 5-7:30pm daily",
    ],
    recommendedAgents: [
      "calendaring",
      "meal-planner",
      "grocery-shopper",
      "fitness-coach",
      "sleep-coach",
      "spending-tracker",
      "friend-keeper",
      "date-night-planner",
      "meeting-prep",
      "email-drafter",
      "focus-guard",
      "home-maintenance",
      "pet-parent",
    ],
    metaAgents: ["chief-of-staff", "life-coach"],
    isInteractive: true,
  },
  {
    id: "priya",
    name: "Priya",
    shortBio: "Grad student, Chicago. Dissertation year, teaching assistant.",
    avatar: "P",
    location: "Chicago, IL",
    role: "PhD Candidate, Computer Science",
    context: [
      "Dissertation defense in 6 months",
      "Teaching assistant for 2 undergrad courses",
      "Long-distance relationship, partner in NYC",
      "Training for first marathon",
    ],
    recommendedAgents: [
      "calendaring",
      "study-partner",
      "fitness-coach",
      "sleep-coach",
      "career-advisor",
      "friend-keeper",
      "spending-tracker",
      "savings-coach",
      "writing-partner",
      "meal-planner",
      "focus-guard",
    ],
    metaAgents: ["life-coach"],
    isInteractive: false,
  },
  {
    id: "marcus",
    name: "Marcus",
    shortBio: "Freelance designer, Austin. Recently divorced, shared custody.",
    avatar: "M",
    location: "Austin, TX",
    role: "Independent UX Designer",
    context: [
      "Freelance with 4-5 active clients",
      "Shared custody of 2 kids (ages 7 and 10), alternating weeks",
      "Managing business finances and quarterly taxes",
      "Trying to date again and rebuild social life",
    ],
    recommendedAgents: [
      "calendaring",
      "spending-tracker",
      "bill-manager",
      "savings-coach",
      "project-tracker",
      "email-drafter",
      "friend-keeper",
      "date-night-planner",
      "fitness-coach",
      "meal-planner",
      "focus-guard",
      "side-project-coach",
    ],
    metaAgents: ["chief-of-staff"],
    isInteractive: false,
  },
];

export function getPersonaById(id: string): Persona | undefined {
  return PERSONAS.find((p) => p.id === id);
}

export function getPersonaAgents(persona: Persona): Agent[] {
  return persona.recommendedAgents
    .map((id) => AGENTS.find((a) => a.id === id))
    .filter((a): a is Agent => a !== undefined);
}

export function getPersonaMetaAgents(persona: Persona): Agent[] {
  return persona.metaAgents
    .map((id) => META_AGENTS.find((a) => a.id === id))
    .filter((a): a is Agent => a !== undefined);
}

export const DEFAULT_PERSONA_ID = "james";
