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
            style={{ height: "72px" }}
          >
            <span className="absolute -top-3 right-2 text-[10px] leading-none text-muted-foreground/60 bg-background px-0.5">
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
                  style={{ height: "72px" }}
                  onClick={() => onSlotClick(day, hour)}
                />
              ))}

              {/* Events overlay */}
              <div className="absolute inset-0 pointer-events-none">
                {(() => {
                  // Build positioned events with overlap columns
                  const positioned = dayEvents
                    .filter(e => !e.isDeclined)
                    .map(event => {
                      const startHour = getHours(event.start) + getMinutes(event.start) / 60;
                      const endHour = getHours(event.end) + getMinutes(event.end) / 60;
                      return { event, startHour, endHour };
                    })
                    .filter(e => e.startHour >= 7 && e.startHour <= 22);

                  // Detect collision groups
                  function assignColumns(events: typeof positioned) {
                    const columns: (typeof positioned[0])[][] = [];
                    for (const item of events) {
                      let placed = false;
                      for (const col of columns) {
                        const lastInCol = col[col.length - 1];
                        if (item.startHour >= lastInCol.endHour) {
                          col.push(item);
                          placed = true;
                          break;
                        }
                      }
                      if (!placed) columns.push([item]);
                    }
                    return columns;
                  }

                  // Find all overlapping groups
                  const result: Array<{ item: typeof positioned[0]; colIndex: number; totalCols: number }> = [];

                  // Sort by start time
                  const sorted = [...positioned].sort((a, b) => a.startHour - b.startHour);

                  // Group overlapping events
                  let i = 0;
                  while (i < sorted.length) {
                    // Find all events that overlap with current group
                    const group: typeof positioned = [sorted[i]];
                    let maxEnd = sorted[i].endHour;
                    let j = i + 1;
                    while (j < sorted.length && sorted[j].startHour < maxEnd) {
                      group.push(sorted[j]);
                      maxEnd = Math.max(maxEnd, sorted[j].endHour);
                      j++;
                    }

                    // Assign columns within group — cap at 2 to keep events readable
                    const cols = assignColumns(group);
                    const totalCols = Math.min(cols.length, 2);
                    cols.forEach((col, colIndex) => {
                      col.forEach(item => {
                        result.push({ item, colIndex: Math.min(colIndex, totalCols - 1), totalCols });
                      });
                    });

                    i = j;
                  }

                  // 72px per hour — must match the hour slot height above
                  const HOUR_PX = 72;
                  const TOTAL_PX = 15 * HOUR_PX; // 7am–10pm = 15 hours

                  return result.map(({ item, colIndex, totalCols }) => {
                    const { event, startHour, endHour } = item;
                    const topPx = (startHour - 7) * HOUR_PX;
                    const heightPx = Math.max((endHour - startHour) * HOUR_PX, 28);
                    const colors = getEventColors(event);
                    const widthPct = 100 / totalCols;
                    const leftPct = colIndex * widthPct;

                    return (
                      <div
                        key={event.id}
                        className={cn(
                          "absolute pointer-events-auto cursor-pointer rounded px-1.5 py-0.5 leading-snug overflow-hidden hover:brightness-95 transition-all",
                          colors.bg,
                          colors.text,
                          colors.darkBg,
                          colors.darkText,
                          event.isConflict && "ring-2 ring-red-500/60"
                        )}
                        style={{
                          top: `${(topPx / TOTAL_PX) * 100}%`,
                          height: `${(heightPx / TOTAL_PX) * 100}%`,
                          left: `calc(${leftPct}% + 1px)`,
                          width: `calc(${widthPct}% - 2px)`,
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick(event);
                        }}
                      >
                        <div className="font-medium truncate text-xs leading-tight">{event.title}</div>
                      </div>
                    );
                  });
                })()}

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
