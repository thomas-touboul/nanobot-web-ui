import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

const CONFIG_ROOT = '/home/moltbot/.openclaw';

export async function GET() {
  try {
    const files = [
      'openclaw.json',
      'SOUL.md',
      'MEMORY.md',
      'AGENTS.md',
      'TOOLS.md',
      'IDENTITY.md',
      'USER.md',
      'HEARTBEAT.md',
    ];

    const fileData = files.map((file) => {
      const filePath = path.join(CONFIG_ROOT, file);
      if (fs.existsSync(filePath)) {
        return {
          name: file,
          path: filePath,
          type: file.endsWith('.json') ? 'json' : 'markdown',
        };
      }
      return null;
    }).filter(Boolean);

    return NextResponse.json({ files: fileData });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to list files' }, { status: 500 });
  }
}
