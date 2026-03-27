import fs from 'fs';
import path from 'path';
import { Agent } from '@/lib/shared/agent-types';

const DEFAULT_AGENT_ROOT = '/home/moltbot/.nanobot';

/**
 * Retourne l'agent par défaut (pour l'instant un seul agent)
 */
export function getDefaultAgent(): Agent {
  return {
    id: 'default',
    name: 'Default Agent',
    rootPath: DEFAULT_AGENT_ROOT,
    serviceName: 'nanobot-gateway',
    port: 18790,
    enabled: true
  };
}

/**
 * Résolveur de chemins pour un agent spécifique
 * Encapsule toute la logique de construction des chemins
 */
export class AgentPathResolver {
  private agent: Agent;

  constructor(agent: Agent) {
    this.agent = agent;
  }

  /**
   * Retourne le chemin racine de l'agent
   */
  root(): string {
    return this.agent.rootPath;
  }

  /**
   * Chemin vers le fichier de configuration principal
   */
  config(): string {
    return path.join(this.agent.rootPath, 'config.json');
  }

  /**
   * Chemin vers le workspace de l'agent
   */
  workspace(): string {
    return path.join(this.agent.rootPath, 'workspace');
  }

  /**
   * Chemin vers le répertoire memory
   */
  memoryDir(): string {
    return path.join(this.agent.rootPath, 'workspace', 'memory');
  }

  /**
   * Chemin vers un fichier mémoire spécifique
   */
  memoryFile(filename: string): string {
    return path.join(this.agent.rootPath, 'workspace', 'memory', filename);
  }

  /**
   * Chemin vers le fichier HISTORY.md
   */
  historyFile(): string {
    return path.join(this.agent.rootPath, 'workspace', 'memory', 'HISTORY.md');
  }

  /**
   * Chemin vers un fichier core (SOUL.md, AGENTS.md, etc.)
   */
  coreFile(filename: string): string {
    return path.join(this.agent.rootPath, 'workspace', filename);
  }

  /**
   * Chemin vers le répertoire des skills
   */
  skillsDir(): string {
    return path.join(this.agent.rootPath, 'workspace', 'skills');
  }

  /**
   * Chemin vers le dossier d'une skill spécifique
   */
  skillFolder(skillName: string): string {
    return path.join(this.agent.rootPath, 'workspace', 'skills', skillName);
  }

  /**
   * Chemin vers le fichier SKILL.md d'une skill
   */
  skillFile(skillName: string): string {
    return path.join(this.agent.rootPath, 'workspace', 'skills', skillName, 'SKILL.md');
  }

  /**
   * Chemin vers le répertoire cron
   */
  cronDir(): string {
    return path.join(this.agent.rootPath, 'cron');
  }

  /**
   * Chemin vers le fichier jobs.json des cron
   */
  cronJobsFile(): string {
    return path.join(this.agent.rootPath, 'cron', 'jobs.json');
  }

  /**
   * Chemin vers le répertoire logs (si l'agent a ses propres logs)
   */
  logsDir(): string {
    return path.join(this.agent.rootPath, 'logs');
  }

  /**
   * Vérifie si un chemin est dans le scope de l'agent
   */
  isWithinAgent(filePath: string): boolean {
    const normalized = path.resolve(filePath);
    const rootResolved = path.resolve(this.agent.rootPath);
    return normalized.startsWith(rootResolved);
  }

  /**
   * Retourne le chemin relatif depuis la racine de l'agent
   */
  getRelativePath(filePath: string): string | null {
    const normalized = path.resolve(filePath);
    if (!this.isWithinAgent(normalized)) return null;
    return path.relative(this.agent.rootPath, normalized);
  }
}

/**
 * Retourne un résolveur pour l'agent par défaut
 */
export function getDefaultResolver(): AgentPathResolver {
  return new AgentPathResolver(getDefaultAgent());
}
