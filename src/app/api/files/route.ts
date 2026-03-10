import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const ROOT = '/home/moltbot/.nanobot';
const WORKSPACE = path.join(ROOT, 'workspace');

export async function GET() {
  try {
    const rootFiles = [
      { name: 'config.json', path: path.join(ROOT, 'config.json'), type: 'json' },
    ];

    const workspaceFiles = [
      { name: 'SOUL.md', path: path.join(WORKSPACE, 'SOUL.md'), type: 'markdown' },
      { name: 'MEMORY.md', path: path.join(WORKSPACE, 'memory/MEMORY.md'), type: 'markdown' },
      { name: 'AGENTS.md', path: path.join(WORKSPACE, 'AGENTS.md'), type: 'markdown' },
      { name: 'TOOLS.md', path: path.join(WORKSPACE, 'TOOLS.md'), type: 'markdown' },
      { name: 'USER.md', path: path.join(WORKSPACE, 'USER.md'), type: 'markdown' },
      { name: 'HEARTBEAT.md', path: path.join(WORKSPACE, 'HEARTBEAT.md'), type: 'markdown' },
    ];

    const allFiles = [...rootFiles, ...workspaceFiles].filter(f => fs.existsSync(f.path));

    return NextResponse.json({ 
      files: allFiles.map(f => ({
        name: f.name,
        // We return a relative path from ROOT to be used by the [...filename] route
        path: path.relative(ROOT, f.path),
        type: f.type
      }))
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to list files' }, { status: 500 });
  }
}
