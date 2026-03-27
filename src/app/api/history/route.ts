import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getDefaultResolver } from '@/lib/server/agent-paths';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.toLowerCase();
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');

  const resolver = getDefaultResolver();
  const historyPath = resolver.historyFile();

  if (!fs.existsSync(historyPath)) {
    return NextResponse.json({ entries: [], total: 0, page, totalPages: 0 });
  }

  try {
    const content = fs.readFileSync(historyPath, 'utf-8');
    
    // Regex to match any [timestamp] format, including ranges like "YYYY-MM-DD to YYYY-MM-DD" or "YYYY-MM-DD HH:mm-HH:mm"
    const entryRegex = /\[([^\]]+)\] ([\s\S]*?)(?=\n\[[^\]]+\]|$)/g;
    
    const entries = [];
    let match;

    while ((match = entryRegex.exec(content)) !== null) {
      const date = match[1];
      const text = match[2].trim();

      if (!query || text.toLowerCase().includes(query) || date.includes(query)) {
        entries.push({ date, content: text });
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
      limit 
    });
  } catch (error) {
    console.error('Error reading history:', error);
    return NextResponse.json({ error: 'Failed to read history' }, { status: 500 });
  }
}
