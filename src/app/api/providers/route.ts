import fs from 'fs';
import { NextRequest, NextResponse } from 'next/server';

const CONFIG_PATH = '/home/moltbot/.nanobot/config.json';

export async function GET() {
  try {
    const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
    return NextResponse.json(config.providers || {});
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read config' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const updatedProviders = await req.json();
    const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
    
    config.providers = updatedProviders;
    
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update config' }, { status: 500 });
  }
}
