import {
  startOfWeek,
  addDays,
  setHours,
  setMinutes,
  addWeeks,
} from "date-fns";

export type EventCategory = "work" | "personal" | "health" | "social";
export type CalendarSource = "work" | "personal" | "chenFam" | "family";

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  category: EventCategory;
  calendarSource: CalendarSource;
  description?: string;
  attendees?: string[];
  isRecurring?: boolean;
  isConflict?: boolean;
  isDeclined?: boolean;
}

// Legacy color map (kept for compatibility)
export const EVENT_CATEGORY_COLORS: Record<
  EventCategory,
  { bg: string; text: string; border: string; darkBg: string; darkText: string }
> = {
  work: {
    bg: "bg-blue-100/80",
    text: "text-blue-800",
    border: "border-blue-200",
    darkBg: "dark:bg-blue-900/30",
    darkText: "dark:text-blue-300",
  },
  personal: {
    bg: "bg-orange-100/80",
    text: "text-orange-800",
    border: "border-orange-200",
    darkBg: "dark:bg-orange-900/30",
    darkText: "dark:text-orange-300",
  },
  health: {
    bg: "bg-emerald-100/80",
    text: "text-emerald-800",
    border: "border-emerald-200",
    darkBg: "dark:bg-emerald-900/30",
    darkText: "dark:text-emerald-300",
  },
  social: {
    bg: "bg-purple-100/80",
    text: "text-purple-800",
    border: "border-purple-200",
    darkBg: "dark:bg-purple-900/30",
    darkText: "dark:text-purple-300",
  },
};

// Source-based colors (primary for multi-calendar display)
export const CALENDAR_SOURCE_COLORS: Record<
  CalendarSource,
  { bg: string; text: string; border: string; darkBg: string; darkText: string }
> = {
  work: {
    bg: "bg-rose-100/80",
    text: "text-rose-800",
    border: "border-rose-200",
    darkBg: "dark:bg-rose-900/30",
    darkText: "dark:text-rose-300",
  },
  personal: {
    bg: "bg-emerald-100/80",
    text: "text-emerald-800",
    border: "border-emerald-200",
    darkBg: "dark:bg-emerald-900/30",
    darkText: "dark:text-emerald-300",
  },
  chenFam: {
    bg: "bg-sky-100/80",
    text: "text-sky-800",
    border: "border-sky-200",
    darkBg: "dark:bg-sky-900/30",
    darkText: "dark:text-sky-300",
  },
  family: {
    bg: "bg-orange-100/80",
    text: "text-orange-800",
    border: "border-orange-200",
    darkBg: "dark:bg-orange-900/30",
    darkText: "dark:text-orange-300",
  },
};

export function getEventColors(event: CalendarEvent) {
  return CALENDAR_SOURCE_COLORS[event.calendarSource];
}

function time(base: Date, hour: number, minute: number = 0): Date {
  return setMinutes(setHours(base, hour), minute);
}

let _id = 1;
function evt(
  title: string,
  start: Date,
  end: Date,
  category: EventCategory,
  calendarSource: CalendarSource,
  opts?: Partial<CalendarEvent>
): CalendarEvent {
  return {
    id: `evt-${_id++}`,
    title,
    start,
    end,
    category,
    calendarSource,
    ...opts,
  };
}

// --- Personal anchors (every weekday) ---
function generatePersonalAnchors(weekStart: Date, weekOffset: number): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  // Week 0: Sarah in San Diego Mon-Wed, so Alex does all anchors
  // Other weeks: alternating (simplified)
  const isCurrent = weekOffset === 0;

  for (let d = 0; d < 5; d++) {
    const day = addDays(weekStart, d);
    const isMonTueWed = d < 3;

    // Walk Copper 7:00-7:30
    const dogWalker = isCurrent && isMonTueWed ? "Alex" : (d % 2 === 0 ? "Alex" : "Sarah");
    events.push(evt(
      `Walk Copper${dogWalker === "Sarah" ? " (Sarah)" : ""}`,
      time(day, 7, 0), time(day, 7, 30),
      "personal", "personal",
      { isRecurring: true, description: dogWalker === "Alex" ? undefined : "Sarah's turn" }
    ));

    // Preschool drop-off 8:00-8:30
    const dropOff = isCurrent && isMonTueWed ? "Alex" : (d % 2 === 0 ? "Alex" : "Sarah");
    events.push(evt(
      `Preschool drop-off${dropOff === "Sarah" ? " (Sarah)" : ""}`,
      time(day, 8, 0), time(day, 8, 30),
      "personal", "personal",
      { isRecurring: true }
    ));

    // Dad mode 5:00-7:30
    events.push(evt(
      "Dad mode",
      time(day, 17, 0), time(day, 19, 30),
      "personal", "personal",
      { isRecurring: true, description: "Non-negotiable family time" }
    ));
  }

  return events;
}

// --- Work events ---
function generateWorkEvents(weekStart: Date, weekOffset: number): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const mon = weekStart;
  const tue = addDays(weekStart, 1);
  const wed = addDays(weekStart, 2);
  const thu = addDays(weekStart, 3);
  const fri = addDays(weekStart, 4);
  const isCurrent = weekOffset === 0;
  const isEvenWeek = weekOffset % 2 === 0;

  // --- Monday (Office day) ---
  // Commute
  events.push(evt("Commute to Mill", time(mon, 8, 30), time(mon, 9, 15), "work", "work",
    { description: "Phone calls OK", isRecurring: true }));
  events.push(evt("Commute home", time(mon, 16, 30), time(mon, 17, 15), "work", "work",
    { description: "Phone calls OK", isRecurring: true }));
  // Focus block
  events.push(evt("Focus block", time(mon, 10, 0), time(mon, 11, 0), "work", "work",
    { description: "DNS — Do Not Schedule" }));
  // SW+XFN Weekly (declined)
  events.push(evt("SW+XFN Weekly", time(mon, 11, 30), time(mon, 12, 0), "work", "work",
    { isRecurring: true, isDeclined: true, description: "Auto-declined" }));
  // Maya 1:1 (biweekly)
  if (isEvenWeek) {
    events.push(evt("Alex x Maya 🔁", time(mon, 14, 0), time(mon, 14, 45), "work", "work",
      { isRecurring: true, attendees: ["Maya"] }));
  }
  // Kristen 1:1
  events.push(evt("Alex | Kristen weekly", time(mon, 15, 0), time(mon, 15, 45), "work", "work",
    { isRecurring: true, attendees: ["Kristen"] }));

  // --- Tuesday (Office day) ---
  // Commute
  events.push(evt("Commute to Mill", time(tue, 10, 30), time(tue, 11, 30), "work", "work",
    { description: "Phone calls OK", isRecurring: true }));
  events.push(evt("Commute home", time(tue, 15, 0), time(tue, 16, 0), "work", "work",
    { description: "Phone calls OK", isRecurring: true }));
  // Lena 1:1 (biweekly, opposite of Maya)
  if (isCurrent || !isEvenWeek) {
    events.push(evt("Lena / Alex 1:1", time(tue, 10, 0), time(tue, 11, 0), "work", "work",
      { isRecurring: true, attendees: ["Lena"] }));
  }
  // Biweekly LTV sync (declined)
  if (isEvenWeek || isCurrent) {
    events.push(evt("Biweekly LTV sync", time(tue, 11, 30), time(tue, 12, 0), "work", "work",
      { isRecurring: true, isDeclined: true }));
  }
  // Resi PM Extended
  events.push(evt("Resi PM Extended", time(tue, 14, 30), time(tue, 15, 0), "work", "work",
    { isRecurring: true, attendees: ["Product team"] }));
  // Walking 1:1 with Gaby
  if (isCurrent || weekOffset === 1) {
    events.push(evt("Walking 1:1 with Gaby", time(tue, 12, 30), time(tue, 13, 0), "work", "work",
      { attendees: ["Gaby"] }));
  }

  // --- Wednesday (Office day) ---
  // Commute
  events.push(evt("Commute to Mill", time(wed, 8, 30), time(wed, 9, 15), "work", "work",
    { description: "Phone calls OK", isRecurring: true }));
  events.push(evt("Commute home", time(wed, 16, 30), time(wed, 17, 15), "work", "work",
    { description: "Phone calls OK", isRecurring: true }));
  // AI @ Mill
  events.push(evt("AI @ Mill", time(wed, 10, 0), time(wed, 10, 30), "work", "work",
    { isRecurring: true, description: "Cross-functional AI sync" }));
  // Annelise 1:1
  events.push(evt("Annelise / Alex weekly", time(wed, 11, 30), time(wed, 12, 0), "work", "work",
    { isRecurring: true, attendees: ["Annelise"] }));
  // Focus / DNS block
  events.push(evt("Focus block (DNS)", time(wed, 13, 0), time(wed, 15, 0), "work", "work",
    { description: "Protected focus time — home day" }));
  // Declined meetings
  events.push(evt("Software Design Weekly", time(wed, 13, 0), time(wed, 14, 0), "work", "work",
    { isRecurring: true, isDeclined: true, description: "No Recurring Wed policy" }));
  if (weekOffset === 1) {
    events.push(evt("PM Monthly", time(wed, 14, 0), time(wed, 15, 0), "work", "work",
      { isRecurring: true, attendees: ["PM org"] }));
  }

  // --- Thursday (Office day, densest) ---
  // Commute
  events.push(evt("Commute to Mill", time(thu, 8, 30), time(thu, 9, 15), "work", "work",
    { description: "Phone calls OK", isRecurring: true }));
  events.push(evt("Commute home", time(thu, 16, 30), time(thu, 17, 15), "work", "work",
    { description: "Phone calls OK", isRecurring: true }));
  // Focus block
  events.push(evt("Focus block", time(thu, 10, 0), time(thu, 11, 0), "work", "work",
    { description: "DNS — Do Not Schedule" }));
  // Lena 1:1 (on Thu in current week per seed data)
  if (isCurrent) {
    events.push(evt("1:1 with Lena", time(thu, 11, 0), time(thu, 12, 0), "work", "work",
      { isRecurring: true, attendees: ["Lena"] }));
  }
  // Resi PM Extended (Thu too sometimes)
  events.push(evt("Resi PM Extended", time(thu, 14, 0), time(thu, 14, 30), "work", "work",
    { isRecurring: true }));
  // O2 Sustaining Core
  events.push(evt("O2 Sustaining Core", time(thu, 15, 0), time(thu, 15, 30), "work", "work",
    { isRecurring: true, attendees: ["O2 team"] }));

  // --- Friday (Home day, lightest) ---
  // SW Demo Fridays (often declined)
  events.push(evt("SW Demo Fridays", time(fri, 10, 0), time(fri, 11, 0), "work", "work",
    { isRecurring: true, isDeclined: weekOffset !== 1, description: "Usually declined" }));
  // Focus block
  events.push(evt("Focus block", time(fri, 9, 0), time(fri, 11, 0), "work", "work",
    { description: "Protected focus time — home day" }));
  // Draft round-up
  events.push(evt("Draft round-up", time(fri, 14, 0), time(fri, 14, 30), "work", "work",
    { isRecurring: true }));

  // --- Practical extras ---
  // Lunch with colleague (Tue)
  events.push(evt("Lunch with Sarah", time(tue, 12, 0), time(tue, 13, 0), "social", "work",
    { attendees: ["Sarah"], description: "Downtown poke spot" }));
  // Standup (Mon/Wed/Fri)
  events.push(evt("Team standup", time(mon, 9, 30), time(mon, 9, 45), "work", "work",
    { isRecurring: true }));
  events.push(evt("Team standup", time(wed, 9, 30), time(wed, 9, 45), "work", "work",
    { isRecurring: true }));
  events.push(evt("Team standup", time(fri, 9, 30), time(fri, 9, 45), "work", "work",
    { isRecurring: true }));
  // Dentist (Thu, current week only)
  if (isCurrent) {
    events.push(evt("Dentist appointment", time(thu, 13, 0), time(thu, 14, 0), "health", "personal",
      { description: "Dr. Park — routine cleaning" }));
  }
  // Gym / workout (Tue/Thu)
  events.push(evt("Gym", time(tue, 7, 0), time(tue, 7, 45), "health", "personal",
    { isRecurring: true, description: "Morning workout" }));
  events.push(evt("Gym", time(thu, 7, 0), time(thu, 7, 45), "health", "personal",
    { isRecurring: true, description: "Morning workout" }));

  return events;
}

// --- Chen Fam events ---
function generateChenFamEvents(weekStart: Date, weekOffset: number): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const mon = weekStart;
  const tue = addDays(weekStart, 1);
  const wed = addDays(weekStart, 2);
  const isCurrent = weekOffset === 0;

  for (let d = 0; d < 5; d++) {
    const day = addDays(weekStart, d);
    // Bath time 6:30pm
    events.push(evt("Bath time", time(day, 18, 30), time(day, 19, 0), "personal", "chenFam",
      { isRecurring: true }));
    // Daycare pickup 5:00pm
    events.push(evt("Daycare pickup", time(day, 17, 0), time(day, 17, 30), "personal", "chenFam",
      { isRecurring: true, description: isCurrent && d < 3 ? "Alex (Sarah traveling)" : undefined }));
  }

  // Monday chores
  events.push(evt("Trash night", time(mon, 20, 0), time(mon, 20, 30), "personal", "chenFam",
    { isRecurring: true }));
  events.push(evt("Water plants", time(mon, 20, 30), time(mon, 21, 0), "personal", "chenFam",
    { isRecurring: true }));

  // Wednesday cleaners
  events.push(evt("Cleaners", time(wed, 9, 0), time(wed, 10, 0), "personal", "chenFam",
    { isRecurring: true }));

  // Tuesday bath time (highlighted on anniversary week)
  if (isCurrent) {
    events.push(evt("Bath time (solo)", time(tue, 19, 30), time(tue, 20, 0), "personal", "chenFam",
      { description: "Sarah traveling — Alex solo" }));
  }

  return events;
}

// --- Family calendar events ---
function generateFamilyEvents(weekStart: Date, weekOffset: number): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const isCurrent = weekOffset === 0;
  const sat = addDays(weekStart, 5);
  const sun = addDays(weekStart, 6);

  // Weekend: Havdalah Sunday 6:15pm
  events.push(evt("Havdalah", time(sun, 18, 15), time(sun, 19, 0), "social", "family",
    { isRecurring: true }));

  // Saturday date night (when available)
  if (weekOffset !== 0) {
    events.push(evt("Date Night", time(sat, 19, 0), time(sat, 21, 30), "social", "family",
      { description: "Milla babysitting", attendees: ["Sarah"] }));
  }

  // Saturday gymnastics
  events.push(evt("Gymnastics (Emma)", time(sat, 10, 0), time(sat, 11, 0), "personal", "family",
    { isRecurring: true }));

  return events;
}

// --- Week 0 specials ---
function generateWeek0Specials(weekStart: Date): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const mon = weekStart;
  const tue = addDays(weekStart, 1);
  const wed = addDays(weekStart, 2);
  const fri = addDays(weekStart, 4);

  // Sarah in San Diego (Mon-Wed, all-day on chenFam)
  for (let d = 0; d < 3; d++) {
    const day = addDays(mon, d);
    events.push(evt("Sarah in San Diego", time(day, 0, 0), time(day, 23, 59), "personal", "chenFam",
      { description: "Solo parenting — all drop-offs/pickups on Alex" }));
  }

  // Anniversary (Tuesday, all-day on chenFam)
  events.push(evt("Anniversary ❤️", time(tue, 0, 0), time(tue, 23, 59), "social", "chenFam",
    { description: "Wedding anniversary" }));

  // DEMO CONFLICT: Product Strategy Review Tue 6:30-7:30pm
  events.push(evt("Product Strategy Review", time(tue, 18, 30), time(tue, 19, 30), "work", "work",
    { isConflict: true, attendees: ["Azita", "Product team"],
      description: "Conflicts with Anniversary + Dad mode. Agent should catch this." }));

  // Oliver month birthday (Wednesday, all-day on family)
  events.push(evt("Oliver month birthday 🎂", time(wed, 0, 0), time(wed, 23, 59), "social", "family",
    { description: "Monthly milestone" }));

  // Sarah lands Wed night
  events.push(evt("Sarah lands SAN→SFO", time(wed, 21, 30), time(wed, 22, 30), "personal", "chenFam",
    { description: "Back from San Diego" }));

  // Friday: Alex on Oliver (early pickup)
  events.push(evt("Alex on Oliver", time(fri, 14, 30), time(fri, 17, 0), "personal", "chenFam",
    { description: "Early pickup — Alex primary childcare" }));

  return events;
}

// --- Week +1 specials ---
function generateWeekPlusOneSpecials(weekStart: Date): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const mon = addDays(weekStart, 0);
  const fri = addDays(weekStart, 4);
  const sat = addDays(weekStart, 5);

  // Tax check-in with dad
  events.push(evt("Tax check-in with Dad", time(mon, 15, 30), time(mon, 16, 0), "personal", "personal",
    { description: "Annual tax review call" }));

  // Dinner with friends Friday
  events.push(evt("Dinner with Chris & Chelle", time(fri, 19, 0), time(fri, 21, 0), "social", "personal",
    { attendees: ["Chris", "Chelle"], description: "Milla babysitting" }));

  // Date night Saturday
  events.push(evt("Date Night", time(sat, 19, 0), time(sat, 21, 30), "social", "family",
    { description: "Milla babysitting", attendees: ["Sarah"] }));

  return events;
}

export function generateSimulatedEvents(): CalendarEvent[] {
  _id = 1; // Reset ID counter
  const now = new Date();
  const thisWeekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday
  const events: CalendarEvent[] = [];

  // Generate 3 weeks: week -1, week 0 (current), week +1
  for (let weekOffset = -1; weekOffset <= 1; weekOffset++) {
    const ws = addWeeks(thisWeekStart, weekOffset);
    events.push(
      ...generatePersonalAnchors(ws, weekOffset),
      ...generateWorkEvents(ws, weekOffset),
      ...generateChenFamEvents(ws, weekOffset),
      ...generateFamilyEvents(ws, weekOffset),
    );
  }

  // Week-specific specials
  events.push(...generateWeek0Specials(thisWeekStart));
  events.push(...generateWeekPlusOneSpecials(addWeeks(thisWeekStart, 1)));

  return events;
}
