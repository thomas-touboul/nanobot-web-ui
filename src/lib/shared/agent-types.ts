/**
 * Types partagés pour les agents Nanobot
 * Peut être importé côté client et serveur
 */

export interface Agent {
  id: string;
  name: string;
  rootPath: string;
  serviceName: string;
  port: number;
  enabled: boolean;
}

export interface AgentsConfig {
  agents: Agent[];
  activeAgentId: string;
}
