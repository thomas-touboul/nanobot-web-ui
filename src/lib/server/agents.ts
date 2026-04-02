import fs from 'fs';
import path from 'path';
import { Agent } from '@/lib/shared/agent-types';

/**
 * Scan les dossiers ~/.nanobot* pour détecter les agents disponibles.
 * Retourne la liste des agents avec leur configuration.
 */
export function discoverAgents(): Agent[] {
  const homeDir = process.env.HOME || '/home/moltbot';
  const agents: Agent[] = [];

  // Lister tous les dossiers qui commencent par .nanobot dans le home
  const entries = fs.readdirSync(homeDir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith('.nanobot') && entry.isDirectory()) {
      const agentRoot = path.join(homeDir, entry.name);
      const configPath = path.join(agentRoot, 'config.json');

      if (fs.existsSync(configPath)) {
        try {
          const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
          // Déterminer le nom de l'agent à partir du nom du dossier
          // .nanobot -> default, .nanobot-trading -> trading
          let agentId = entry.name.replace(/^\.nanobot-?/, '');
          if (!agentId) {
            agentId = 'default';
          }

          let agentName = agentId.charAt(0).toUpperCase() + agentId.slice(1);
          if (agentId === 'default') agentName = 'Default';

          // Service systemd : nanobot-gateway pour default, nanobot-<id>-gateway pour les autres
          const serviceName = agentId === 'default' ? 'nanobot-gateway' : `nanobot-${agentId}-gateway`;

          // Lire le port depuis la config gateway (à la racine, pas dans agents.defaults)
          const port = config.gateway?.port;
          if (!port) {
            console.warn(`No gateway port configured for ${agentId}, skipping`);
            continue;
          }

          agents.push({
            id: agentId,
            name: agentName,
            rootPath: agentRoot,
            serviceName: serviceName,
            port: port,
            enabled: true
          });
        } catch (e) {
          console.error(`Failed to parse config for ${agentRoot}:`, e);
        }
      }
    }
  }

  // Si aucun agent trouvé, retourner l'agent par défaut (fallback)
  if (agents.length === 0) {
    // Tenter de lire le port depuis la config
    const defaultConfigPath = path.join(homeDir, '.nanobot', 'config.json');
    let defaultPort = 18790;
    if (fs.existsSync(defaultConfigPath)) {
      try {
        const defaultConfig = JSON.parse(fs.readFileSync(defaultConfigPath, 'utf-8'));
        defaultPort = defaultConfig.gateway?.port || 18790;
      } catch {}
    }
    
    agents.push({
      id: 'default',
      name: 'Default',
      rootPath: path.join(homeDir, '.nanobot'),
      serviceName: 'nanobot-gateway',
      port: defaultPort,
      enabled: true
    });
  }

  return agents;
}

/**
 * Retourne un Agent par son ID
 */
export function getAgentById(agentId: string): Agent | null {
  const agents = discoverAgents();
  return agents.find(a => a.id === agentId) || null;
}
