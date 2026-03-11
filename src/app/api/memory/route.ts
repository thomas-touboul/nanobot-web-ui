import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const WORKSPACE_ROOT = '/home/moltbot/.nanobot/workspace';
const MEMORY_DIR = path.join(WORKSPACE_ROOT, 'memory');

export async function GET() {
  try {
    const files: any[] = [];

    // Scan memory directory only
    if (fs.existsSync(MEMORY_DIR)) {
      const memoryEntries = fs.readdirSync(MEMORY_DIR, { withFileTypes: true });
      memoryEntries.forEach((entry) => {
        // Exclude dated files (YYYY-MM-DD.md) and non-markdown
        if (entry.isFile() && entry.name.endsWith('.md') && !/^\d{4}-\d{2}-\d{2}\.md$/.test(entry.name)) {
          const stats = fs.statSync(path.join(MEMORY_DIR, entry.name));
          files.push({
            name: entry.name,
            path: `memory/${entry.name}`,
            updatedAt: stats.mtime,
            size: stats.size
          });
        }
      });
    }

    // Sort by name
    files.sort((a, b) => a.name.localeCompare(b.name));

    return NextResponse.json({ files });
  } catch (error) {
    console.error('Error reading memory files:', error);
    return NextResponse.json({ error: 'Failed to list memory files' }, { status: 500 });
  }
}
