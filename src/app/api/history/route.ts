import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getResolverFromRequest } from '@/lib/server/request-agent';

interface HistoryEntry {
  cursor: number;
  timestamp: string;
  content: string;
}

export async function GET(request: Request) {
  const resolver = getResolverFromRequest(request);
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.toLowerCase();
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');

  // Try new JSONL format first, fallback to legacy HISTORY.md
  const memoryDir = resolver.memoryDir();
  const jsonlPath = path.join(memoryDir, 'history.jsonl');
  const mdPath = path.join(memoryDir, 'HISTORY.md');
  
  let useJsonl = fs.existsSync(jsonlPath);
  const historyPath = useJsonl ? jsonlPath : (fs.existsSync(mdPath) ? mdPath : null);

  if (!historyPath) {
    return NextResponse.json({ entries: [], total: 0, page, totalPages: 0 });
  }

  try {
    const entries: { date: string; content: string }[] = [];

    if (useJsonl) {
      // Parse JSONL format
      const content = fs.readFileSync(historyPath, 'utf-8');
      const lines = content.split('\n').filter(line => line.trim());
      
      for (const line of lines) {
        try {
          const entry: HistoryEntry = JSON.parse(line);
          if (!query || 
              entry.content.toLowerCase().includes(query) || 
              entry.timestamp.includes(query)) {
            entries.push({ 
              date: entry.timestamp, 
              content: entry.content 
            });
          }
        } catch {
          // Skip malformed JSON lines
        }
      }
    } else {
      // Parse legacy Markdown format
      const content = fs.readFileSync(historyPath, 'utf-8');
      const entryRegex = /\[([^\]]+)\] ([\s\S]*?)(?=\n\[[^\]]+\]|$)/g;
      let match;

      while ((match = entryRegex.exec(content)) !== null) {
        const date = match[1];
        const text = match[2].trim();

        if (!query || text.toLowerCase().includes(query) || date.includes(query)) {
          entries.push({ date, content: text });
        }
      }
    }

    // Sort by date descending (newest first)
    entries.reverse();

    // Pagination
    const total = entries.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const paginatedEntries = entries.slice(startIndex, startIndex + limit);

    return NextResponse.json({ 
      entries: paginatedEntries, 
      total, 
      page, 
      totalPages,
      limit,
      format: useJsonl ? 'jsonl' : 'markdown'
    });
  } catch (error) {
    console.error('Error reading history:', error);
    return NextResponse.json({ error: 'Failed to read history' }, { status: 500 });
  }
}
