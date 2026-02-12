import fs from 'fs';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

const CONFIG_ROOT = '/home/moltbot/.openclaw';

// Helper to validate filename and return absolute path if valid
function getSafePath(pathSegments: string[]): string | null {
  // Normalize segments to prevent '..' injection in individual segments
  // (Next.js usually handles this, but good to be safe)
  if (pathSegments.some(seg => seg.includes('..') || seg.includes('/') || seg.includes('\\'))) {
     // This check is slightly paranoid as segments are split by slash, 
     // but if a segment contains explicit dot-dot it's suspicious.
     // Standard path.join handles '..' by resolving up, so we check the final result below.
  }

  const relPath = path.join(...pathSegments);
  const fullPath = path.join(CONFIG_ROOT, relPath);

  // 1. Prevent Directory Traversal
  if (!fullPath.startsWith(CONFIG_ROOT)) {
    return null;
  }

  // 2. Allowlist for Root Files
  const allowedRootFiles = [
    'openclaw.json',
    'SOUL.md',
    'MEMORY.md',
    'AGENTS.md',
    'TOOLS.md',
    'IDENTITY.md',
    'USER.md',
    'HEARTBEAT.md',
  ];

  // Check if it's a root file (single segment usually, or match exact relative path)
  if (allowedRootFiles.includes(relPath)) {
    return fullPath;
  }

  // 3. Pattern match for Skills: skills/<folder>/SKILL.md
  // We strictly require structure: skills -> <folder> -> SKILL.md
  if (pathSegments.length === 3 && 
      pathSegments[0] === 'skills' && 
      pathSegments[2] === 'SKILL.md') {
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
    // Create a backup if file exists
    if (fs.existsSync(filePath)) {
        fs.copyFileSync(filePath, `${filePath}.bak`);
    }
    
    // Write new content
    // Ensure directory exists (rare case where folder exists but file doesn't)
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
        return NextResponse.json({ error: 'Directory does not exist' }, { status: 400 });
    }

    fs.writeFileSync(filePath, content, 'utf-8');
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to write file' }, { status: 500 });
  }
}
