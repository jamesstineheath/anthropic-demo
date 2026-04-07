"use client";

import * as React from "react";

interface TeamContextValue {
  teamAgentIds: string[];
  addAgent: (id: string) => void;
  removeAgent: (id: string) => void;
  isOnTeam: (id: string) => boolean;
  mounted: boolean;
}

const TeamContext = React.createContext<TeamContextValue | undefined>(undefined);

const STORAGE_KEY = "claude-agents-team";

export function TeamProvider({ children }: { children: React.ReactNode }) {
  const [teamAgentIds, setTeamAgentIds] = React.useState<string[]>([]);
  const [mounted, setMounted] = React.useState(false);

  // Hydrate from localStorage on mount
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setTeamAgentIds(parsed);
        }
      }
    } catch {
      // Ignore parse errors
    }
    setMounted(true);
  }, []);

  // Persist to localStorage on change (skip initial mount)
  React.useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(teamAgentIds));
    }
  }, [teamAgentIds, mounted]);

  const addAgent = React.useCallback((id: string) => {
    setTeamAgentIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }, []);

  const removeAgent = React.useCallback((id: string) => {
    setTeamAgentIds((prev) => prev.filter((agentId) => agentId !== id));
  }, []);

  const isOnTeam = React.useCallback(
    (id: string) => teamAgentIds.includes(id),
    [teamAgentIds]
  );

  return (
    <TeamContext.Provider
      value={{ teamAgentIds, addAgent, removeAgent, isOnTeam, mounted }}
    >
      {children}
    </TeamContext.Provider>
  );
}

export function useTeam() {
  const context = React.useContext(TeamContext);
  if (!context) {
    throw new Error("useTeam must be used within a TeamProvider");
  }
  return context;
}
