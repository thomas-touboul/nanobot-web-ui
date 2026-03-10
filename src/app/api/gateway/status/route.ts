import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET() {
  try {
    // Check systemd service status
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

    // Get nanobot status for config info
    let model = 'unknown';
    try {
      const { stdout: nanobotOutput } = await execAsync('/home/moltbot/.local/bin/nanobot status');
      const modelMatch = nanobotOutput.match(/Model: (.*)/);
      if (modelMatch) model = modelMatch[1].trim();
    } catch (e) {
      console.error('Failed to get nanobot status', e);
    }

    return NextResponse.json({
      service: 'nanobot-gateway',
      state: serviceState,
      pid: pid === '0' ? 'N/A' : pid,
      model: model,
      port: 18790, // Default nanobot port
      uptime: 'N/A' 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
