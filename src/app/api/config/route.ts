import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { getResolverFromRequest } from '@/lib/server/request-agent';

export async function GET(request: Request) {
  try {
    const resolver = getResolverFromRequest(request);
    const configPath = resolver.config();

    if (!fs.existsSync(configPath)) {
      return NextResponse.json({ error: 'Config not found' }, { status: 404 });
    }

    const content = fs.readFileSync(configPath, 'utf-8');
    const config = JSON.parse(content);
    
    return NextResponse.json(config);
  } catch (error) {
    console.error('Failed to read config:', error);
    return NextResponse.json({ error: 'Failed to read config' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const updates = await request.json();
    const resolver = getResolverFromRequest(request);
    const configPath = resolver.config();

    // Read existing config
    let config = {};
    if (fs.existsSync(configPath)) {
      const content = fs.readFileSync(configPath, 'utf-8');
      config = JSON.parse(content);
    }

    // Deep merge updates
    const mergedConfig = deepMerge(config, updates);

    // Create backup
    if (fs.existsSync(configPath)) {
      fs.copyFileSync(configPath, `${configPath}.bak`);
    }

    // Ensure directory exists
    const configDir = path.dirname(configPath);
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true });
    }

    // Write new config
    fs.writeFileSync(configPath, JSON.stringify(mergedConfig, null, 2), 'utf-8');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to write config:', error);
    return NextResponse.json({ error: 'Failed to write config' }, { status: 500 });
  }
}

// Deep merge utility
function deepMerge(target: any, source: any): any {
  const output = { ...target };
  
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      output[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      output[key] = source[key];
    }
  }
  
  return output;
}
