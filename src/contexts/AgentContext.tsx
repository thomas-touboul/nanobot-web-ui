"use client";

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Agent } from '@/lib/shared/agent-types';

interface AgentContextType {
  agents: Agent[];
  activeAgent: Agent;
  setActiveAgent: (agent: Agent) => void;
  refreshAgents: () => Promise<void>;
  isLoading: boolean;
}

const AgentContext = createContext<AgentContextType | null>(null);

const AGENT_STORAGE_KEY = 'nanobot-active-agent-id';

export function AgentProvider({ children }: { children: React.ReactNode }) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [activeAgent, setActiveAgentState] = useState<Agent | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshAgents = useCallback(async () => {
    try {
      const res = await fetch('/api/agents');
      const data = await res.json();
      
      if (data.agents && data.agents.length > 0) {
        setAgents(data.agents);
        
        // Restore previously selected agent from localStorage, or use first one
        const savedAgentId = localStorage.getItem(AGENT_STORAGE_KEY);
        const savedAgent = data.agents.find((a: Agent) => a.id === savedAgentId);
        const defaultAgent = savedAgent || data.agents[0];
        
        setActiveAgentState(defaultAgent);
        if (!savedAgent) {
          localStorage.setItem(AGENT_STORAGE_KEY, defaultAgent.id);
        }
      }
    } catch (error) {
      console.error('Failed to load agents:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setActiveAgent = useCallback((agent: Agent) => {
    setActiveAgentState(agent);
    localStorage.setItem(AGENT_STORAGE_KEY, agent.id);
  }, []);

  useEffect(() => {
    refreshAgents();
  }, [refreshAgents]);

  if (isLoading) {
    return null; // or a loader
  }

  // Wait until we have agents
  if (agents.length === 0 || !activeAgent) {
    return null;
  }

  return (
    <AgentContext.Provider value={{
      agents,
      activeAgent,
      setActiveAgent,
      refreshAgents,
      isLoading
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
