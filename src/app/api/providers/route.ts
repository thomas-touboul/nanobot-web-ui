import fs from 'fs';
import { NextRequest, NextResponse } from 'next/server';
import { getResolverFromRequest } from '@/lib/server/request-agent';

export async function GET(request: Request) {
  try {
    const resolver = getResolverFromRequest(request);
    const configPath = resolver.config();
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    return NextResponse.json(config.providers || {});
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read config' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const resolver = getResolverFromRequest(req);
    const updatedProviders = await req.json();
    const configPath = resolver.config();
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    
    config.providers = updatedProviders;
    
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update config' }, { status: 500 });
  }
}
