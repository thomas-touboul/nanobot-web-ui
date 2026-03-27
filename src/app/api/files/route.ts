import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getDefaultResolver } from '@/lib/server/agent-paths';

export async function GET() {
  try {
    const resolver = getDefaultResolver();
    const root = resolver.root();
    const workspace = resolver.workspace();

    const rootFiles = [
      { name: 'config.json', path: path.join(root, 'config.json'), type: 'json' },
    ];

    const workspaceFiles = [
      { name: 'SOUL.md', path: resolver.coreFile('SOUL.md'), type: 'markdown' },
      { name: 'MEMORY.md', path: resolver.memoryFile('MEMORY.md'), type: 'markdown' },
      { name: 'AGENTS.md', path: resolver.coreFile('AGENTS.md'), type: 'markdown' },
      { name: 'TOOLS.md', path: resolver.coreFile('TOOLS.md'), type: 'markdown' },
      { name: 'USER.md', path: resolver.coreFile('USER.md'), type: 'markdown' },
      { name: 'HEARTBEAT.md', path: resolver.coreFile('HEARTBEAT.md'), type: 'markdown' },
    ];

    const allFiles = [...rootFiles, ...workspaceFiles].filter(f => fs.existsSync(f.path));

    return NextResponse.json({ 
      files: allFiles.map(f => ({
        name: f.name,
        // We return a relative path from root to be used by the [...filename] route
        path: resolver.getRelativePath(f.path) || f.name,
        type: f.type
      }))
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to list files' }, { status: 500 });
  }
}
