"use client";

import * as React from "react";

/**
 * Lightweight theme provider stub.
 * The app forces light mode — no need for next-themes or its <script> tag.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
