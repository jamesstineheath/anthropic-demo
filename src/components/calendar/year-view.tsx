"use client";

import {
  format,
  startOfYear,
  addMonths,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isToday,
  isSameDay,
} from "date-fns";
import { useCalendar } from "@/components/providers/calendar-provider";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];

export function YearView() {
  const { currentDate, events, setCurrentDate, setView } = useCalendar();
  const yearStart = startOfYear(currentDate);
  const months = Array.from({ length: 12 }, (_, i) => addMonths(yearStart, i));

  const eventDates = new Set(
    events.map((e) => format(e.start, "yyyy-MM-dd"))
  );

  return (
    <div className="grid grid-cols-3 gap-6 p-4 lg:grid-cols-4">
      {months.map((month) => {
        const monthStart = startOfMonth(month);
        const monthEnd = endOfMonth(month);
        const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
        const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
        const days = eachDayOfInterval({ start: calStart, end: calEnd });

        return (
          <div key={month.toISOString()}>
            <button
              className="mb-2 text-xs font-semibold text-foreground hover:text-primary"
              onClick={() => {
                setCurrentDate(month);
                setView("month");
              }}
            >
              {format(month, "MMMM")}
            </button>
            <div className="grid grid-cols-7 gap-px">
              {WEEKDAYS.map((d, i) => (
                <div
                  key={i}
                  className="text-center text-[8px] text-muted-foreground/50"
                >
                  {d}
                </div>
              ))}
              {days.map((day, i) => {
                const inMonth = isSameMonth(day, month);
                const today = isToday(day);
                const hasEvent = eventDates.has(format(day, "yyyy-MM-dd"));
                return (
                  <div
                    key={i}
                    className={cn(
                      "relative flex h-4 items-center justify-center text-[9px]",
                      !inMonth && "opacity-0"
                    )}
                  >
                    <span
                      className={cn(
                        today &&
                          "flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground text-[8px]"
                      )}
                    >
                      {format(day, "d")}
                    </span>
                    {hasEvent && !today && (
                      <div className="absolute bottom-0 left-1/2 h-0.5 w-0.5 -translate-x-1/2 rounded-full bg-primary/60" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
