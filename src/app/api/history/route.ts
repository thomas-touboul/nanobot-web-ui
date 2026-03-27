import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getDefaultResolver } from '@/lib/server/agent-paths';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.toLowerCase();

  const resolver = getDefaultResolver();
  const historyPath = resolver.historyFile();

  if (!fs.existsSync(historyPath)) {
    return NextResponse.json({ entries: [] });
  }

  try {
    const content = fs.readFileSync(historyPath, 'utf-8');
    
    // Regex to match [YYYY-MM-DD HH:mm] or [YYYY-MM-DD HH:mm-HH:mm] Content
    const entryRegex = /\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2}(?:-\d{2}:\d{2})?)\] ([\s\S]*?)(?=\n\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}(?:-\d{2}:\d{2})?\]|$)/g;
    
    const entries = [];
    let match;

    while ((match = entryRegex.exec(content)) !== null) {
      const date = match[1];
      const text = match[2].trim();

      if (!query || text.toLowerCase().includes(query) || date.includes(query)) {
        entries.push({ date, content: text });
      }
    }

    // Return entries sorted by date descending (newest first)
    return NextResponse.json({ 
      entries: entries.reverse() 
    });
  } catch (error) {
    console.error('Error reading history:', error);
    return NextResponse.json({ error: 'Failed to read history' }, { status: 500 });
  }
}
