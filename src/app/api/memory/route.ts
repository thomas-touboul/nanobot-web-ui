import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getDefaultResolver } from '@/lib/server/agent-paths';

export async function GET() {
  try {
    const resolver = getDefaultResolver();
    const memoryDir = resolver.memoryDir();
    const files: any[] = [];

    if (fs.existsSync(memoryDir)) {
      const memoryEntries = fs.readdirSync(memoryDir, { withFileTypes: true });
      memoryEntries.forEach((entry) => {
        // Exclude dated files (YYYY-MM-DD.md) and non-markdown
        if (entry.isFile() && entry.name.endsWith('.md') && !/^\d{4}-\d{2}-\d{2}\.md$/.test(entry.name)) {
          const stats = fs.statSync(path.join(memoryDir, entry.name));
      files.push({
        name: entry.name,
        path: `workspace/memory/${entry.name}`,
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

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    if (!filename) {
      return NextResponse.json({ error: 'Filename is required' }, { status: 400 });
    }

    // Security: only allow .md files in memory/
    if (!filename.endsWith('.md')) {
      return NextResponse.json({ error: 'Only .md files can be deleted' }, { status: 400 });
    }

    // Security: prevent deletion of core system files
    if (filename === 'MEMORY.md' || filename === 'HISTORY.md') {
      return NextResponse.json({ error: 'Cannot delete core system files' }, { status: 403 });
    }

    const resolver = getDefaultResolver();
    const filePath = resolver.memoryFile(filename);

    // Check if file exists and is within memory directory
    if (!fs.existsSync(filePath) || !resolver.isWithinAgent(filePath)) {
      return NextResponse.json({ error: 'File not found or access denied' }, { status: 404 });
    }

    fs.unlinkSync(filePath);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting memory file:', error);
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
  }
}
