"use client";

import { useEffect, useState } from "react";
import { 
  Trash2, 
  Loader2, 
  Calendar,
  Clock,
  AlertCircle,
  Plus,
  Pencil,
  X,
  Check
} from "lucide-react";
import { HeaderWithIcon } from "@/components/HeaderWithIcon";
import { useTranslation } from "@/contexts/LanguageContext";
import { UI_ICONS, UI_STYLES } from "@/constants/ui-text";
import { agentFetch } from "@/lib/api-client";
import { useAgent } from "@/contexts/AgentContext";

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

const emptyJob: Partial<CronJob> = {
  name: "",
  enabled: true,
  schedule: {
    kind: "cron",
    expr: "0 9 * * *",
    tz: "Europe/Paris"
  },
  payload: {
    kind: "agent_turn",
    message: "",
    deliver: false,
    channel: "",
    to: ""
  }
};

export default function CronPage() {
  const [jobs, setJobs] = useState<CronJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<CronJob | null>(null);
  const [formData, setFormData] = useState<Partial<CronJob>>(emptyJob);
  const [saving, setSaving] = useState(false);
  const { t } = useTranslation();
  const { activeAgent } = useAgent();

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await agentFetch("/api/cron", {}, activeAgent);
      const data = await res.json();
      if (Array.isArray(data)) {
        setJobs(data);
      } else if (data.jobs && Array.isArray(data.jobs)) {
        setJobs(data.jobs);
      } else {
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
  }, [activeAgent]);

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      const res = await agentFetch(`/api/cron?id=${id}`, { method: "DELETE" }, activeAgent);
      if (res.ok) {
        setJobs(jobs.filter(j => j.id !== id));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setDeleting(null);
    }
  };

  const openCreateModal = () => {
    setEditingJob(null);
    setFormData(emptyJob);
    setIsModalOpen(true);
  };

  const openEditModal = (job: CronJob) => {
    setEditingJob(job);
    setFormData({
      name: job.name,
      enabled: job.enabled,
      schedule: { ...job.schedule },
      payload: { ...job.payload }
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingJob(null);
    setFormData(emptyJob);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = "/api/cron";
      const method = editingJob ? "PUT" : "POST";
      const body = editingJob 
        ? { ...formData, id: editingJob.id }
        : formData;

      const res = await agentFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      }, activeAgent);

      if (res.ok) {
        await fetchJobs();
        closeModal();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <HeaderWithIcon 
          title={t.pages.schedule.title} 
          subtitle={t.pages.schedule.subtitle}
          icon={UI_ICONS.schedule}
          iconColorClass={UI_STYLES.schedule.color}
          iconBgClass={UI_STYLES.schedule.bgColor}
          iconBorderClass={UI_STYLES.schedule.borderColor}
        />
        
        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Job
        </button>
      </div>

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
            <p className="text-muted-foreground text-sm">Create a new job to get started.</p>
          </div>
          <button
            onClick={openCreateModal}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-all"
          >
            <Plus className="w-4 h-4" />
            Create First Job
          </button>
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

                  <div className="flex items-center gap-1 shrink-0">
                    <button 
                      onClick={() => openEditModal(job)}
                      className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl transition-all"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(job.id)}
                      disabled={deleting === job.id}
                      className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all"
                    >
                      {deleting === job.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-lg font-bold">
                {editingJob ? "Edit Job" : "Create New Job"}
              </h2>
              <button 
                onClick={closeModal}
                className="p-2 text-muted-foreground hover:text-foreground rounded-xl transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Name */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Job Name
                </label>
                <input
                  type="text"
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Daily Report"
                  className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  required
                />
              </div>

              {/* Schedule Type */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Schedule Type
                </label>
                <select
                  value={formData.schedule?.kind || "cron"}
                  onChange={(e) => setFormData({
                    ...formData,
                    schedule: { ...formData.schedule!, kind: e.target.value as any }
                  })}
                  className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                >
                  <option value="cron">Cron Expression</option>
                  <option value="at">One-time (At)</option>
                  <option value="every">Interval (Every)</option>
                </select>
              </div>

              {/* Cron Expression */}
              {formData.schedule?.kind === "cron" && (
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Cron Expression
                  </label>
                  <input
                    type="text"
                    value={formData.schedule?.expr || ""}
                    onChange={(e) => setFormData({
                      ...formData,
                      schedule: { ...formData.schedule!, expr: e.target.value }
                    })}
                    placeholder="0 23 * * 1-5"
                    className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Format: minute hour day month weekday (e.g., "0 23 * * 1-5" for weekdays at 23:00)
                  </p>
                </div>
              )}

              {/* Timezone */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Timezone
                </label>
                <input
                  type="text"
                  value={formData.schedule?.tz || ""}
                  onChange={(e) => setFormData({
                    ...formData,
                    schedule: { ...formData.schedule!, tz: e.target.value }
                  })}
                  placeholder="Europe/Paris"
                  className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Prompt Message
                </label>
                <textarea
                  value={formData.payload?.message || ""}
                  onChange={(e) => setFormData({
                    ...formData,
                    payload: { ...formData.payload!, message: e.target.value }
                  })}
                  placeholder="Enter the instruction for the agent..."
                  rows={4}
                  className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                  required
                />
              </div>

              {/* Enabled */}
              <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl">
                <div>
                  <span className="font-medium text-sm">Enabled</span>
                  <p className="text-xs text-muted-foreground">Active and scheduled to run</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.enabled ?? true}
                    onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-secondary peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-rose-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2.5 text-muted-foreground hover:text-foreground font-medium transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 disabled:opacity-50 transition-all"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  {editingJob ? "Save Changes" : "Create Job"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
