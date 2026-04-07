import {
  format,
  isSameDay,
  isSameMonth,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  addDays,
  isToday,
  getHours,
  getMinutes,
  differenceInMinutes,
} from "date-fns";
import type { CalendarEvent } from "./data";

export type CalendarView =
  | "year"
  | "month"
  | "week"
  | "three-day"
  | "day"
  | "agenda";

export function getEventsForDay(
  events: CalendarEvent[],
  date: Date
): CalendarEvent[] {
  return events.filter((e) => isSameDay(e.start, date));
}

export function getEventsForRange(
  events: CalendarEvent[],
  start: Date,
  end: Date
): CalendarEvent[] {
  return events.filter((e) => e.start >= start && e.start <= end);
}

export function getMonthDays(date: Date): Date[] {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  return eachDayOfInterval({ start: calStart, end: calEnd });
}

export function getWeekDays(date: Date): Date[] {
  const weekStart = startOfWeek(date, { weekStartsOn: 1 });
  return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
}

export function getThreeDays(date: Date): Date[] {
  return [date, addDays(date, 1), addDays(date, 2)];
}

export function getEventPosition(event: CalendarEvent) {
  const startHour = getHours(event.start) + getMinutes(event.start) / 60;
  const durationMinutes = differenceInMinutes(event.end, event.start);
  const topPercent = ((startHour - 7) / 15) * 100; // 7am = 0%, 10pm = 100%
  const heightPercent = (durationMinutes / (15 * 60)) * 100;
  return { top: `${topPercent}%`, height: `${Math.max(heightPercent, 2)}%` };
}

export function formatEventTime(event: CalendarEvent): string {
  return `${format(event.start, "h:mm a")} – ${format(event.end, "h:mm a")}`;
}

export const HOURS = Array.from({ length: 15 }, (_, i) => i + 7); // 7am to 9pm
