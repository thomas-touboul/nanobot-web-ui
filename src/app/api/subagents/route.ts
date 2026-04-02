import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getResolverFromRequest } from '@/lib/server/request-agent';

export async function GET(request: Request) {
  try {
    const resolver = getResolverFromRequest(request);
    const subagentsFile = path.join(resolver.memoryDir(), 'subagents.json');

    if (!fs.existsSync(subagentsFile)) {
      return NextResponse.json([]);
    }
    const data = fs.readFileSync(subagentsFile, 'utf8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading subagents:', error);
    return NextResponse.json({ error: 'Failed to read subagents data' }, { status: 500 });
  }
}
