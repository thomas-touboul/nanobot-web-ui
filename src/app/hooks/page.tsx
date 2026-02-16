"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Trash2, 
  Save, 
  Webhook, 
  Loader2,
  AlertCircle,
  Info,
  Code
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Hook {
  id: string;
  match: any;
  action: string;
  textTemplate: string;
}

export default function HooksPage() {
  const [hooks, setHooks] = useState<Hook[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/hooks");
      const data = await res.json();
      setHooks(data.hooks || []);
    } catch (err) {
      setError("Failed to load hooks");
    } finally {
      setLoading(false);
    }
  };

  const saveHooks = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      const res = await fetch("/api/hooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hooks }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(data.error || "Failed to save");
      }
    } catch (err) {
      setError("Network error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-[50vh]"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>;

  return (
    <div className="space-y-8 container max-w-7xl py-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 rounded-lg shadow-sm border border-indigo-500/20">
              <Webhook className="w-8 h-8 text-indigo-500" />
            </div>
            Hooks
          </h1>
          <p className="text-muted-foreground text-sm">
            Event triggers and automated responses for your OpenClaw instance.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setHooks([...hooks, { id: `hook_${Date.now()}`, match: { text: "" }, action: "agentTurn", textTemplate: "" }])}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-secondary text-secondary-foreground rounded-xl font-medium transition-all hover:bg-secondary/80 active:scale-95 border border-border/50"
          >
            <Plus className="w-4 h-4" />
            Add Hook
          </button>
          <button
            onClick={saveHooks}
            disabled={saving}
            className={cn(
              "inline-flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all font-semibold shadow-lg",
              success ? "bg-emerald-500 text-white" : "bg-primary text-primary-foreground hover:opacity-90 active:scale-95"
            )}
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {success ? "Deployed!" : "Apply Changes"}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-2xl flex items-start gap-3 text-destructive animate-in fade-in slide-in-from-top-2">
          <AlertCircle className="w-5 h-5 mt-0.5" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        {hooks.map((hook, i) => (
          <div key={i} className="p-6 bg-card border border-border rounded-2xl space-y-6 hover:border-indigo-500/20 transition-all shadow-sm group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-indigo-500/10 rounded-lg">
                  <Code className="w-4 h-4 text-indigo-500" />
                </div>
                <input 
                  value={hook.id}
                  onChange={e => {
                    const newHooks = [...hooks];
                    newHooks[i].id = e.target.value;
                    setHooks(newHooks);
                  }}
                  placeholder="hook_id"
                  className="bg-transparent border-none p-0 text-sm font-mono font-bold focus:ring-0 w-64"
                />
              </div>
              <button onClick={() => {
                const newHooks = [...hooks];
                newHooks.splice(i, 1);
                setHooks(newHooks);
              }} className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-destructive/10 opacity-0 group-hover:opacity-100">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                 <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1 tracking-widest">Trigger Match (Text)</label>
                 <input 
                    value={typeof hook.match === 'object' ? hook.match.text : hook.match} 
                    onChange={e => {
                      const newHooks = [...hooks];
                      newHooks[i].match = { text: e.target.value };
                      setHooks(newHooks);
                    }}
                    placeholder="e.g. /ping or word"
                    className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-2.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all" 
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1 tracking-widest">Action Type</label>
                 <div className="relative">
                    <select 
                        value={hook.action}
                        onChange={e => {
                          const newHooks = [...hooks];
                          newHooks[i].action = e.target.value;
                          setHooks(newHooks);
                        }}
                        className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all appearance-none cursor-pointer"
                    >
                        <option value="agentTurn">Agent Turn (Normal run)</option>
                        <option value="systemEvent">System Event (Invisible background)</option>
                        <option value="wake">Wake Agent (Simple heartbeat request)</option>
                    </select>
                 </div>
               </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-muted-foreground ml-1 tracking-widest">Response Template / Command</label>
              <textarea 
                value={hook.textTemplate} 
                onChange={e => {
                  const newHooks = [...hooks];
                  newHooks[i].textTemplate = e.target.value;
                  setHooks(newHooks);
                }}
                rows={3}
                placeholder="Message to send or !shell command..."
                className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none shadow-inner" 
              />
            </div>
          </div>
        ))}

        {hooks.length === 0 && (
          <div className="py-20 border-2 border-dashed border-border rounded-2xl bg-secondary/10 flex flex-col items-center justify-center text-center">
            <Webhook className="w-12 h-12 text-muted-foreground/20 mb-4" />
            <p className="text-lg font-semibold text-muted-foreground">No hooks configured</p>
            <p className="text-sm text-muted-foreground/60 mt-1 max-w-xs">Hooks allow you to trigger actions based on message patterns or events.</p>
          </div>
        )}
      </div>

      <div className="bg-indigo-500/5 border border-indigo-500/10 p-6 rounded-2xl flex gap-5 text-indigo-600 dark:text-indigo-400">
        <div className="p-2 bg-indigo-500/10 rounded-xl h-fit">
          <Info className="w-5 h-5 shrink-0" />
        </div>
        <div className="space-y-2">
          <h4 className="text-sm font-bold uppercase tracking-tight">Understanding Hooks</h4>
          <p className="text-xs leading-relaxed opacity-90">
            Hooks are the nervous system of OpenClaw. They map <strong>matches</strong> (like a regex or exact text) to <strong>actions</strong>. 
            Common actions include <code>agentTurn</code> to start a conversation, or <code>wake</code> to trigger background tasks. 
            Use <code>!command</code> in templates to execute shell scripts.
          </p>
        </div>
      </div>
    </div>
  );
}
