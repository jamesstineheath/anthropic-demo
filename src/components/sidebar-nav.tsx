"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  MessageSquare,
  FolderOpen,
  Blocks,
  Code,
  Users,
  Brain,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { icon: MessageSquare, label: "Chats", href: "/home", decorative: false, isHome: true },
  { icon: FolderOpen, label: "Projects", href: "#", decorative: true },
  { icon: Blocks, label: "Artifacts", href: "#", decorative: true },
  { icon: Code, label: "Code", href: "#", decorative: true },
  { icon: Brain, label: "Memory", href: "/memory", decorative: false, badge: "v1", tourId: "memory-nav" },
  { icon: Users, label: "Agents", href: "/", decorative: false, badge: "v2", tourId: "agents-nav" },
];

export function SidebarNav() {
  const pathname = usePathname();

  function isItemActive(item: (typeof NAV_ITEMS)[number]) {
    if (item.decorative) return false;
    if (item.href === "/home") return pathname === "/home";
    if (item.href === "/memory") return pathname === "/memory";
    if (item.href === "/") return pathname === "/" || pathname.startsWith("/agents");
    return pathname === item.href;
  }

  return (
    <nav className="space-y-0.5">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = isItemActive(item);

        if (item.decorative) {
          return (
            <div
              key={item.label}
              className="flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-sm text-muted-foreground/50 cursor-default"
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </div>
          );
        }

        const badgeText = "badge" in item ? item.badge : undefined;

        return (
          <Link
            key={item.label}
            href={item.href}
            {...("tourId" in item && item.tourId ? { "data-tour": item.tourId } : {})}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-accent text-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{item.label}</span>
            {badgeText && (
              <Badge className="ml-auto h-4 px-1.5 text-xs font-semibold bg-terracotta/15 text-terracotta hover:bg-terracotta/15 border-0">
                {badgeText}
              </Badge>
            )}
          </Link>
        );
      })}
    </nav>
  );
}
