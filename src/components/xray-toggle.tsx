"use client";

import { ScanEye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useXRay } from "@/components/providers/xray-provider";
import { cn } from "@/lib/utils";

export function XRayToggle() {
  const { isXRayMode, toggleXRay } = useXRay();

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "h-8 gap-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:text-foreground",
        isXRayMode &&
          "bg-primary/10 text-primary hover:bg-primary/15 hover:text-primary"
      )}
      onClick={toggleXRay}
    >
      <ScanEye className="h-3.5 w-3.5" />
      X-Ray
    </Button>
  );
}
