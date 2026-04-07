"use client";

import * as React from "react";
import type { TrustStage } from "@/lib/agents/data";

interface TeamAgent {
  id: string;
  trustStage: TrustStage;
}

interface TeamContextValue {
  teamAgents: TeamAgent[];
  addAgent: (id: string) => void;
  removeAgent: (id: string) => void;
  isOnTeam: (id: string) => boolean;
  getTrustStage: (id: string) => TrustStage;
  setTrustStage: (id: string, stage: TrustStage) => void;
  mounted: boolean;
}

const TeamContext = React.createContext<TeamContextValue | undefined>(undefined);

const STORAGE_KEY = "claude-agents-team";

export function TeamProvider({ children }: { children: React.ReactNode }) {
  const [teamAgents, setTeamAgents] = React.useState<TeamAgent[]>([]);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          // Handle legacy format (string[]) and new format (TeamAgent[])
          const agents = parsed.map((item: string | TeamAgent) =>
            typeof item === "string" ? { id: item, trustStage: 0 as TrustStage } : item
          );
          setTeamAgents(agents);
        }
      }
    } catch {
      // Ignore
    }
    setMounted(true);
  }, []);

  React.useEffect(() => {
    if (mounted) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(teamAgents));
    }
  }, [teamAgents, mounted]);

  const addAgent = React.useCallback((id: string) => {
    setTeamAgents((prev) =>
      prev.some((a) => a.id === id)
        ? prev
        : [...prev, { id, trustStage: 0 as TrustStage }]
    );
  }, []);

  const removeAgent = React.useCallback((id: string) => {
    setTeamAgents((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const isOnTeam = React.useCallback(
    (id: string) => teamAgents.some((a) => a.id === id),
    [teamAgents]
  );

  const getTrustStage = React.useCallback(
    (id: string): TrustStage => {
      const agent = teamAgents.find((a) => a.id === id);
      return (agent?.trustStage ?? 0) as TrustStage;
    },
    [teamAgents]
  );

  const setTrustStage = React.useCallback(
    (id: string, stage: TrustStage) => {
      setTeamAgents((prev) =>
        prev.map((a) => (a.id === id ? { ...a, trustStage: stage } : a))
      );
    },
    []
  );

  // Backward-compatible teamAgentIds
  return (
    <TeamContext.Provider
      value={{
        teamAgents,
        addAgent,
        removeAgent,
        isOnTeam,
        getTrustStage,
        setTrustStage,
        mounted,
      }}
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
