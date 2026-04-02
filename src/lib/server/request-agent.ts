import { getAgentById } from './agents';
import { AgentPathResolver, getDefaultResolver } from './agent-paths';

/**
 * Retourne le resolver pour l'agent spécifié dans le header X-Agent-ID OU le query param agentId.
 * Le query param prend précédence sur le header.
 * Si aucun n'est présent, retourne le resolver par défaut.
 */
export function getResolverFromRequest(request: Request): AgentPathResolver {
  // Try query param first (takes precedence)
  const url = new URL(request.url);
  const queryAgentId = url.searchParams.get('agentId');
  
  if (queryAgentId) {
    const agent = getAgentById(queryAgentId);
    if (agent) {
      console.log(`[request-agent] Using agent from query: ${agent.id} (${agent.rootPath})`);
      return new AgentPathResolver(agent);
    }
  }
  
  // Fall back to header
  const headerAgentId = request.headers.get('X-Agent-ID');
  if (headerAgentId) {
    const agent = getAgentById(headerAgentId);
    if (agent) {
      console.log(`[request-agent] Using agent from header: ${agent.id} (${agent.rootPath})`);
      return new AgentPathResolver(agent);
    }
  }
  
  // Fallback to default
  const resolver = getDefaultResolver();
  console.log(`[request-agent] Fallback to default: ${resolver['agent'].id} (${resolver['agent'].rootPath})`);
  return resolver;
}
