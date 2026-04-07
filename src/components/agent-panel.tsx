"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  Brain,
  Shield,
  Plug,
  Check,
  Circle,
  Lock,
} from "lucide-react";
import { useTeam } from "@/components/providers/team-provider";
import { useChat } from "@/components/providers/chat-provider";
import { TRUST_STAGE_DETAILS } from "@/lib/agents/trust";
import { TRUST_STAGE_LABELS, type TrustStage } from "@/lib/agents/data";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

function Section({
  title,
  icon: Icon,
  badge,
  children,
  defaultOpen = true,
}: {
  title: string;
  icon: React.ElementType;
  badge?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center gap-2 px-4 py-2.5 text-xs font-semibold text-foreground hover:bg-accent/50 transition-colors"
      >
        {open ? (
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-3 w-3 text-muted-foreground" />
        )}
        <Icon className="h-3.5 w-3.5 text-muted-foreground" />
        <span>{title}</span>
        {badge && (
          <Badge
            variant="secondary"
            className="ml-auto text-[9px] font-normal"
          >
            {badge}
          </Badge>
        )}
      </button>
      {open && <div className="px-4 pb-3">{children}</div>}
    </div>
  );
}

export function AgentPanel() {
  const { getTrustStage } = useTeam();
  const { memory } = useChat();
  const trustStage = getTrustStage("calendaring");

  const stages = [0, 1, 2, 3, 4, 5] as TrustStage[];
  const memoryEntries = Object.entries(memory).filter(([k, v]) => v);

  return (
    <ScrollArea className="h-full">
      <div className="py-2">
        {/* Memory Section */}
        <Section
          title="Memory"
          icon={Brain}
          badge="Only you"
          defaultOpen={true}
        >
          {memoryEntries.length > 0 ? (
            <div className="space-y-2">
              {memoryEntries.map(([key, value]) => (
                <div
                  key={key}
                  className="rounded-lg bg-secondary/50 px-3 py-2"
                >
                  <div className="text-[11px] font-medium text-foreground capitalize">
                    {key.replace(/([A-Z])/g, " $1").trim()}
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-0.5">
                    {value}
                  </div>
                </div>
              ))}
              {/* Unlearned categories */}
              {["Routines", "Goals", "Relationships"].map((cat) => (
                <div
                  key={cat}
                  className="rounded-lg border border-dashed border-border px-3 py-2"
                >
                  <div className="text-[11px] text-muted-foreground/50">
                    {cat} — not yet learned
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-[11px] text-muted-foreground/50 text-center py-4">
              Complete onboarding to start building memory.
            </div>
          )}
        </Section>

        <Separator />

        {/* Trust Stage Section */}
        <Section
          title="Trust Stage"
          icon={Shield}
          defaultOpen={true}
        >
          <div className="space-y-1">
            {stages.map((stage) => {
              const details = TRUST_STAGE_DETAILS[stage];
              const isCurrent = stage === trustStage;
              const isPast = stage < trustStage;
              const isFuture = stage > trustStage;

              return (
                <div
                  key={stage}
                  className={cn(
                    "flex items-start gap-2.5 rounded-lg px-2.5 py-2 transition-colors",
                    isCurrent && "bg-primary/5"
                  )}
                >
                  {/* Stage indicator */}
                  <div className="mt-0.5 shrink-0">
                    {isPast ? (
                      <div className="flex h-4 w-4 items-center justify-center rounded-full bg-primary">
                        <Check className="h-2.5 w-2.5 text-primary-foreground" />
                      </div>
                    ) : isCurrent ? (
                      <div className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-primary">
                        <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      </div>
                    ) : (
                      <div className="flex h-4 w-4 items-center justify-center">
                        <Lock className="h-3 w-3 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div
                      className={cn(
                        "text-[11px] font-medium",
                        isCurrent
                          ? "text-primary"
                          : isPast
                          ? "text-foreground"
                          : "text-muted-foreground/50"
                      )}
                    >
                      Stage {stage}: {details.name}
                    </div>
                    <div
                      className={cn(
                        "text-[10px] mt-0.5",
                        isCurrent
                          ? "text-muted-foreground"
                          : "text-muted-foreground/40"
                      )}
                    >
                      {details.shortDescription}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Section>

        <Separator />

        {/* Tools & Data Section */}
        <Section
          title="Tools & Data"
          icon={Plug}
          defaultOpen={true}
        >
          <div className="space-y-2">
            <div className="flex items-center gap-2.5 rounded-lg bg-secondary/50 px-3 py-2">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-[11px] font-medium text-foreground">
                Google Calendar
              </span>
              <span className="ml-auto text-[10px] text-emerald-600 dark:text-emerald-400">
                Connected
              </span>
            </div>
            <div className="flex items-center gap-2.5 rounded-lg border border-dashed border-border px-3 py-2">
              <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
              <span className="text-[11px] text-muted-foreground">Gmail</span>
              <button className="ml-auto text-[10px] text-primary hover:underline">
                Connect
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground/40 px-1 mt-1">
              Agents access your data through secure integrations.
            </p>
          </div>
        </Section>
      </div>
    </ScrollArea>
  );
}
