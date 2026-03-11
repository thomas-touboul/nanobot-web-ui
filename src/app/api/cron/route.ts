import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { os } from 'os';

const CRON_JOBS_PATH = '/home/moltbot/.nanobot/cron/jobs.json';

export async function GET() {
  try {
    if (!fs.existsSync(CRON_JOBS_PATH)) {
      return NextResponse.json({ jobs: [], version: 1 });
    }
    
    const fileContent = fs.readFileSync(CRON_JOBS_PATH, 'utf-8');
    const data = JSON.parse(fileContent);
    
    // Return the jobs array if it exists, otherwise the whole object
    return NextResponse.json(data.jobs || data);
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

    if (!fs.existsSync(CRON_JOBS_PATH)) {
      return NextResponse.json({ error: 'Cron jobs file not found' }, { status: 404 });
    }

    const fileContent = fs.readFileSync(CRON_JOBS_PATH, 'utf-8');
    const data = JSON.parse(fileContent);
    
    if (data.jobs && Array.isArray(data.jobs)) {
      data.jobs = data.jobs.filter((job: any) => job.job_id !== id);
      fs.writeFileSync(CRON_JOBS_PATH, JSON.stringify(data, null, 2));
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid cron jobs format' }, { status: 500 });
  } catch (error) {
    console.error('Failed to delete cron job:', error);
    return NextResponse.json({ error: 'Failed to delete cron job' }, { status: 500 });
  }
}
