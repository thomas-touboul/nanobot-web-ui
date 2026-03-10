import { NextRequest, NextResponse } from 'next/server';
import { execSync } from 'child_process';

export async function GET() {
  try {
    // We use the nanobot CLI to list cron jobs
    const output = execSync('/home/moltbot/.local/bin/nanobot cron list', { encoding: 'utf-8' });
    
    // Simple parsing of the output (assuming it's a list of jobs)
    // If the output is JSON, we'd parse it differently. 
    // For now, let's assume we need to parse the text output or it returns JSON.
    try {
      const jobs = JSON.parse(output);
      return NextResponse.json(jobs);
    } catch {
      // Fallback if it's just text
      return NextResponse.json({ raw: output });
    }
  } catch (error) {
    console.error('Failed to fetch cron jobs:', error);
    return NextResponse.json({ error: 'Failed to fetch cron jobs' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
    }

    execSync(`/home/moltbot/.local/bin/nanobot cron remove --job_id ${id}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete cron job:', error);
    return NextResponse.json({ error: 'Failed to delete cron job' }, { status: 500 });
  }
}
