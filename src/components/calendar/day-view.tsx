"use client";

import { format, isToday } from "date-fns";
import { useCalendar } from "@/components/providers/calendar-provider";
import { TimeGrid } from "./time-grid";
import { cn } from "@/lib/utils";
import type { CalendarEvent } from "@/lib/calendar/data";

interface DayViewProps {
  onEventClick: (event: CalendarEvent) => void;
  onSlotClick: (date: Date, hour: number) => void;
}

export function DayView({ onEventClick, onSlotClick }: DayViewProps) {
  const { currentDate } = useCalendar();
  const today = isToday(currentDate);

  return (
    <div className="flex h-full flex-col">
      <div className="flex shrink-0 border-b border-border">
        <div className="w-14 shrink-0" />
        <div className="flex-1 px-2 py-2 text-center">
          <div className="text-xs uppercase text-muted-foreground">
            {format(currentDate, "EEEE")}
          </div>
          <div
            className={cn(
              "mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full text-sm font-medium",
              today ? "bg-primary text-primary-foreground" : "text-foreground"
            )}
          >
            {format(currentDate, "d")}
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <TimeGrid
          days={[currentDate]}
          onEventClick={onEventClick}
          onSlotClick={onSlotClick}
        />
      </div>
    </div>
  );
}
