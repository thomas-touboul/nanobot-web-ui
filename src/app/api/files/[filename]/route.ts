import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

const CONFIG_ROOT = '/home/moltbot/.openclaw';

// Helper to validate filename to prevent path traversal
function isValidFile(filename: string) {
  const allowedFiles = [
    'openclaw.json',
    'SOUL.md',
    'MEMORY.md',
    'AGENTS.md',
    'TOOLS.md',
    'IDENTITY.md',
    'USER.md',
    'HEARTBEAT.md',
  ];
  return allowedFiles.includes(filename);
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  if (!isValidFile(filename)) {
    return NextResponse.json({ error: 'File not found or unauthorized' }, { status: 404 });
  }

  try {
    const filePath = path.join(CONFIG_ROOT, filename);
    const content = fs.readFileSync(filePath, 'utf-8');
    return NextResponse.json({ content });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read file' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  const { content } = await request.json();

  if (!isValidFile(filename)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    const filePath = path.join(CONFIG_ROOT, filename);
    
    // Create a backup first
    fs.copyFileSync(filePath, `${filePath}.bak`);
    
    // Write new content
    fs.writeFileSync(filePath, content, 'utf-8');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to write file' }, { status: 500 });
  }
}
