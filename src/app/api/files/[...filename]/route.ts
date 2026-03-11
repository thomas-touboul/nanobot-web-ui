import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

const CONFIG_ROOT = '/home/moltbot/.nanobot';

function getSafePath(pathSegments: string[]): string | null {
  let relPath = path.join(...pathSegments);
  
  // If the path doesn't start with workspace/, prepend it if it's a known location
  if (!relPath.startsWith('workspace/') && !relPath.startsWith('config.json')) {
    relPath = path.join('workspace', relPath);
  }

  const fullPath = path.join(CONFIG_ROOT, relPath);

  // Prevent Directory Traversal
  if (!fullPath.startsWith(CONFIG_ROOT)) {
    return null;
  }

  // Allowed files (relative to CONFIG_ROOT)
  const allowedFiles = [
    'config.json',
    'workspace/SOUL.md',
    'workspace/memory/MEMORY.md',
    'workspace/AGENTS.md',
    'workspace/TOOLS.md',
    'workspace/USER.md',
    'workspace/HEARTBEAT.md',
    'workspace/memory/HISTORY.md',
  ];

  if (allowedFiles.includes(relPath)) {
    return fullPath;
  }

  // Skills: workspace/skills/<folder>/SKILL.md
  const segments = relPath.split(path.sep);
  if (segments.length === 4 && 
      segments[0] === 'workspace' && 
      segments[1] === 'skills' && 
      segments[3] === 'SKILL.md') {
      return fullPath;
  }

  // Memory: workspace/memory/*.md
  if (segments.length === 3 && 
      segments[0] === 'workspace' && 
      segments[1] === 'memory' && 
      segments[2].endsWith('.md')) {
      return fullPath;
  }

  return null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string[] }> }
) {
  const { filename } = await params;
  const filePath = getSafePath(filename);

  if (!filePath || !fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'File not found or unauthorized' }, { status: 404 });
  }

  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return NextResponse.json({ content });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read file' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string[] }> }
) {
  const { filename } = await params;
  const { content } = await request.json();
  const filePath = getSafePath(filename);

  if (!filePath) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  }

  try {
    if (fs.existsSync(filePath)) {
        fs.copyFileSync(filePath, `${filePath}.bak`);
    }
    
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filePath, content, 'utf-8');
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to write file' }, { status: 500 });
  }
}
