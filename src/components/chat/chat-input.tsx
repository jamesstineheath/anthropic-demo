"use client";

import { useState, useRef } from "react";
import { Send, Paperclip } from "lucide-react";
import { useChat } from "@/components/providers/chat-provider";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function ChatInput() {
  const [value, setValue] = useState("");
  const { sendMessage, isTyping } = useChat();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() || isTyping) return;
    sendMessage(value.trim());
    setValue("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-border bg-background px-4 py-3"
    >
      <div className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 focus-within:border-primary/40 focus-within:ring-1 focus-within:ring-primary/20 transition-colors">
        {/* Decorative attachment button */}
        <button
          type="button"
          className="shrink-0 text-muted-foreground/40 cursor-default"
          tabIndex={-1}
        >
          <Paperclip className="h-4 w-4" />
        </button>

        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Ask your Calendar agent..."
          disabled={isTyping}
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/50 disabled:opacity-50"
        />

        {/* Model badge (decorative) */}
        <Badge
          variant="secondary"
          className="shrink-0 text-xs font-medium cursor-default"
        >
          Sonnet 4.5
        </Badge>

        {/* Send button */}
        <button
          type="submit"
          disabled={!value.trim() || isTyping}
          className={cn(
            "shrink-0 rounded-lg p-1.5 transition-colors",
            value.trim() && !isTyping
              ? "bg-primary text-primary-foreground hover:bg-primary/90"
              : "text-muted-foreground/30 cursor-default"
          )}
        >
          <Send className="h-3.5 w-3.5" />
        </button>
      </div>
    </form>
  );
}
