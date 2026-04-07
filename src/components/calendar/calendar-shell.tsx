"use client";

import { useState } from "react";
import {
  format,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  addDays,
  subDays,
  addYears,
  subYears,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCalendar } from "@/components/providers/calendar-provider";
import type { CalendarView } from "@/lib/calendar/utils";
import type { CalendarEvent } from "@/lib/calendar/data";
import { WeekView } from "./week-view";
import { DayView } from "./day-view";
import { ThreeDayView } from "./three-day-view";
import { MonthView } from "./month-view";
import { YearView } from "./year-view";
import { AgendaView } from "./agenda-view";
import { EventPopover } from "./event-popover";
import { EventForm } from "./event-form";
import { cn } from "@/lib/utils";

const VIEWS: { value: CalendarView; label: string }[] = [
  { value: "year", label: "Year" },
  { value: "month", label: "Month" },
  { value: "week", label: "Week" },
  { value: "three-day", label: "3 Day" },
  { value: "day", label: "Day" },
  { value: "agenda", label: "Agenda" },
];

export function CalendarShell() {
  const { currentDate, setCurrentDate, view, setView } = useCalendar();
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(
    null
  );
  const [isEditing, setIsEditing] = useState(false);
  const [newEventSlot, setNewEventSlot] = useState<{
    date: Date;
    hour: number;
  } | null>(null);

  const navigate = (direction: "prev" | "next") => {
    const fn = direction === "next" ? 1 : -1;
    switch (view) {
      case "year":
        setCurrentDate(
          direction === "next"
            ? addYears(currentDate, 1)
            : subYears(currentDate, 1)
        );
        break;
      case "month":
        setCurrentDate(
          direction === "next"
            ? addMonths(currentDate, 1)
            : subMonths(currentDate, 1)
        );
        break;
      case "week":
        setCurrentDate(
          direction === "next"
            ? addWeeks(currentDate, 1)
            : subWeeks(currentDate, 1)
        );
        break;
      case "three-day":
        setCurrentDate(
          direction === "next"
            ? addDays(currentDate, 3)
            : subDays(currentDate, 3)
        );
        break;
      case "day":
      case "agenda":
        setCurrentDate(
          direction === "next"
            ? addDays(currentDate, 1)
            : subDays(currentDate, 1)
        );
        break;
    }
  };

  const getTitle = () => {
    switch (view) {
      case "year":
        return format(currentDate, "yyyy");
      case "month":
        return format(currentDate, "MMMM yyyy");
      case "week":
      case "three-day":
      case "day":
      case "agenda":
        return format(currentDate, "MMMM d, yyyy");
    }
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsEditing(false);
    setNewEventSlot(null);
  };

  const handleSlotClick = (date: Date, hour: number) => {
    setNewEventSlot({ date, hour });
    setSelectedEvent(null);
    setIsEditing(false);
  };

  const handleDayClick = (date: Date) => {
    setCurrentDate(date);
    setView("day");
  };

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-2">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs h-7"
            onClick={() => setCurrentDate(new Date())}
          >
            Today
          </Button>
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => navigate("prev")}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => navigate("next")}
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
          <span className="text-sm font-medium text-foreground">
            {getTitle()}
          </span>
        </div>

        {/* View switcher */}
        <div className="flex items-center rounded-lg border border-border bg-muted/30 p-0.5">
          {VIEWS.map((v) => (
            <button
              key={v.value}
              onClick={() => setView(v.value)}
              className={cn(
                "rounded-md px-2.5 py-1 text-sm font-medium transition-colors",
                view === v.value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar view */}
      <div className="relative flex-1 overflow-hidden">
        {view === "week" && (
          <WeekView
            onEventClick={handleEventClick}
            onSlotClick={handleSlotClick}
          />
        )}
        {view === "day" && (
          <DayView
            onEventClick={handleEventClick}
            onSlotClick={handleSlotClick}
          />
        )}
        {view === "three-day" && (
          <ThreeDayView
            onEventClick={handleEventClick}
            onSlotClick={handleSlotClick}
          />
        )}
        {view === "month" && (
          <MonthView
            onEventClick={handleEventClick}
            onDayClick={handleDayClick}
          />
        )}
        {view === "year" && <YearView />}
        {view === "agenda" && (
          <AgendaView onEventClick={handleEventClick} />
        )}

        {/* Event popover */}
        {selectedEvent && !isEditing && (
          <div className="absolute right-4 top-4 z-30">
            <EventPopover
              event={selectedEvent}
              onClose={() => setSelectedEvent(null)}
              onEdit={() => setIsEditing(true)}
            />
          </div>
        )}

        {/* Edit form */}
        {selectedEvent && isEditing && (
          <div className="absolute right-4 top-4 z-30 w-72 rounded-xl border border-border bg-card p-4 shadow-lg">
            <EventForm
              event={selectedEvent}
              onClose={() => {
                setSelectedEvent(null);
                setIsEditing(false);
              }}
            />
          </div>
        )}

        {/* New event form */}
        {newEventSlot && (
          <div className="absolute right-4 top-4 z-30 w-72 rounded-xl border border-border bg-card p-4 shadow-lg">
            <EventForm
              initialDate={newEventSlot.date}
              initialHour={newEventSlot.hour}
              onClose={() => setNewEventSlot(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
