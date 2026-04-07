"use client";

import { format, isToday } from "date-fns";
import { useCalendar } from "@/components/providers/calendar-provider";
import { getWeekDays } from "@/lib/calendar/utils";
import { TimeGrid } from "./time-grid";
import { cn } from "@/lib/utils";
import type { CalendarEvent } from "@/lib/calendar/data";

interface WeekViewProps {
  onEventClick: (event: CalendarEvent) => void;
  onSlotClick: (date: Date, hour: number) => void;
}

export function WeekView({ onEventClick, onSlotClick }: WeekViewProps) {
  const { currentDate } = useCalendar();
  // Show Mon–Fri only (5 days) for readability in the split-view layout
  const days = getWeekDays(currentDate).slice(0, 5);

  return (
    <div className="flex h-full flex-col">
      {/* Day headers */}
      <div className="flex shrink-0 border-b border-border">
        <div className="w-14 shrink-0" />
        <div className="flex flex-1">
          {days.map((day, i) => {
            const today = isToday(day);
            return (
              <div
                key={i}
                className={cn(
                  "flex-1 border-r border-border last:border-r-0 px-2 py-2 text-center",
                )}
              >
                <div className="text-xs uppercase tracking-wide text-muted-foreground">
                  {format(day, "EEE")}
                </div>
                <div
                  className={cn(
                    "mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium",
                    today
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground"
                  )}
                >
                  {format(day, "d")}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Time grid */}
      <div className="flex-1 overflow-y-auto">
        <TimeGrid
          days={days}
          onEventClick={onEventClick}
          onSlotClick={onSlotClick}
        />
      </div>
    </div>
  );
}
