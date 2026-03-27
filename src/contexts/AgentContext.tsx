"use client";
import { createContext, useContext, useState, useEffect } from 'react';
import { Agent } from '@/lib/shared/agent-types';

interface AgentContextType {
  agents: Agent[];
  activeAgent: Agent;
  refreshAgents: () => Promise<void>;
}

const AgentContext = createContext<AgentContextType | null>(null);

// Agent par défaut (pour l'instant un seul agent)
const DEFAULT_AGENT: Agent = {
  id: 'default',
  name: 'Default Agent',
  rootPath: '/home/moltbot/.nanobot',
  serviceName: 'nanobot-gateway',
  port: 18790,
  enabled: true
};

export function AgentProvider({ children }: { children: React.ReactNode }) {
  const [agents, setAgents] = useState<Agent[]>([DEFAULT_AGENT]);
  const [activeAgent, setActiveAgent] = useState<Agent>(DEFAULT_AGENT);
  const [isLoading, setIsLoading] = useState(true);

  const refreshAgents = async () => {
    // Pour l'instant, on utilise juste l'agent par défaut
    // Plus tard, on fera un fetch vers /api/agents
    setAgents([DEFAULT_AGENT]);
    setActiveAgent(DEFAULT_AGENT);
    setIsLoading(false);
  };

  useEffect(() => {
    refreshAgents();
  }, []);

  if (isLoading) {
    return null; // ou un loader
  }

  return (
    <AgentContext.Provider value={{
      agents,
      activeAgent,
      refreshAgents
    }}>
      {children}
    </AgentContext.Provider>
  );
}

export const useAgent = () => {
  const ctx = useContext(AgentContext);
  if (!ctx) throw new Error('useAgent must be used within AgentProvider');
  return ctx;
};
