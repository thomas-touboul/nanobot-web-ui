import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const WORKSPACE_PATH = process.env.WORKSPACE_PATH || '/home/moltbot/.nanobot/workspace';
const SUBAGENTS_FILE = path.join(WORKSPACE_PATH, 'memory/subagents.json');

export async function GET() {
  try {
    if (!fs.existsSync(SUBAGENTS_FILE)) {
      return NextResponse.json([]);
    }
    const data = fs.readFileSync(SUBAGENTS_FILE, 'utf8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading subagents:', error);
    return NextResponse.json({ error: 'Failed to read subagents data' }, { status: 500 });
  }
}
