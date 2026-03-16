"use client";

import { useEffect, useState } from "react";
import { 
  Activity, 
  Trash2, 
  Loader2, 
  Calendar,
  Clock,
  AlertCircle
} from "lucide-react";
import { HeaderWithIcon } from "@/components/HeaderWithIcon";
import { UI_TEXT } from "@/constants/ui-text";

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
}

export default function CronPage() {
  const [jobs, setJobs] = useState<CronJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/cron");
      const data = await res.json();
      if (Array.isArray(data)) {
        setJobs(data);
      } else if (data.raw) {
        // Handle raw text if needed, but ideally API returns array
        setJobs([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      const res = await fetch(`/api/cron?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setJobs(jobs.filter(j => j.id !== id));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(null);
    }
  };

  const formatSchedule = (job: CronJob) => {
    const { schedule } = job;
    if (schedule.kind === "at" && schedule.atMs) {
      return { label: "Once", value: new Date(schedule.atMs).toLocaleString() };
    }
    if (schedule.kind === "cron" && schedule.expr) {
      return { label: "Cron", value: schedule.expr };
    }
    if (schedule.kind === "every" && schedule.everyMs) {
      const seconds = Math.floor(schedule.everyMs / 1000);
      return { label: "Every", value: `${seconds}s` };
    }
    return { label: "Unknown", value: "" };
  };

  return (
    <div className="space-y-8 container max-w-7xl py-8 animate-fade-in pb-20">
      <HeaderWithIcon 
        title={UI_TEXT.pages.schedule.title} 
        subtitle={UI_TEXT.pages.schedule.subtitle}
        icon={UI_TEXT.navigation.schedule.icon}
        iconColorClass={UI_TEXT.navigation.schedule.color}
        iconBgClass={UI_TEXT.navigation.schedule.bgColor}
        iconBorderClass={UI_TEXT.navigation.schedule.borderColor}
      />

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-rose-500/50" />
          <p className="text-muted-foreground animate-pulse">Loading scheduled tasks...</p>
        </div>
      ) : jobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-secondary/20 border border-dashed border-border rounded-3xl gap-4">
          <div className="p-4 bg-background rounded-full shadow-sm">
            <Calendar className="w-8 h-8 text-muted-foreground/50" />
          </div>
          <div className="text-center">
            <p className="text-foreground font-medium">No scheduled tasks found</p>
            <p className="text-muted-foreground text-sm">Tasks created via the 'cron' skill will appear here.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => {
            const scheduleInfo = formatSchedule(job);
            return (
              <div 
                key={job.id}
                className={`group bg-card border rounded-2xl p-6 hover:border-rose-500/20 transition-all duration-300 ${job.enabled ? 'border-border' : 'border-border/50 opacity-60'}`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-3 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <div className="p-1.5 bg-rose-500/10 rounded-lg">
                        <Clock className="w-4 h-4 text-rose-500" />
                      </div>
                      <span className="text-xs font-medium text-foreground truncate">
                        {job.name}
                      </span>
                      {!job.enabled && (
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-gray-500/10 text-gray-600 px-2 py-0.5 rounded">
                          Disabled
                        </span>
                      )}
                      {job.state.lastStatus === "error" && (
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-red-500/10 text-red-600 px-2 py-0.5 rounded flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Error
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {job.payload.message}
                    </p>

                    <div className="flex flex-wrap gap-2 items-center">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${
                        job.schedule.kind === "cron" ? "bg-purple-500/10 text-purple-600" :
                        job.schedule.kind === "at" ? "bg-blue-500/10 text-blue-600" :
                        "bg-amber-500/10 text-amber-600"
                      }`}>
                        {scheduleInfo.label}: {scheduleInfo.value}
                      </span>
                      {job.schedule.tz && (
                        <span className="text-[10px] text-muted-foreground">
                          {job.schedule.tz}
                        </span>
                      )}
                    </div>

                    {job.state.nextRunAtMs && (
                      <p className="text-[10px] text-muted-foreground">
                        Next run: {new Date(job.state.nextRunAtMs).toLocaleString()}
                      </p>
                    )}
                  </div>

                  <button 
                    onClick={() => handleDelete(job.id)}
                    disabled={deleting === job.id}
                    className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all shrink-0"
                  >
                    {deleting === job.id ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Trash2 className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
