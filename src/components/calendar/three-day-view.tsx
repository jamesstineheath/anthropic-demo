"use client";

import { format, isToday } from "date-fns";
import { useCalendar } from "@/components/providers/calendar-provider";
import { getThreeDays } from "@/lib/calendar/utils";
import { TimeGrid } from "./time-grid";
import { cn } from "@/lib/utils";
import type { CalendarEvent } from "@/lib/calendar/data";

interface ThreeDayViewProps {
  onEventClick: (event: CalendarEvent) => void;
  onSlotClick: (date: Date, hour: number) => void;
}

export function ThreeDayView({
  onEventClick,
  onSlotClick,
}: ThreeDayViewProps) {
  const { currentDate } = useCalendar();
  const days = getThreeDays(currentDate);

  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 border-b border-border">
        <div className="w-14 shrink-0" />
        <div className="flex flex-1">
          {days.map((day, i) => {
            const today = isToday(day);
            return (
              <div
                key={i}
                className="flex-1 border-r border-border last:border-r-0 px-2 py-2 text-center"
              >
                <div className="text-xs uppercase text-muted-foreground">
                  {format(day, "EEE")}
                </div>
                <div
                  className={cn(
                    "mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium",
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
