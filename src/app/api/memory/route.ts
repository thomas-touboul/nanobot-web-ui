import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const MEMORY_ROOT = '/home/moltbot/.openclaw/memory';

export async function GET() {
  if (!fs.existsSync(MEMORY_ROOT)) {
    return NextResponse.json({ files: [] });
  }

  try {
    const entries = fs.readdirSync(MEMORY_ROOT, { withFileTypes: true });
    const files = entries
      .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
      .map((entry) => {
        const stats = fs.statSync(path.join(MEMORY_ROOT, entry.name));
        return {
          name: entry.name,
          path: `memory/${entry.name}`,
          updatedAt: stats.mtime,
          size: stats.size,
        };
      })
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());

    return NextResponse.json({ files });
  } catch (error) {
    console.error('Error reading memory files:', error);
    return NextResponse.json({ error: 'Failed to list memory files' }, { status: 500 });
  }
}
