"use client";

import { format, isToday, getHours, getMinutes } from "date-fns";
import { useCalendar } from "@/components/providers/calendar-provider";
import { getEventsForDay, HOURS } from "@/lib/calendar/utils";
import {
  getEventColors,
  type CalendarEvent,
} from "@/lib/calendar/data";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";

interface TimeGridProps {
  days: Date[];
  onEventClick: (event: CalendarEvent) => void;
  onSlotClick: (date: Date, hour: number) => void;
}

function CurrentTimeLine() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const hour = getHours(now) + getMinutes(now) / 60;
  if (hour < 7 || hour > 22) return null;
  const top = ((hour - 7) / 15) * 100;

  return (
    <div
      className="pointer-events-none absolute left-0 right-0 z-20"
      style={{ top: `${top}%` }}
    >
      <div className="flex items-center">
        <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
        <div className="h-px flex-1 bg-red-500" />
      </div>
    </div>
  );
}

export function TimeGrid({ days, onEventClick, onSlotClick }: TimeGridProps) {
  const { events } = useCalendar();

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Time labels column */}
      <div className="w-14 shrink-0 border-r border-border">
        {HOURS.map((hour) => (
          <div
            key={hour}
            className="relative border-b border-border"
            style={{ height: "60px" }}
          >
            <span className="absolute -top-2.5 right-2 text-[10px] text-muted-foreground/60">
              {hour === 12 ? "12 PM" : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
            </span>
          </div>
        ))}
      </div>

      {/* Day columns */}
      <div className="flex flex-1">
        {days.map((day, dayIdx) => {
          const dayEvents = getEventsForDay(events, day);
          const today = isToday(day);

          return (
            <div
              key={dayIdx}
              className={cn(
                "relative flex-1 border-r border-border last:border-r-0",
                today && "bg-primary/[0.02]"
              )}
            >
              {/* Hour slots */}
              {HOURS.map((hour) => (
                <div
                  key={hour}
                  className="border-b border-border hover:bg-accent/30 cursor-pointer"
                  style={{ height: "60px" }}
                  onClick={() => onSlotClick(day, hour)}
                />
              ))}

              {/* Events overlay */}
              <div className="absolute inset-0 pointer-events-none">
                {dayEvents.map((event) => {
                  const startHour =
                    getHours(event.start) + getMinutes(event.start) / 60;
                  const endHour =
                    getHours(event.end) + getMinutes(event.end) / 60;
                  if (startHour < 7 || startHour > 22) return null;
                  const top = ((startHour - 7) / 15) * 100;
                  const height = ((endHour - startHour) / 15) * 100;
                  if (event.isDeclined) return null;
                  const colors = getEventColors(event);

                  return (
                    <div
                      key={event.id}
                      className={cn(
                        "absolute left-0.5 right-0.5 pointer-events-auto cursor-pointer rounded-md border px-1.5 py-0.5 text-[10px] leading-tight overflow-hidden transition-opacity hover:opacity-90",
                        colors.bg,
                        colors.text,
                        colors.border,
                        colors.darkBg,
                        colors.darkText,
                        event.isConflict && "ring-1 ring-red-400/50"
                      )}
                      style={{
                        top: `${top}%`,
                        height: `${Math.max(height, 2.5)}%`,
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onEventClick(event);
                      }}
                    >
                      <div className="font-medium truncate">{event.title}</div>
                      {height > 4 && (
                        <div className="opacity-70 truncate">
                          {format(event.start, "h:mm a")}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Current time indicator */}
                {today && <CurrentTimeLine />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
