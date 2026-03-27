import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function GET() {
  try {
    // Get last 10 entries from journalctl for nanobot-gateway user service
    const { stdout } = await execAsync('journalctl --user -u nanobot-gateway -n 10 --no-pager', {
      maxBuffer: 1024 * 1024 // 1MB buffer
    });

    const lines = stdout.split('\n').filter(line => line.trim() !== '');

    return NextResponse.json({ 
      logs: lines,
      count: lines.length,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Error fetching gateway logs:', error);
    
    // If journalctl fails (e.g., service not found), return empty array
    if (error.code === 1) {
      return NextResponse.json({ 
        logs: [], 
        count: 0, 
        timestamp: new Date().toISOString(),
        error: 'No logs found or service not running'
      });
    }

    return NextResponse.json({ 
      error: 'Failed to fetch logs' 
    }, { status: 500 });
  }
}
