"use client";

import { useState, useEffect, useCallback } from "react";
import { 
  Activity, 
  RefreshCw, 
  Terminal,
  Loader2,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { HeaderWithIcon } from "@/components/HeaderWithIcon";
import { UI_TEXT } from "@/constants/ui-text";

interface LogEntry {
  timestamp?: string;
  message: string;
}

export default function GatewayLogsPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [refreshInterval, setRefreshInterval] = useState(3000); // 3 seconds

  const fetchLogs = useCallback(async () => {
    try {
      const res = await fetch('/api/gateway/logs');
      if (!res.ok) throw new Error('Failed to fetch logs');
      const data = await res.json();
      
      if (data.error) {
        setError(data.error);
        setLogs([]);
      } else {
        setLogs(data.logs || []);
        setError(null);
        setLastUpdate(new Date());
      }
    } catch (err) {
      setError('Could not load gateway logs. Make sure the nanobot-gateway service is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      fetchLogs();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchLogs]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  return (
    <div className="space-y-8 container max-w-7xl py-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <HeaderWithIcon 
          icon={UI_TEXT.navigation.history.icon} 
          title="Gateway Logs"
          subtitle="Real-time logs from nanobot-gateway systemd service"
          iconColorClass="text-rose-500"
          iconBgClass="bg-rose-500/10"
          iconBorderClass="border-rose-500/20"
        />
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-all",
              autoRefresh 
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" 
                : "bg-secondary/50 border-border text-muted-foreground hover:text-foreground"
            )}
            title={autoRefresh ? "Auto-refresh ON" : "Auto-refresh OFF"}
          >
            <Activity className="w-4 h-4" />
            {autoRefresh ? "Live" : "Paused"}
          </button>
          
          <button
            onClick={fetchLogs}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 bg-secondary/50 border border-border rounded-xl text-sm font-medium hover:bg-secondary transition-colors disabled:opacity-50"
            title="Refresh now"
          >
            <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
            Refresh
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-2xl text-destructive text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg">
        {/* Terminal Header */}
        <div className="bg-secondary/20 border-b border-border/40 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">journalctl --user -u nanobot-gateway</span>
          </div>
          {lastUpdate && (
            <div className="text-xs text-muted-foreground font-mono">
              Last update: {formatTime(lastUpdate)}
            </div>
          )}
        </div>

        {/* Logs Container */}
        <div className="bg-black/5 dark:bg-white/5 p-4 font-mono text-xs leading-relaxed max-h-[calc(100vh-300px)] overflow-y-auto">
          {loading && logs.length === 0 ? (
            <div className="flex items-center justify-center py-20 gap-3 text-muted-foreground">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Loading logs...</span>
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground italic">
              No log entries found. The service may not be running.
            </div>
          ) : (
            <div className="space-y-1">
              {logs.map((log, index) => (
                <div 
                  key={index} 
                  className="break-words hover:bg-secondary/20 rounded px-1 -mx-1 transition-colors"
                >
                  {log}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Info Box */}
      <div className="bg-secondary/10 border border-border/40 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <Activity className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
          <div className="text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Real-time monitoring</p>
            <p>This page shows the last 10 entries from the nanobot-gateway service logs. Auto-refresh is enabled by default (every 3 seconds). You can pause it or manually refresh using the buttons above.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
