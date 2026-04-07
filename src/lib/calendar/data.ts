import {
  startOfWeek,
  addDays,
  setHours,
  setMinutes,
  addWeeks,
  nextMonday,
  nextTuesday,
  nextWednesday,
  nextThursday,
  nextFriday,
  nextSaturday,
  isBefore,
} from "date-fns";

export type EventCategory = "work" | "personal" | "health" | "social";

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  category: EventCategory;
  description?: string;
  isRecurring?: boolean;
  isConflict?: boolean;
}

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

function time(base: Date, hour: number, minute: number = 0): Date {
  return setMinutes(setHours(base, hour), minute);
}

// Get next occurrence of a weekday from a reference date
function getNextWeekday(ref: Date, day: 0 | 1 | 2 | 3 | 4 | 5 | 6): Date {
  const fns = [
    null, // Sunday - not used
    nextMonday,
    nextTuesday,
    nextWednesday,
    nextThursday,
    nextFriday,
    nextSaturday,
  ];
  const fn = fns[day];
  if (!fn) return ref;
  const next = fn(ref);
  return next;
}

export function generateSimulatedEvents(): CalendarEvent[] {
  const now = new Date();
  const thisWeekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday
  const events: CalendarEvent[] = [];
  let id = 1;

  // Generate 3 weeks of events: last week, this week, next week
  for (let weekOffset = -1; weekOffset <= 2; weekOffset++) {
    const weekStart = addWeeks(thisWeekStart, weekOffset);
    const mon = weekStart;
    const tue = addDays(weekStart, 1);
    const wed = addDays(weekStart, 2);
    const thu = addDays(weekStart, 3);
    const fri = addDays(weekStart, 4);
    const sat = addDays(weekStart, 5);

    // Daily standup (Mon-Fri)
    for (let d = 0; d < 5; d++) {
      const day = addDays(weekStart, d);
      events.push({
        id: `evt-${id++}`,
        title: "Team Standup",
        start: time(day, 9, 30),
        end: time(day, 9, 45),
        category: "work",
        isRecurring: true,
      });
    }

    // Monday
    events.push({
      id: `evt-${id++}`,
      title: "Sprint Planning",
      start: time(mon, 10, 0),
      end: time(mon, 11, 0),
      category: "work",
      isRecurring: true,
    });

    // Tuesday
    events.push({
      id: `evt-${id++}`,
      title: "1:1 with Sarah (Manager)",
      start: time(tue, 11, 0),
      end: time(tue, 11, 30),
      category: "work",
      isRecurring: true,
    });
    events.push({
      id: `evt-${id++}`,
      title: "Deep Work Block",
      start: time(tue, 13, 0),
      end: time(tue, 16, 0),
      category: "personal",
      description: "Focus time — no meetings",
    });

    // Wednesday
    events.push({
      id: `evt-${id++}`,
      title: "Writing Time",
      start: time(wed, 9, 0),
      end: time(wed, 11, 0),
      category: "personal",
      description: "Blog post / documentation",
    });
    events.push({
      id: `evt-${id++}`,
      title: "Design Review",
      start: time(wed, 14, 0),
      end: time(wed, 15, 0),
      category: "work",
    });

    // Thursday
    events.push({
      id: `evt-${id++}`,
      title: "Deep Work Block",
      start: time(thu, 13, 0),
      end: time(thu, 16, 0),
      category: "personal",
      description: "Focus time — no meetings",
    });

    // Friday
    events.push({
      id: `evt-${id++}`,
      title: "All-Hands",
      start: time(fri, 15, 0),
      end: time(fri, 16, 0),
      category: "work",
      isRecurring: true,
    });

    // Health - Gym MWF
    for (const day of [mon, wed, fri]) {
      events.push({
        id: `evt-${id++}`,
        title: "Gym",
        start: time(day, 7, 0),
        end: time(day, 8, 0),
        category: "health",
        isRecurring: true,
      });
    }

    // Social - Thursday dinner
    events.push({
      id: `evt-${id++}`,
      title: "Dinner with Alex & Jordan",
      start: time(thu, 19, 30),
      end: time(thu, 21, 0),
      category: "social",
    });

    // Saturday date night
    events.push({
      id: `evt-${id++}`,
      title: "Date Night",
      start: time(sat, 19, 0),
      end: time(sat, 21, 30),
      category: "social",
    });
  }

  // Add a few unique events in current and next week
  const thisWed = addDays(thisWeekStart, 2);
  const thisThu = addDays(thisWeekStart, 3);
  const nextTue = addDays(addWeeks(thisWeekStart, 1), 1);

  // Conflict: double-booking on Wednesday this week
  events.push({
    id: `evt-${id++}`,
    title: "Product Strategy Sync",
    start: time(thisWed, 14, 0),
    end: time(thisWed, 15, 0),
    category: "work",
    isConflict: true,
    description: "Conflicts with Design Review",
  });

  // Conflict: Thursday morning overlap
  events.push({
    id: `evt-${id++}`,
    title: "Investor Update Prep",
    start: time(thisThu, 9, 15),
    end: time(thisThu, 10, 0),
    category: "work",
    isConflict: true,
    description: "Overlaps with standup",
  });

  // Dentist next week
  events.push({
    id: `evt-${id++}`,
    title: "Dentist Appointment",
    start: time(nextTue, 14, 0),
    end: time(nextTue, 15, 0),
    category: "health",
  });

  // Coffee chat
  events.push({
    id: `evt-${id++}`,
    title: "Coffee with Maria",
    start: time(addDays(thisWeekStart, 4), 10, 0),
    end: time(addDays(thisWeekStart, 4), 10, 30),
    category: "social",
  });

  return events;
}
