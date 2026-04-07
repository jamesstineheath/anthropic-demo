"use client";

import * as React from "react";

interface XRayContextValue {
  isXRayMode: boolean;
  toggleXRay: () => void;
}

const XRayContext = React.createContext<XRayContextValue | undefined>(undefined);

export function XRayProvider({ children }: { children: React.ReactNode }) {
  const [isXRayMode, setIsXRayMode] = React.useState(false);

  const toggleXRay = React.useCallback(() => {
    setIsXRayMode((prev) => !prev);
  }, []);

  return (
    <XRayContext.Provider value={{ isXRayMode, toggleXRay }}>
      {children}
    </XRayContext.Provider>
  );
}

export function useXRay() {
  const context = React.useContext(XRayContext);
  if (!context) {
    throw new Error("useXRay must be used within an XRayProvider");
  }
  return context;
}
