import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import { getDefaultResolver } from '@/lib/server/agent-paths';

const execAsync = promisify(exec);

export async function POST(req: NextRequest) {
  try {
    const { message, sessionId } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const resolver = getDefaultResolver();
    const workspace = resolver.workspace();
    const config = resolver.config();
    
    // Construct command
    // Using --session to maintain context if provided
    const sessionArg = sessionId ? `--session "${sessionId}"` : '';
    const command = `nanobot agent -m "${message.replace(/"/g, '\\"')}" ${sessionArg} --workspace "${workspace}" --config "${config}" --no-markdown`;

    console.log(`Executing chat command: ${command}`);

    const { stdout, stderr } = await execAsync(command);

    if (stderr && !stdout) {
      console.error(`CLI Error: ${stderr}`);
      return NextResponse.json({ error: stderr }, { status: 500 });
    }

    // Clean the output
    let cleanResponse = stdout.trim();
    
    // Split into lines
    const lines = cleanResponse.split('\n');
    
    // Find where the actual message starts
    // We look for the "🐈 nanobot" line or the first line after metadata
    let startIndex = 0;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line.includes('Using config:') || line.includes('Hint:')) {
        startIndex = i + 1;
        continue;
      }
      if (line === '🐈 nanobot' || line.startsWith('🐈 nanobot ')) {
        startIndex = i + 1;
        break;
      }
      if (line !== '') {
        // If we found a non-empty line that isn't metadata, and we haven't found the nanobot prefix yet
        // but we're past metadata, this might be the message.
        // However, we'll keep looking for the explicit prefix.
      }
    }

    cleanResponse = lines.slice(startIndex).join('\n').trim();

    // Final safety: remove the prefix if it's still there (some versions might put it on the same line)
    cleanResponse = cleanResponse.replace(/^🐈\s+nanobot\s*/i, '');

    // Nanobot agent command usually returns the assistant's response in stdout
    return NextResponse.json({ 
      response: cleanResponse.trim() || stdout.trim(), // Fallback to raw if cleaning emptied it
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to communicate with the agent' 
    }, { status: 500 });
  }
}
