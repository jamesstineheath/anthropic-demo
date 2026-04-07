"use client";

import { useState } from "react";
import { format, setHours, setMinutes } from "date-fns";
import { Button } from "@/components/ui/button";
import { useCalendar } from "@/components/providers/calendar-provider";
import type { EventCategory, CalendarEvent } from "@/lib/calendar/data";
import { cn } from "@/lib/utils";

interface EventFormProps {
  initialDate?: Date;
  initialHour?: number;
  event?: CalendarEvent;
  onClose: () => void;
}

const CATEGORIES: { value: EventCategory; label: string }[] = [
  { value: "work", label: "Work" },
  { value: "personal", label: "Personal" },
  { value: "health", label: "Health" },
  { value: "social", label: "Social" },
];

export function EventForm({
  initialDate,
  initialHour,
  event,
  onClose,
}: EventFormProps) {
  const { addEvent, updateEvent, deleteEvent } = useCalendar();
  const isEditing = !!event;

  const [title, setTitle] = useState(event?.title ?? "");
  const [category, setCategory] = useState<EventCategory>(
    event?.category ?? "work"
  );
  const [date, setDate] = useState(
    format(event?.start ?? initialDate ?? new Date(), "yyyy-MM-dd")
  );
  const [startTime, setStartTime] = useState(
    event
      ? format(event.start, "HH:mm")
      : `${String(initialHour ?? 9).padStart(2, "0")}:00`
  );
  const [endTime, setEndTime] = useState(
    event
      ? format(event.end, "HH:mm")
      : `${String((initialHour ?? 9) + 1).padStart(2, "0")}:00`
  );
  const [description, setDescription] = useState(event?.description ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const [startH, startM] = startTime.split(":").map(Number);
    const [endH, endM] = endTime.split(":").map(Number);
    const baseDate = new Date(date);
    const start = setMinutes(setHours(baseDate, startH), startM);
    const end = setMinutes(setHours(baseDate, endH), endM);

    if (isEditing && event) {
      updateEvent(event.id, { title, start, end, category, description });
    } else {
      addEvent({
        id: `evt-new-${Date.now()}`,
        title,
        start,
        end,
        category,
        calendarSource: "personal",
        description,
      });
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        placeholder="Event title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
        autoFocus
      />

      <div className="flex gap-2">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs outline-none focus:border-primary"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs outline-none focus:border-primary"
        />
        <span className="text-xs text-muted-foreground">to</span>
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="flex-1 rounded-lg border border-border bg-background px-3 py-1.5 text-xs outline-none focus:border-primary"
        />
      </div>

      <div className="flex gap-1.5">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            type="button"
            onClick={() => setCategory(cat.value)}
            className={cn(
              "rounded-full px-2.5 py-1 text-xs font-medium border transition-colors",
              category === cat.value
                ? "border-primary bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:border-primary/30"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-xs outline-none resize-none focus:border-primary focus:ring-1 focus:ring-primary/30"
      />

      <div className="flex items-center justify-between pt-1">
        {isEditing && (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="text-xs"
            onClick={() => {
              deleteEvent(event!.id);
              onClose();
            }}
          >
            Delete
          </Button>
        )}
        <div className="ml-auto flex gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-xs"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button type="submit" size="sm" className="text-xs">
            {isEditing ? "Update" : "Create"}
          </Button>
        </div>
      </div>
    </form>
  );
}
