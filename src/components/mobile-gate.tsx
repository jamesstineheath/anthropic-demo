"use client";

import Image from "next/image";
import { Monitor } from "lucide-react";

export function MobileGate() {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-background p-8 md:hidden">
      <div className="flex max-w-sm flex-col items-center text-center">
        <Image
          src="/claude-logo.svg"
          alt="Claude"
          width={40}
          height={40}
          className="mb-6"
        />
        <h1 className="text-xl font-semibold text-foreground mb-3">
          Best on Desktop
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground mb-6">
          This demo is designed for a desktop browser. The agent workspaces, calendar views, and interactive tour need a larger screen to shine.
        </p>
        <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-4 py-2.5 text-sm text-muted-foreground">
          <Monitor className="h-4 w-4" />
          <span>Please visit on a desktop or laptop</span>
        </div>
      </div>
    </div>
  );
}
