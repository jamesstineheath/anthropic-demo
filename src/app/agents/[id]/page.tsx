import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getAgentById, TRUST_STAGE_LABELS } from "@/lib/agents/data";
import { getIcon } from "@/lib/icons";
import { Badge } from "@/components/ui/badge";

export default async function AgentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const agent = getAgentById(id);

  if (!agent) {
    notFound();
  }

  const Icon = getIcon(agent.icon);

  return (
    <div className="mx-auto max-w-2xl">
      {/* Back link */}
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to marketplace
      </Link>

      {/* Agent header */}
      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Icon className="h-7 w-7" />
        </div>
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            {agent.name}
          </h1>
          <div className="mt-1 flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {agent.category}
            </Badge>
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="mt-6 text-base leading-relaxed text-muted-foreground">
        {agent.description}
      </p>

      {/* Placeholder */}
      <div className="mt-8 rounded-xl border border-dashed border-border p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Agent detail view coming in Phase 2.
        </p>
        <p className="mt-1 text-xs text-muted-foreground/60">
          This is where the agent&apos;s work surface, chat interface, and trust
          progression will live.
        </p>
      </div>
    </div>
  );
}
