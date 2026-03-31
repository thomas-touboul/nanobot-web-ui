import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import { getDefaultResolver } from '@/lib/server/agent-paths';

const execAsync = promisify(exec);

export async function GET() {
  try {
    const resolver = getDefaultResolver();
    const agent = resolver['agent']; // On accède à l'agent via le resolver

     // 1. Check systemd service status (user service)
     let serviceState = 'inactive';
     let pid = 'N/A';
     try {
       const { stdout: systemdOutput } = await execAsync(`systemctl --user show ${agent.serviceName} --property=ActiveState,MainPID`);
       const lines = systemdOutput.split('\n');
       lines.forEach(line => {
         if (line.startsWith('ActiveState=')) serviceState = line.split('=')[1];
         if (line.startsWith('MainPID=')) pid = line.split('=')[1];
       });
     } catch (e) {
       console.error('Failed to get systemd status', e);
     }

    // 2. Read config for model, provider and channels
    let model = 'unknown';
    let provider = 'auto';
    let activeChannels: string[] = [];
    try {
      const configPath = resolver.config();
      if (fs.existsSync(configPath)) {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        model = config.agents?.defaults?.model || 'unknown';
        provider = config.agents?.defaults?.provider || 'auto';
        
        // Extract active channels
        if (config.channels) {
          Object.entries(config.channels).forEach(([name, settings]: [string, any]) => {
            if (settings && typeof settings === 'object' && settings.enabled === true) {
              activeChannels.push(name);
            }
          });
        }
      }
    } catch (e) {
      console.error('Failed to read config', e);
    }

    // 3. Check RPC Probe (port de l'agent)
    let rpcProbe = 'Offline';
    try {
      const { stdout: netstatOutput } = await execAsync(`netstat -tuln | grep :${agent.port}`);
      if (netstatOutput.includes(`:${agent.port}`)) {
        rpcProbe = 'Online';
      }
    } catch (e) {}

    return NextResponse.json({
      service: agent.serviceName,
      state: serviceState,
      pid: pid === '0' ? 'N/A' : pid,
      model,
      provider,
      channels: activeChannels,
      port: agent.port,
      rpc_probe: rpcProbe
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
