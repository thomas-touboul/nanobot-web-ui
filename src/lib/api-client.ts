import { Agent } from '@/lib/shared/agent-types';

/**
 * Wrapper around fetch that automatically adds the X-Agent-ID header
 * based on the currently active agent.
 */
export async function agentFetch(
  url: string, 
  options: RequestInit = {},
  activeAgent: Agent | null | undefined
): Promise<Response> {
  const headers = new Headers(options.headers);
  
  // Use activeAgent.id or fallback to 'default'
  const agentId = activeAgent?.id || 'default';
  headers.set('X-Agent-ID', agentId);
  
  // Debug log in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[agentFetch] ${options.method || 'GET'} ${url} -> X-Agent-ID: ${agentId}`);
  }
  
  return fetch(url, {
    ...options,
    headers
  });
}
