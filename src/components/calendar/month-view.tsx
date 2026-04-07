"use client";

import { format, isToday, isSameMonth, isSameDay } from "date-fns";
import { useCalendar } from "@/components/providers/calendar-provider";
import { getMonthDays, getEventsForDay } from "@/lib/calendar/utils";
import { getEventColors, type CalendarEvent } from "@/lib/calendar/data";
import { cn } from "@/lib/utils";

interface MonthViewProps {
  onEventClick: (event: CalendarEvent) => void;
  onDayClick: (date: Date) => void;
}

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function MonthView({ onEventClick, onDayClick }: MonthViewProps) {
  const { currentDate, events } = useCalendar();
  const days = getMonthDays(currentDate);

  return (
    <div className="flex h-full flex-col">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-border">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="px-2 py-2 text-center text-[10px] uppercase text-muted-foreground"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid flex-1 grid-cols-7 auto-rows-fr">
        {days.map((day, i) => {
          const today = isToday(day);
          const inMonth = isSameMonth(day, currentDate);
          const dayEvents = getEventsForDay(events, day);

          return (
            <div
              key={i}
              className={cn(
                "border-b border-r border-border p-1 cursor-pointer hover:bg-accent/30 min-h-[80px]",
                !inMonth && "opacity-30"
              )}
              onClick={() => onDayClick(day)}
            >
              <div
                className={cn(
                  "mb-1 flex h-6 w-6 items-center justify-center rounded-full text-xs",
                  today
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-foreground"
                )}
              >
                {format(day, "d")}
              </div>
              <div className="space-y-0.5">
                {dayEvents.filter(e => !e.isDeclined).slice(0, 3).map((event) => {
                  const colors = getEventColors(event);
                  return (
                    <div
                      key={event.id}
                      className={cn(
                        "truncate rounded px-1 py-px text-[9px] leading-tight cursor-pointer",
                        colors.bg,
                        colors.text,
                        colors.darkBg,
                        colors.darkText,
                        event.isConflict && "ring-1 ring-red-400/50"
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event);
                      }}
                    >
                      {event.title}
                    </div>
                  );
                })}
                {dayEvents.length > 3 && (
                  <div className="text-[9px] text-muted-foreground px-1">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
