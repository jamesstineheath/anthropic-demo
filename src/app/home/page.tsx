"use client";

import Image from "next/image";
import { Plus, ChevronDown } from "lucide-react";

const QUICK_ACTIONS = [
  { label: "Write", icon: "✏️" },
  { label: "Learn", icon: "✨" },
  { label: "From Drive", icon: "📁" },
  { label: "From Calendar", icon: "📅" },
  { label: "From Gmail", icon: "📧" },
];

export default function HomePage() {
  return (
    <div className="flex h-full flex-col items-center justify-center px-6">
      <div className="flex flex-col items-center w-full max-w-2xl">
        {/* Welcome header */}
        <div className="flex items-center gap-3 mb-10">
          <Image
            src="/claude-logo.svg"
            alt="Claude"
            width={32}
            height={32}
          />
          <h1 className="text-3xl font-semibold text-foreground tracking-tight">
            Welcome, Alex
          </h1>
        </div>

        {/* Chat input */}
        <div className="w-full rounded-2xl border border-border bg-white shadow-sm">
          <div className="px-5 pt-4 pb-2">
            <p className="text-base text-muted-foreground">
              How can I help you today?
            </p>
          </div>
          <div className="flex items-center justify-between px-4 pb-3">
            <button className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground/50">
              <Plus className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-1.5 text-sm text-muted-foreground/60">
                Opus 4.6
                <ChevronDown className="h-3 w-3" />
              </button>
              <div className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground/40">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 8h2M6 8h2M10 8h2M14 8h0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick action chips */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action.label}
              className="flex items-center gap-1.5 rounded-full border border-border bg-white px-3.5 py-1.5 text-sm text-muted-foreground shadow-sm"
            >
              <span className="text-xs">{action.icon}</span>
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
