"use client";

import { UI_TEXT } from "@/constants/ui-text";
import { HeaderWithIcon } from "@/components/HeaderWithIcon";
import { Bot, Clock, CheckCircle2, XCircle, Loader2, Terminal } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface SubagentTask {
  id: string;
  label: string;
  status: 'running' | 'completed' | 'failed';
  startTime: string;
  endTime?: string;
  task: string;
  result?: string;
}

export default function SubagentsPage() {
  const [tasks, setTasks] = useState<SubagentTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/subagents');
        const data = await response.json();
        const activeTasks = Array.isArray(data) ? data.filter((t: SubagentTask) => t.status === 'running') : [];
        setTasks(activeTasks);
      } catch (error) {
        console.error('Failed to fetch subagents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
    const interval = setInterval(fetchTasks, 3000); // Refresh every 3s for "real-time" feel
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 container max-w-7xl py-8 animate-fade-in pb-20">
      <HeaderWithIcon 
        title={UI_TEXT.pages.subagents.title} 
        subtitle={UI_TEXT.pages.subagents.subtitle}
        icon={UI_TEXT.navigation.subagents.icon}
        iconColorClass={UI_TEXT.navigation.subagents.color}
        iconBgClass={UI_TEXT.navigation.subagents.bgColor}
        iconBorderClass={UI_TEXT.navigation.subagents.borderColor}
      />

      <div className="max-w-4xl mx-auto">
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-border bg-secondary/10 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg tracking-tight">Active Tasks</h3>
              <p className="text-xs text-muted-foreground">Monitor background operations currently running.</p>
            </div>
            <div className="px-3 py-1 rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/20 text-xs font-bold">
              {tasks.length} Running
            </div>
          </div>
          
          <div className="p-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                <p className="text-sm text-muted-foreground font-medium">Fetching subagent status...</p>
              </div>
            ) : tasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-4 text-center">
                <div className="p-4 rounded-full bg-secondary/20">
                  <Bot className="h-8 w-8 text-muted-foreground/40" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">No active subagents</p>
                  <p className="text-xs text-muted-foreground/60 mt-1">Everything is quiet for now.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {tasks.map((task) => (
                  <div 
                    key={task.id} 
                    className="p-5 rounded-xl border border-border bg-secondary/5 hover:bg-secondary/10 transition-all group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="p-2.5 rounded-xl shadow-sm bg-blue-500/10 text-blue-500">
                          <Loader2 className="h-5 w-5 animate-spin" />
                        </div>
                        <div>
                          <h4 className="text-base font-bold text-foreground tracking-tight">{task.label}</h4>
                          <div className="flex items-center gap-3 text-[10px] text-muted-foreground mt-1 font-medium uppercase tracking-wider">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>Started: {task.startTime}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border bg-blue-500/5 text-blue-500 border-blue-500/20">
                        {task.status}
                      </div>
                    </div>
                    
                    <div className="bg-background/50 rounded-xl p-4 border border-border/50 shadow-inner">
                      <div className="flex items-center gap-2 mb-2">
                        <Terminal className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Task Prompt</span>
                      </div>
                      <p className="text-sm text-foreground/80 italic leading-relaxed">"{task.task}"</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
