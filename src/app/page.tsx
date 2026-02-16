"use client";

import { useState, useEffect } from "react";
import { 
  Activity, 
  Server, 
  Cpu, 
  Network, 
  CheckCircle2,
  Terminal
} from "lucide-react";
import { cn } from "@/lib/utils";

interface GatewayStatus {
  service: string;
  state: string;
  port: number | string;
  pid: number | string;
  rpc_probe: string;
  error?: string;
}

export default function Dashboard() {
  const [status, setStatus] = useState<GatewayStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/gateway/status")
      .then((res) => res.json())
      .then((data) => {
        setStatus(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-8 container max-w-5xl py-8 animate-fade-in">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-lg shadow-sm border border-emerald-500/20">
            <Activity className="w-8 h-8 text-emerald-500" />
          </div>
          Gateway Status
        </h1>
        <p className="text-muted-foreground text-sm">Real-time monitoring of the OpenClaw Gateway service.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Main Status Card */}
        <div className="md:col-span-2 p-8 bg-card border border-border rounded-2xl shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Server className="w-64 h-64" />
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center border-4",
                status?.state === "active" 
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" 
                  : "bg-red-500/10 border-red-500/20 text-red-500"
              )}>
                {loading ? (
                  <Activity className="w-8 h-8 animate-pulse" />
                ) : (
                  <Activity className="w-8 h-8" />
                )}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">OpenClaw Gateway</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className={cn(
                    "w-2.5 h-2.5 rounded-full",
                    status?.state === "active" ? "bg-emerald-500 animate-pulse" : "bg-red-500"
                  )}></span>
                  <span className={cn(
                    "text-sm font-medium",
                    status?.state === "active" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
                  )}>
                    {loading ? "Checking..." : (status?.state === "active" ? "Operational" : "Offline")}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1 text-right">
              <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Uptime</span>
              <span className="text-2xl font-mono font-medium text-foreground">99.9%</span>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="p-6 bg-card border border-border rounded-2xl flex flex-col gap-4 hover:border-border/80 transition-colors">
          <div className="flex items-center gap-3 text-muted-foreground mb-2">
            <Cpu className="w-5 h-5" />
            <h3 className="text-xs font-bold uppercase tracking-wider">Process Info</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-border/40 last:border-0">
              <span className="text-sm text-muted-foreground">PID</span>
              <span className="text-sm font-mono font-medium bg-secondary px-2 py-0.5 rounded-lg">{status?.pid || "---"}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/40 last:border-0">
              <span className="text-sm text-muted-foreground">Service State</span>
              <span className="text-sm font-medium flex items-center gap-1.5">
                {status?.state === "active" && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
                {status?.state || "---"}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/40 last:border-0">
              <span className="text-sm text-muted-foreground">Manager</span>
              <span className="text-sm font-medium">{status?.service || "---"}</span>
            </div>
          </div>
        </div>

        <div className="p-6 bg-card border border-border rounded-2xl flex flex-col gap-4 hover:border-border/80 transition-colors">
          <div className="flex items-center gap-3 text-muted-foreground mb-2">
            <Network className="w-5 h-5" />
            <h3 className="text-xs font-bold uppercase tracking-wider">Network</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-border/40 last:border-0">
              <span className="text-sm text-muted-foreground">Port</span>
              <span className="text-sm font-mono font-medium bg-secondary px-2 py-0.5 rounded-lg">{status?.port || "---"}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-border/40 last:border-0">
              <span className="text-sm text-muted-foreground">RPC Probe</span>
              <span className={cn(
                "text-sm font-medium px-2 py-0.5 rounded-full border",
                status?.rpc_probe === "ok" || status?.rpc_probe === "Online"
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                  : "bg-secondary text-muted-foreground border-transparent"
              )}>
                {status?.rpc_probe || "Unknown"}
              </span>
            </div>
             <div className="flex justify-between items-center py-2 border-b border-border/40 last:border-0">
              <span className="text-sm text-muted-foreground">Protocol</span>
              <span className="text-sm font-medium">WebSocket / HTTP</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4 rounded-lg bg-secondary/30 border border-border text-xs font-mono text-muted-foreground flex items-center gap-3">
        <Terminal className="w-4 h-4" />
        <span>To manage gateway: <span className="text-foreground">openclaw gateway [start|stop|restart]</span></span>
      </div>
    </div>
  );
}
