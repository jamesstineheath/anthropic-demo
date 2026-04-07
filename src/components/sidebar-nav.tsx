"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  MessageSquare,
  FolderOpen,
  Blocks,
  Code,
  Users,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { icon: MessageSquare, label: "Chats", href: "#", decorative: true },
  { icon: FolderOpen, label: "Projects", href: "#", decorative: true },
  { icon: Blocks, label: "Artifacts", href: "#", decorative: true },
  { icon: Code, label: "Code", href: "#", decorative: true },
  { icon: Users, label: "Agent Team", href: "/", decorative: false },
];

export function SidebarNav() {
  const pathname = usePathname();
  const isAgentTeamActive =
    pathname === "/" || pathname.startsWith("/agents");

  return (
    <nav className="space-y-0.5">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = !item.decorative && isAgentTeamActive;

        if (item.decorative) {
          return (
            <div
              key={item.label}
              className="flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-[13px] text-muted-foreground/50 cursor-default"
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </div>
          );
        }

        return (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-[13px] font-medium transition-colors",
              isActive
                ? "bg-accent text-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{item.label}</span>
            <Badge className="ml-auto h-4 px-1.5 text-[9px] font-semibold bg-primary/15 text-primary hover:bg-primary/15 border-0">
              New
            </Badge>
          </Link>
        );
      })}
    </nav>
  );
}
