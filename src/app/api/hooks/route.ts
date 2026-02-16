import { NextRequest, NextResponse } from 'next/server';
import { execSync } from 'child_process';

/**
 * Hooks API for OpenClaw Admin
 */

function parseCliOutput(output: string) {
  try {
    return JSON.parse(output);
  } catch (e) {
    const jsonStart = output.search(/[{[]/);
    if (jsonStart !== -1) {
      const jsonStr = output.slice(jsonStart);
      try {
        return JSON.parse(jsonStr);
      } catch (e2) {
        throw new Error('Failed to parse extracted JSON');
      }
    }
    throw new Error('No JSON found in output');
  }
}

export async function GET() {
  try {
    const configRaw = execSync('openclaw gateway call config.get --json').toString();
    const config = parseCliOutput(configRaw);
    const parsedConfig = config.parsed || config.config || config;
    const hooks = parsedConfig?.hooks?.mappings || [];
    return NextResponse.json({ hooks });
  } catch (error) {
    console.error('Error fetching hooks:', error);
    return NextResponse.json({ error: 'Failed to fetch hooks' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { hooks } = await request.json();
    
    const configRaw = execSync('openclaw gateway call config.get --json').toString();
    const currentConfig = parseCliOutput(configRaw);
    const baseHash = currentConfig.hash;

    if (!baseHash) throw new Error('Could not retrieve baseHash');

    const patchObject = {
      hooks: {
        mappings: hooks
      }
    };

    const params = {
      raw: JSON.stringify(patchObject),
      baseHash: baseHash,
      note: "Updated Hooks via Admin UI"
    };

    const paramsJson = JSON.stringify(params);
    const escapedParams = paramsJson.replace(/'/g, "'\\''");
    const cmd = `openclaw gateway call config.patch --params '${escapedParams}' --json`;
    
    execSync(cmd);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating hooks:', error);
    return NextResponse.json({ error: 'Failed to update hooks' }, { status: 500 });
  }
}
