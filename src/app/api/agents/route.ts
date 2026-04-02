import { NextResponse } from 'next/server';
import { discoverAgents } from '@/lib/server/agents';

export async function GET() {
  try {
    const agents = discoverAgents();
    return NextResponse.json({ agents });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
