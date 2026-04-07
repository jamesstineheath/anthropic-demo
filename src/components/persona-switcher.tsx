"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { PERSONAS, DEFAULT_PERSONA_ID } from "@/lib/agents/personas";
import { cn } from "@/lib/utils";

export function PersonaSwitcher() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeId = searchParams.get("persona") ?? DEFAULT_PERSONA_ID;

  function switchPersona(id: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (id === DEFAULT_PERSONA_ID) {
      params.delete("persona");
    } else {
      params.set("persona", id);
    }
    const qs = params.toString();
    router.push(qs ? `/?${qs}` : "/");
  }

  return (
    <div className="flex items-center gap-2">
      {PERSONAS.map((persona) => {
        const isActive = persona.id === activeId;
        return (
          <button
            key={persona.id}
            onClick={() => switchPersona(persona.id)}
            className={cn(
              "flex items-center gap-2 rounded-full px-3 py-1.5 text-xs transition-all",
              isActive
                ? "bg-primary/15 text-primary ring-1 ring-primary/30 font-medium"
                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <span
              className={cn(
                "flex h-5 w-5 items-center justify-center rounded-full text-xs font-semibold",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted-foreground/20 text-muted-foreground"
              )}
            >
              {persona.avatar}
            </span>
            <span>{persona.name}</span>
            {!persona.isInteractive && (
              <span className="text-xs text-muted-foreground/60 ml-0.5">
                Preview
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
