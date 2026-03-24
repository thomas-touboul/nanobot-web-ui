import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const CRON_JOBS_PATH = '/home/moltbot/.nanobot/workspace/cron/jobs.json';

interface CronJob {
  id: string;
  name: string;
  enabled: boolean;
  schedule: {
    kind: "at" | "every" | "cron";
    expr?: string;
    tz?: string;
    atMs?: number;
    everyMs?: number;
  };
  payload: {
    kind: string;
    message: string;
    deliver?: boolean;
    channel?: string;
    to?: string;
  };
  state: {
    nextRunAtMs?: number;
    lastRunAtMs?: number;
    lastStatus?: string;
    lastError?: string;
  };
  createdAtMs: number;
  updatedAtMs: number;
  deleteAfterRun: boolean;
}

function generateId(): string {
  return crypto.randomBytes(4).toString('hex');
}

function loadJobs(): { version: number; jobs: CronJob[] } {
  if (!fs.existsSync(CRON_JOBS_PATH)) {
    return { version: 1, jobs: [] };
  }
  
  const fileContent = fs.readFileSync(CRON_JOBS_PATH, 'utf-8');
  const data = JSON.parse(fileContent);
  return {
    version: data.version || 1,
    jobs: data.jobs || []
  };
}

function saveJobs(data: { version: number; jobs: CronJob[] }) {
  const dir = path.dirname(CRON_JOBS_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(CRON_JOBS_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

export async function GET() {
  try {
    const data = loadJobs();
    return NextResponse.json(data.jobs);
  } catch (error) {
    console.error('Failed to fetch cron jobs:', error);
    return NextResponse.json({ error: 'Failed to fetch cron jobs' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const data = loadJobs();
    
    const now = Date.now();
    const newJob: CronJob = {
      id: generateId(),
      name: body.name || "Untitled Job",
      enabled: body.enabled ?? true,
      schedule: {
        kind: body.schedule?.kind || "cron",
        expr: body.schedule?.expr,
        tz: body.schedule?.tz,
        atMs: body.schedule?.atMs,
        everyMs: body.schedule?.everyMs
      },
      payload: {
        kind: body.payload?.kind || "agent_turn",
        message: body.payload?.message || "",
        deliver: body.payload?.deliver ?? false,
        channel: body.payload?.channel,
        to: body.payload?.to
      },
      state: {
        nextRunAtMs: undefined,
        lastRunAtMs: undefined,
        lastStatus: undefined,
        lastError: undefined
      },
      createdAtMs: now,
      updatedAtMs: now,
      deleteAfterRun: false
    };

    data.jobs.push(newJob);
    saveJobs(data);
    
    return NextResponse.json(newJob, { status: 201 });
  } catch (error) {
    console.error('Failed to create cron job:', error);
    return NextResponse.json({ error: 'Failed to create cron job' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    
    if (!body.id) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
    }

    const data = loadJobs();
    const jobIndex = data.jobs.findIndex((j: CronJob) => j.id === body.id);
    
    if (jobIndex === -1) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    const now = Date.now();
    const updatedJob: CronJob = {
      ...data.jobs[jobIndex],
      name: body.name ?? data.jobs[jobIndex].name,
      enabled: body.enabled ?? data.jobs[jobIndex].enabled,
      schedule: {
        ...data.jobs[jobIndex].schedule,
        kind: body.schedule?.kind ?? data.jobs[jobIndex].schedule.kind,
        expr: body.schedule?.expr ?? data.jobs[jobIndex].schedule.expr,
        tz: body.schedule?.tz ?? data.jobs[jobIndex].schedule.tz,
        atMs: body.schedule?.atMs ?? data.jobs[jobIndex].schedule.atMs,
        everyMs: body.schedule?.everyMs ?? data.jobs[jobIndex].schedule.everyMs
      },
      payload: {
        ...data.jobs[jobIndex].payload,
        kind: body.payload?.kind ?? data.jobs[jobIndex].payload.kind,
        message: body.payload?.message ?? data.jobs[jobIndex].payload.message,
        deliver: body.payload?.deliver ?? data.jobs[jobIndex].payload.deliver,
        channel: body.payload?.channel ?? data.jobs[jobIndex].payload.channel,
        to: body.payload?.to ?? data.jobs[jobIndex].payload.to
      },
      updatedAtMs: now
    };

    data.jobs[jobIndex] = updatedJob;
    saveJobs(data);
    
    return NextResponse.json(updatedJob);
  } catch (error) {
    console.error('Failed to update cron job:', error);
    return NextResponse.json({ error: 'Failed to update cron job' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
    }

    const data = loadJobs();
    const initialLength = data.jobs.length;
    data.jobs = data.jobs.filter((job: CronJob) => job.id !== id);
    
    if (data.jobs.length === initialLength) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    saveJobs(data);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete cron job:', error);
    return NextResponse.json({ error: 'Failed to delete cron job' }, { status: 500 });
  }
}
