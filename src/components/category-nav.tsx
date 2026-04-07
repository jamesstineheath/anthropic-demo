"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { CATEGORIES, getCategoryCounts } from "@/lib/agents/data";
import { cn } from "@/lib/utils";

export function CategoryNav() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeCategory = searchParams.get("category");
  const counts = getCategoryCounts();

  const setCategory = (category: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <nav className="space-y-0.5">
      <button
        onClick={() => setCategory(null)}
        className={cn(
          "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors",
          !activeCategory
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-accent hover:text-foreground"
        )}
      >
        <span>All Agents</span>
        <span className="text-xs tabular-nums opacity-60">36</span>
      </button>

      {CATEGORIES.map((category) => (
        <button
          key={category}
          onClick={() => setCategory(category)}
          className={cn(
            "flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            activeCategory === category
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-accent hover:text-foreground"
          )}
        >
          <span>{category}</span>
          <span className="text-xs tabular-nums opacity-60">
            {counts[category]}
          </span>
        </button>
      ))}
    </nav>
  );
}
