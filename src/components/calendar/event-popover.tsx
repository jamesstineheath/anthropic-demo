"use client";

import { format } from "date-fns";
import { X, Clock, Tag, AlertTriangle, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getEventColors, type CalendarEvent } from "@/lib/calendar/data";
import { cn } from "@/lib/utils";

interface EventPopoverProps {
  event: CalendarEvent;
  onClose: () => void;
  onEdit: () => void;
}

export function EventPopover({ event, onClose, onEdit }: EventPopoverProps) {
  const colors = getEventColors(event);

  return (
    <div className="w-72 rounded-xl border border-border bg-card p-4 shadow-lg">
      <div className="flex items-start justify-between">
        <h3 className="text-sm font-semibold text-foreground pr-2">
          {event.title}
        </h3>
        <div className="flex gap-1 shrink-0">
          <button
            onClick={onEdit}
            className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={onClose}
            className="rounded-md p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="mt-3 space-y-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3.5 w-3.5" />
          <span>
            {format(event.start, "EEE, MMM d")} ·{" "}
            {format(event.start, "h:mm a")} – {format(event.end, "h:mm a")}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <Tag className="h-3.5 w-3.5 text-muted-foreground" />
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-xs font-medium capitalize",
              colors.bg,
              colors.text,
              colors.darkBg,
              colors.darkText
            )}
          >
            {event.calendarSource === "chenFam" ? "Chen Fam" : event.calendarSource}
          </span>
        </div>

        {event.isConflict && (
          <div className="flex items-center gap-2 text-xs text-red-500">
            <AlertTriangle className="h-3.5 w-3.5" />
            <span>Scheduling conflict</span>
          </div>
        )}

        {event.description && (
          <p className="text-xs text-muted-foreground leading-relaxed pt-1">
            {event.description}
          </p>
        )}

        {event.isRecurring && (
          <p className="text-xs text-muted-foreground/60">Recurring event</p>
        )}
      </div>
    </div>
  );
}
