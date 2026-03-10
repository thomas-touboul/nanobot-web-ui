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
  job_id: string;
  message: string;
  at?: string;
  cron_expr?: string;
  every_seconds?: number;
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
        setJobs(jobs.filter(j => j.job_id !== id));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(null);
    }
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
          {jobs.map((job) => (
            <div 
              key={job.job_id}
              className="group bg-card border border-border rounded-2xl p-6 hover:border-rose-500/20 transition-all duration-300"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-rose-500/10 rounded-lg">
                      <Clock className="w-4 h-4 text-rose-500" />
                    </div>
                    <span className="text-xs font-mono text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                      ID: {job.job_id}
                    </span>
                  </div>
                  
                  <p className="text-foreground font-medium leading-relaxed">
                    {job.message}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {job.at && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-600 px-2 py-1 rounded-md">
                        Once: {new Date(job.at).toLocaleString()}
                      </span>
                    )}
                    {job.cron_expr && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-500/10 text-purple-600 px-2 py-1 rounded-md">
                        Cron: {job.cron_expr}
                      </span>
                    )}
                    {job.every_seconds && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 px-2 py-1 rounded-md">
                        Every {job.every_seconds}s
                      </span>
                    )}
                  </div>
                </div>

                <button 
                  onClick={() => handleDelete(job.job_id)}
                  disabled={deleting === job.job_id}
                  className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all"
                >
                  {deleting === job.job_id ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Trash2 className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
