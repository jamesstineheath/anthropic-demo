"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PersonaSwitcher } from "@/components/persona-switcher";
import { getPersonaById, DEFAULT_PERSONA_ID } from "@/lib/agents/personas";

function HeroContent() {
  const searchParams = useSearchParams();
  const personaId = searchParams.get("persona") ?? DEFAULT_PERSONA_ID;
  const persona = getPersonaById(personaId);

  return (
    <div className="pb-6 space-y-3">
      <PersonaSwitcher />
      <p className="text-sm text-muted-foreground">
        {persona?.shortBio ?? "Add agents that learn your preferences and earn your trust over time."}
      </p>
    </div>
  );
}

export function HeroHeader() {
  return (
    <Suspense fallback={<div className="pb-6"><p className="text-sm text-muted-foreground">Add agents that learn your preferences and earn your trust over time.</p></div>}>
      <HeroContent />
    </Suspense>
  );
}
