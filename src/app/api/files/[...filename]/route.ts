import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';
import { getResolverFromRequest } from '@/lib/server/request-agent';

function getSafePath(pathSegments: string[], resolver: any): string | null {
  const relPath = path.join(...pathSegments);
  
  // Build the full path using the resolver
  let fullPath: string;
  
  // Determine the type of file and use appropriate resolver method
  if (relPath === 'config.json') {
    fullPath = resolver.config();
  } else if (relPath.startsWith('workspace/memory/') && relPath.endsWith('.md')) {
    const filename = path.basename(relPath);
    fullPath = resolver.memoryFile(filename);
  } else if (relPath === 'workspace/SOUL.md') {
    fullPath = resolver.coreFile('SOUL.md');
  } else if (relPath === 'workspace/AGENTS.md') {
    fullPath = resolver.coreFile('AGENTS.md');
  } else if (relPath === 'workspace/TOOLS.md') {
    fullPath = resolver.coreFile('TOOLS.md');
  } else if (relPath === 'workspace/USER.md') {
    fullPath = resolver.coreFile('USER.md');
  } else if (relPath === 'workspace/HEARTBEAT.md') {
    fullPath = resolver.coreFile('HEARTBEAT.md');
  } else if (relPath === 'workspace/memory/HISTORY.md') {
    fullPath = resolver.historyFile();
  } else {
    // Skills: workspace/skills/<folder>/SKILL.md
    const segments = relPath.split(path.sep);
    if (segments.length === 4 && 
        segments[0] === 'workspace' && 
        segments[1] === 'skills' && 
        segments[3] === 'SKILL.md') {
        fullPath = resolver.skillFile(segments[2]);
    } else {
      return null;
    }
  }

  // Security: ensure the resolved path is within the agent's root
  if (!resolver.isWithinAgent(fullPath)) {
    return null;
  }

  return fullPath;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string[] }> }
) {
  const resolver = getResolverFromRequest(request);
  const { filename } = await params;
  const filePath = getSafePath(filename, resolver);

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
  const resolver = getResolverFromRequest(request);
  const { filename } = await params;
  const { content } = await request.json();
  const filePath = getSafePath(filename, resolver);

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
