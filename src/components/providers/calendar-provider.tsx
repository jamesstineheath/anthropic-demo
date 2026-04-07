"use client";

import * as React from "react";
import {
  type CalendarEvent,
  generateSimulatedEvents,
} from "@/lib/calendar/data";
import type { CalendarView } from "@/lib/calendar/utils";

interface CalendarContextValue {
  events: CalendarEvent[];
  addEvent: (event: CalendarEvent) => void;
  updateEvent: (id: string, updates: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  view: CalendarView;
  setView: (view: CalendarView) => void;
}

const CalendarContext = React.createContext<CalendarContextValue | undefined>(
  undefined
);

export function CalendarProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = React.useState<CalendarEvent[]>(() =>
    generateSimulatedEvents()
  );
  const [currentDate, setCurrentDate] = React.useState(() => new Date());
  const [view, setView] = React.useState<CalendarView>("week");

  const addEvent = React.useCallback((event: CalendarEvent) => {
    setEvents((prev) => [...prev, event]);
  }, []);

  const updateEvent = React.useCallback(
    (id: string, updates: Partial<CalendarEvent>) => {
      setEvents((prev) =>
        prev.map((e) => (e.id === id ? { ...e, ...updates } : e))
      );
    },
    []
  );

  const deleteEvent = React.useCallback((id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }, []);

  return (
    <CalendarContext.Provider
      value={{
        events,
        addEvent,
        updateEvent,
        deleteEvent,
        currentDate,
        setCurrentDate,
        view,
        setView,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar() {
  const context = React.useContext(CalendarContext);
  if (!context) {
    throw new Error("useCalendar must be used within a CalendarProvider");
  }
  return context;
}
