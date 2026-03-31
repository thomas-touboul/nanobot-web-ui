"use client";
import { createContext, useContext, useState, useEffect } from 'react';
import { Agent } from '@/lib/shared/agent-types';

interface AgentContextType {
  agents: Agent[];
  activeAgent: Agent;
  refreshAgents: () => Promise<void>;
}

const AgentContext = createContext<AgentContextType | null>(null);

// Determine default root path: use NANOBOT_HOME env or parent directory of dashboard
function getDefaultRootPath(): string {
  if (typeof window !== 'undefined') {
    // Client-side: not used for server operations, but we need a placeholder
    return '/home/moltbot/.nanobot';
  }
  // Server-side: use env var or compute relative to this file
  const envPath = process.env.NANOBOT_HOME;
  if (envPath) return envPath;
  // Dashboard is in ~/.nanobot/nanobot-web-ui/, so parent is ~/.nanobot
  // __dirname in server component points to .../src/contexts/
  // We need to go up to project root then to parent
  const currentDir = process.cwd(); // Should be project root
  return currentDir.includes('nanobot-web-ui') ? currentDir.replace(/nanobot-web-ui$/, '') : '/home/moltbot/.nanobot';
}

// Agent par défaut (pour l'instant un seul agent)
const DEFAULT_AGENT: Agent = {
  id: 'default',
  name: 'Default Agent',
  rootPath: getDefaultRootPath(),
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
