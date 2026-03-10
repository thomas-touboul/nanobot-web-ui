import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CONFIG_PATH = '/home/moltbot/.nanobot/config.json';

export async function GET() {
  try {
    if (!fs.existsSync(CONFIG_PATH)) {
      return NextResponse.json({ hooks: [] });
    }

    const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
    // Nanobot doesn't have a native 'hooks' section, so we use a custom one
    return NextResponse.json({ hooks: config.custom?.hooks || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { hooks } = await request.json();
    
    if (!fs.existsSync(CONFIG_PATH)) {
      return NextResponse.json({ error: 'Config file not found' }, { status: 404 });
    }

    const config = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf-8'));
    
    if (!config.custom) config.custom = {};
    config.custom.hooks = hooks;

    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8');
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
