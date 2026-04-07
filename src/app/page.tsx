import { Suspense } from "react";
import { HeroHeader } from "@/components/hero-header";
import { AgentGrid } from "@/components/agent-grid";

export default function Home() {
  return (
    <>
      <HeroHeader />
      <Suspense>
        <AgentGrid />
      </Suspense>
    </>
  );
}
