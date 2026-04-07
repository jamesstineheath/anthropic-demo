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

// Source-based colors — Anthropic palette: warm, opaque, clean blocks
export const CALENDAR_SOURCE_COLORS: Record<
  CalendarSource,
  { bg: string; text: string; border: string; darkBg: string; darkText: string }
> = {
  work: {
    bg: "bg-[#F3E8E0]",
    text: "text-[#8B5E3C]",
    border: "border-[#E5D1C1]",
    darkBg: "dark:bg-[#3D2B1F]",
    darkText: "dark:text-[#D4A574]",
  },
  personal: {
    bg: "bg-[#E4EDE4]",
    text: "text-[#3D6B4F]",
    border: "border-[#C8DBC8]",
    darkBg: "dark:bg-[#1F3D2B]",
    darkText: "dark:text-[#8BB89E]",
  },
  chenFam: {
    bg: "bg-[#E0EAF0]",
    text: "text-[#3B6280]",
    border: "border-[#C4D6E4]",
    darkBg: "dark:bg-[#1F2F3D]",
    darkText: "dark:text-[#7BA8C8]",
  },
  family: {
    bg: "bg-[#F0E8E0]",
    text: "text-[#946B4A]",
    border: "border-[#E0D0C0]",
    darkBg: "dark:bg-[#3D2F1F]",
    darkText: "dark:text-[#C8A07A]",
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

// ── Daily anchors (every weekday) ──────────────────────────────────────
function generateDailyAnchors(weekStart: Date, weekOffset: number): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const isCurrent = weekOffset === 0;

  for (let d = 0; d < 5; d++) {
    const day = addDays(weekStart, d);
    const isMonTueWed = d < 3;
    const isTue = d === 1;
    const isThu = d === 3;
    const isGymDay = isTue || isThu;

    // Walk Copper 7:00–7:30 (skip gym days — gym replaces the walk)
    if (!isGymDay) {
      const walker = isCurrent && isMonTueWed ? "Alex" : d % 2 === 0 ? "Alex" : "Sarah";
      events.push(
        evt(
          `Walk Copper${walker === "Sarah" ? " (Sarah)" : ""}`,
          time(day, 7, 0),
          time(day, 7, 30),
          "personal",
          "personal",
          { isRecurring: true }
        )
      );
    }

    // Daycare drop-off 8:00–8:30
    events.push(
      evt(
        `Daycare drop-off${isCurrent && isMonTueWed ? "" : d % 2 === 1 ? " (Sarah)" : ""}`,
        time(day, 8, 0),
        time(day, 8, 30),
        "personal",
        "personal",
        { isRecurring: true }
      )
    );

    // Commute in 8:30–9:00
    events.push(
      evt("Commute in", time(day, 8, 30), time(day, 9, 0), "work", "work", {
        isRecurring: true,
        description: "Podcast / phone calls",
      })
    );

    // Commute home 4:30–5:00
    events.push(
      evt("Commute home", time(day, 16, 30), time(day, 17, 0), "work", "work", {
        isRecurring: true,
      })
    );

    // Family time 5:00–7:00
    events.push(
      evt("Family time", time(day, 17, 0), time(day, 19, 0), "personal", "personal", {
        isRecurring: true,
        description: "Protected — no meetings",
      })
    );
  }

  return events;
}

// ── Work events ─────────────────────────────────────────────────────────
function generateWorkEvents(weekStart: Date, weekOffset: number): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const mon = weekStart;
  const tue = addDays(weekStart, 1);
  const wed = addDays(weekStart, 2);
  const thu = addDays(weekStart, 3);
  const fri = addDays(weekStart, 4);
  const isCurrent = weekOffset === 0;
  const isEvenWeek = weekOffset % 2 === 0;

  // ── Monday ──────────────────────────────────────────────────────────
  events.push(
    evt("Team standup", time(mon, 9, 0), time(mon, 9, 30), "work", "work", {
      isRecurring: true,
    })
  );
  events.push(
    evt("Focus block", time(mon, 10, 0), time(mon, 11, 30), "work", "work", {
      description: "DNS — Do Not Schedule",
    })
  );
  events.push(
    evt("1:1 with Maya", time(mon, 11, 30), time(mon, 12, 0), "work", "work", {
      isRecurring: true,
      attendees: ["Maya"],
    })
  );
  events.push(
    evt("Product review", time(mon, 13, 0), time(mon, 14, 0), "work", "work", {
      isRecurring: true,
      attendees: ["Product team"],
    })
  );
  events.push(
    evt("1:1 with Kristen", time(mon, 14, 0), time(mon, 14, 30), "work", "work", {
      isRecurring: true,
      attendees: ["Kristen"],
    })
  );
  events.push(
    evt("Eng leadership sync", time(mon, 15, 0), time(mon, 16, 0), "work", "work", {
      isRecurring: true,
      attendees: ["Eng leads"],
    })
  );

  // ── Tuesday ─────────────────────────────────────────────────────────
  events.push(
    evt("Team standup", time(tue, 9, 0), time(tue, 9, 30), "work", "work", {
      isRecurring: true,
    })
  );
  events.push(
    evt("1:1 with Lena (manager)", time(tue, 10, 0), time(tue, 10, 30), "work", "work", {
      isRecurring: true,
      attendees: ["Lena"],
    })
  );
  events.push(
    evt("Platform architecture", time(tue, 10, 30), time(tue, 11, 30), "work", "work", {
      isRecurring: true,
      attendees: ["Infra team"],
    })
  );
  events.push(
    evt("Lunch with colleague", time(tue, 12, 0), time(tue, 12, 30), "social", "work", {
      attendees: ["Ravi"],
    })
  );
  events.push(
    evt("Design review", time(tue, 13, 0), time(tue, 14, 0), "work", "work", {
      attendees: ["Design team"],
    })
  );
  events.push(
    evt("Sprint planning", time(tue, 14, 0), time(tue, 15, 0), "work", "work", {
      isRecurring: true,
    })
  );
  events.push(
    evt("1:1 with Priya", time(tue, 15, 0), time(tue, 15, 30), "work", "work", {
      isRecurring: true,
      attendees: ["Priya"],
    })
  );

  // ── Wednesday (deep focus day) ──────────────────────────────────────
  events.push(
    evt("Focus block", time(wed, 9, 0), time(wed, 11, 0), "work", "work", {
      description: "Protected deep work — no meetings",
    })
  );
  events.push(
    evt("All-hands", time(wed, 11, 0), time(wed, 12, 0), "work", "work", {
      isRecurring: true,
      attendees: ["Company"],
    })
  );
  events.push(
    evt("Focus block", time(wed, 13, 0), time(wed, 15, 0), "work", "work", {
      description: "Protected deep work",
    })
  );
  events.push(
    evt("1:1 with Annelise", time(wed, 15, 0), time(wed, 15, 30), "work", "work", {
      isRecurring: true,
      attendees: ["Annelise"],
    })
  );
  // Declined — respecting no-meeting Wednesday
  events.push(
    evt("Software design weekly", time(wed, 13, 0), time(wed, 14, 0), "work", "work", {
      isRecurring: true,
      isDeclined: true,
      description: "Auto-declined — focus day",
    })
  );

  // ── Thursday (densest day) ──────────────────────────────────────────
  events.push(
    evt("Team standup", time(thu, 9, 0), time(thu, 9, 30), "work", "work", {
      isRecurring: true,
    })
  );
  events.push(
    evt("Strategy session", time(thu, 10, 0), time(thu, 11, 0), "work", "work", {
      isRecurring: true,
      attendees: ["Leadership"],
    })
  );
  events.push(
    evt("1:1 with Jordan", time(thu, 11, 0), time(thu, 11, 30), "work", "work", {
      isRecurring: true,
      attendees: ["Jordan"],
    })
  );
  events.push(
    evt("Eng review", time(thu, 13, 0), time(thu, 14, 0), "work", "work", {
      isRecurring: true,
      attendees: ["Eng team"],
    })
  );
  events.push(
    evt("OKR check-in", time(thu, 14, 0), time(thu, 14, 30), "work", "work", {
      isRecurring: true,
    })
  );
  events.push(
    evt("Cross-functional sync", time(thu, 15, 0), time(thu, 16, 0), "work", "work", {
      isRecurring: true,
      attendees: ["PM, Eng, Design"],
    })
  );
  // Dentist (current week only)
  if (isCurrent) {
    events.push(
      evt("Dentist", time(thu, 12, 0), time(thu, 13, 0), "health", "personal", {
        description: "Routine cleaning",
      })
    );
  }

  // ── Friday (lighter) ───────────────────────────────────────────────
  events.push(
    evt("Team standup", time(fri, 9, 0), time(fri, 9, 30), "work", "work", {
      isRecurring: true,
    })
  );
  events.push(
    evt("Focus block", time(fri, 10, 0), time(fri, 12, 0), "work", "work", {
      description: "Protected deep work",
    })
  );
  events.push(
    evt("Team retro", time(fri, 13, 0), time(fri, 14, 0), "work", "work", {
      isRecurring: true,
    })
  );
  events.push(
    evt("Weekly wrap-up", time(fri, 14, 0), time(fri, 14, 30), "work", "work", {
      isRecurring: true,
    })
  );
  // Demo Fridays (often declined)
  events.push(
    evt("Demo Fridays", time(fri, 15, 0), time(fri, 16, 0), "work", "work", {
      isRecurring: true,
      isDeclined: weekOffset !== 1,
      description: "Optional — usually declined",
    })
  );

  // ── Health / fitness ────────────────────────────────────────────────
  events.push(
    evt("Gym", time(tue, 7, 0), time(tue, 7, 30), "health", "personal", {
      isRecurring: true,
    })
  );
  events.push(
    evt("Gym", time(thu, 7, 0), time(thu, 7, 30), "health", "personal", {
      isRecurring: true,
    })
  );

  // ── Biweekly extras ─────────────────────────────────────────────────
  if (isEvenWeek) {
    events.push(
      evt("Skip-level with VP", time(mon, 16, 0), time(mon, 16, 30), "work", "work", {
        isRecurring: true,
        attendees: ["VP Eng"],
      })
    );
    events.push(
      evt("Hiring debrief", time(thu, 11, 30), time(thu, 12, 0), "work", "work", {
        attendees: ["Recruiting"],
      })
    );
  }

  return events;
}

// ── Chen Fam events ─────────────────────────────────────────────────────
function generateChenFamEvents(weekStart: Date, weekOffset: number): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const mon = weekStart;
  const wed = addDays(weekStart, 2);
  const isCurrent = weekOffset === 0;

  for (let d = 0; d < 5; d++) {
    const day = addDays(weekStart, d);
    // Bath time 7:00–7:30pm
    events.push(
      evt("Bath time", time(day, 19, 0), time(day, 19, 30), "personal", "chenFam", {
        isRecurring: true,
      })
    );
  }

  // Monday chores
  events.push(
    evt("Trash night", time(mon, 20, 0), time(mon, 20, 30), "personal", "chenFam", {
      isRecurring: true,
    })
  );

  // Wednesday cleaners (happens while working from home)
  events.push(
    evt("Cleaners", time(wed, 12, 0), time(wed, 13, 0), "personal", "chenFam", {
      isRecurring: true,
    })
  );

  return events;
}

// ── Family calendar events ──────────────────────────────────────────────
function generateFamilyEvents(weekStart: Date, weekOffset: number): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const sat = addDays(weekStart, 5);
  const sun = addDays(weekStart, 6);

  // Saturday kids class
  events.push(
    evt("Gymnastics (Emma)", time(sat, 10, 0), time(sat, 11, 0), "personal", "family", {
      isRecurring: true,
    })
  );

  // Sunday family dinner
  events.push(
    evt("Family dinner", time(sun, 18, 0), time(sun, 19, 0), "social", "family", {
      isRecurring: true,
    })
  );

  // Date night (not current week — anniversary conflict)
  if (weekOffset !== 0) {
    events.push(
      evt("Date night", time(sat, 19, 0), time(sat, 21, 0), "social", "family", {
        attendees: ["Sarah"],
      })
    );
  }

  return events;
}

// ── Week 0 specials (current week) ──────────────────────────────────────
function generateWeek0Specials(weekStart: Date): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const mon = weekStart;
  const tue = addDays(weekStart, 1);
  const wed = addDays(weekStart, 2);
  const fri = addDays(weekStart, 4);

  // Sarah traveling Mon–Wed
  for (let d = 0; d < 3; d++) {
    const day = addDays(mon, d);
    events.push(
      evt("Sarah traveling", time(day, 0, 0), time(day, 23, 59), "personal", "chenFam", {
        description: "Solo parenting — all pickups on Alex",
      })
    );
  }

  // Anniversary (Tuesday)
  events.push(
    evt("Anniversary ❤️", time(tue, 0, 0), time(tue, 23, 59), "social", "chenFam", {
      description: "Wedding anniversary",
    })
  );

  // CONFLICT: Product strategy review Tue 6:30–7:30pm
  events.push(
    evt("Product strategy review", time(tue, 18, 30), time(tue, 19, 30), "work", "work", {
      isConflict: true,
      attendees: ["Azita", "Product team"],
      description: "Conflicts with anniversary + family time",
    })
  );

  // Oliver month birthday (Wednesday)
  events.push(
    evt("Oliver month birthday 🎂", time(wed, 0, 0), time(wed, 23, 59), "social", "family", {
      description: "Monthly milestone",
    })
  );

  // Sarah lands Wed night
  events.push(
    evt("Sarah lands SAN→SFO", time(wed, 21, 30), time(wed, 22, 0), "personal", "chenFam")
  );

  // Friday: early pickup
  events.push(
    evt("Early pickup (Oliver)", time(fri, 14, 30), time(fri, 17, 0), "personal", "chenFam", {
      description: "Alex primary childcare",
    })
  );

  return events;
}

// ── Week +1 specials ────────────────────────────────────────────────────
function generateWeekPlusOneSpecials(weekStart: Date): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const mon = weekStart;
  const fri = addDays(weekStart, 4);

  events.push(
    evt("Tax check-in with Dad", time(mon, 15, 30), time(mon, 16, 0), "personal", "personal", {
      description: "Annual tax review call",
    })
  );

  events.push(
    evt("Dinner with friends", time(fri, 19, 0), time(fri, 21, 0), "social", "personal", {
      attendees: ["Chris", "Michelle"],
    })
  );

  return events;
}

export function generateSimulatedEvents(): CalendarEvent[] {
  _id = 1;
  const now = new Date();
  const thisWeekStart = startOfWeek(now, { weekStartsOn: 1 });
  const events: CalendarEvent[] = [];

  for (let weekOffset = -1; weekOffset <= 1; weekOffset++) {
    const ws = addWeeks(thisWeekStart, weekOffset);
    events.push(
      ...generateDailyAnchors(ws, weekOffset),
      ...generateWorkEvents(ws, weekOffset),
      ...generateChenFamEvents(ws, weekOffset),
      ...generateFamilyEvents(ws, weekOffset)
    );
  }

  events.push(...generateWeek0Specials(thisWeekStart));
  events.push(...generateWeekPlusOneSpecials(addWeeks(thisWeekStart, 1)));

  return events;
}
