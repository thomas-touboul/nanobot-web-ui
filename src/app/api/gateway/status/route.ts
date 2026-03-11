import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);
const CONFIG_PATH = '/home/moltbot/.nanobot/config.json';

export async function GET() {
  try {
    // 1. Check systemd service status
    let serviceState = 'inactive';
    let pid = 'N/A';
    try {
      const { stdout: systemdOutput } = await execAsync('systemctl --user show nanobot-gateway --property=ActiveState,MainPID');
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
      if (fs.existsSync(CONFIG_PATH)) {
        const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
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

    // 3. Check RPC Probe
    let rpcProbe = 'Offline';
    try {
      const { stdout: netstatOutput } = await execAsync('netstat -tuln | grep :18790');
      if (netstatOutput.includes(':18790')) {
        rpcProbe = 'Online';
      }
    } catch (e) {}

    return NextResponse.json({
      service: 'nanobot-gateway',
      state: serviceState,
      pid: pid === '0' ? 'N/A' : pid,
      model: model,
      provider: provider,
      channels: activeChannels,
      port: 18790,
      rpc_probe: rpcProbe
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
