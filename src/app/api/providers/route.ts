import fs from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import { getDefaultResolver } from '@/lib/server/agent-paths';

export async function GET() {
  try {
    const resolver = getDefaultResolver();
    const configPath = resolver.config();
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    return NextResponse.json(config.providers || {});
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read config' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const updatedProviders = await req.json();
    const resolver = getDefaultResolver();
    const configPath = resolver.config();
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    
    config.providers = updatedProviders;
    
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update config' }, { status: 500 });
  }
}
