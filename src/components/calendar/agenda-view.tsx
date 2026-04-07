"use client";

import { format, isSameDay, addDays, startOfDay } from "date-fns";
import { useCalendar } from "@/components/providers/calendar-provider";
import { getEventColors, type CalendarEvent } from "@/lib/calendar/data";
import { cn } from "@/lib/utils";

interface AgendaViewProps {
  onEventClick: (event: CalendarEvent) => void;
}

export function AgendaView({ onEventClick }: AgendaViewProps) {
  const { currentDate, events } = useCalendar();

  // Show 14 days from current date
  const days = Array.from({ length: 14 }, (_, i) => addDays(currentDate, i));

  const eventsByDay = days.map((day) => ({
    date: day,
    events: events
      .filter((e) => isSameDay(e.start, day) && !e.isDeclined)
      .sort((a, b) => a.start.getTime() - b.start.getTime()),
  }));

  return (
    <div className="divide-y divide-border overflow-y-auto">
      {eventsByDay.map(({ date, events: dayEvents }) => {
        if (dayEvents.length === 0) return null;
        return (
          <div key={date.toISOString()} className="flex gap-4 px-4 py-3">
            <div className="w-20 shrink-0 pt-0.5">
              <div className="text-xs uppercase text-muted-foreground">
                {format(date, "EEE")}
              </div>
              <div className="text-lg font-semibold text-foreground">
                {format(date, "d")}
              </div>
              <div className="text-xs text-muted-foreground">
                {format(date, "MMM")}
              </div>
            </div>
            <div className="flex-1 space-y-1.5">
              {dayEvents.map((event) => {
                const colors = getEventColors(event);
                return (
                  <div
                    key={event.id}
                    className={cn(
                      "rounded-lg border px-3 py-2 cursor-pointer transition-colors hover:opacity-80",
                      colors.bg,
                      colors.border,
                      colors.darkBg,
                      event.isConflict && "ring-1 ring-red-400/50"
                    )}
                    onClick={() => onEventClick(event)}
                  >
                    <div
                      className={cn(
                        "text-sm font-medium",
                        colors.text,
                        colors.darkText
                      )}
                    >
                      {event.title}
                    </div>
                    <div
                      className={cn(
                        "text-xs opacity-70",
                        colors.text,
                        colors.darkText
                      )}
                    >
                      {format(event.start, "h:mm a")} –{" "}
                      {format(event.end, "h:mm a")}
                    </div>
                    {event.description && (
                      <div
                        className={cn(
                          "mt-1 text-xs opacity-60",
                          colors.text,
                          colors.darkText
                        )}
                      >
                        {event.description}
                      </div>
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
