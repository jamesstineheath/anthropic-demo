"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface TourSpotlightProps {
  selector?: string;
  padding?: number;
  interactive?: boolean;
}

export function TourSpotlight({ selector, padding = 12, interactive = false }: TourSpotlightProps) {
  const [rect, setRect] = useState<DOMRect | null>(null);
  const observerRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    if (!selector) {
      // Use a microtask to avoid synchronous setState in effect
      const id = requestAnimationFrame(() => setRect(null));
      return () => cancelAnimationFrame(id);
    }

    const measure = () => {
      const el = document.querySelector(selector);
      if (el) {
        setRect(el.getBoundingClientRect());
      }
    };

    measure();

    observerRef.current = new ResizeObserver(measure);
    const el = document.querySelector(selector);
    if (el) observerRef.current.observe(el);
    window.addEventListener("scroll", measure, true);
    window.addEventListener("resize", measure);

    return () => {
      observerRef.current?.disconnect();
      window.removeEventListener("scroll", measure, true);
      window.removeEventListener("resize", measure);
    };
  }, [selector]);

  if (!selector) {
    // Full-screen backdrop — no spotlight
    return <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />;
  }

  if (!rect) {
    return <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />;
  }

  const p = padding;
  const l = rect.left - p;
  const t = rect.top - p;
  const r = rect.right + p;
  const b = rect.bottom + p;

  return (
    <div className="absolute inset-0">
      {/* Backdrop with cutout */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"
        style={{
          clipPath: `polygon(
            0% 0%, 0% 100%,
            ${l}px 100%, ${l}px ${t}px,
            ${r}px ${t}px, ${r}px ${b}px,
            ${l}px ${b}px, ${l}px 100%,
            100% 100%, 100% 0%
          )`,
        }}
      />
      {/* Spotlight ring */}
      <div
        className={cn(
          "absolute border-2 border-white/40 rounded-xl pointer-events-none",
          "animate-pulse"
        )}
        style={{
          left: l,
          top: t,
          width: r - l,
          height: b - t,
        }}
      />
      {/* Clickable area for interactive steps */}
      {interactive && (
        <div
          className="absolute rounded-xl"
          style={{
            left: l,
            top: t,
            width: r - l,
            height: b - t,
          }}
        />
      )}
    </div>
  );
}
