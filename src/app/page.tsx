"use client";

import { useState, useEffect } from "react";
import { 
  Activity, 
  Server, 
  Cpu, 
  Network, 
  CheckCircle2,
  Terminal,
  Bot,
  Settings,
  ArrowRight
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface GatewayStatus {
  service: string;
  state: string;
  port: number | string;
  pid: number | string;
  rpc_probe: string;
  model: string;
  provider: string;
  channels: string[];
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
    <div className="space-y-6 container max-w-7xl py-4 animate-fade-in pb-20">
      {/* Main Status Card */}
      <div className="p-6 bg-card border border-border rounded-2xl shadow-sm relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-6 opacity-5">
          <Bot className="w-48 h-48" />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className={cn(
              "w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-all duration-500",
              status?.state === "active" 
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.1)]" 
                : "bg-red-500/10 border-red-500/20 text-red-500"
            )}>
              {loading ? (
                <Bot className="w-8 h-8 animate-pulse" />
              ) : (
                <Bot className="w-8 h-8" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-foreground tracking-tight">AI Agent Gateway</h2>
                <span className={cn(
                  "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border",
                  status?.state === "active" 
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                    : "bg-red-500/10 text-red-500 border-red-500/20"
                )}>
                  {loading ? "..." : status?.state}
                </span>
              </div>
              
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
                <div className="text-xs text-muted-foreground">
                  <span className="font-medium text-foreground/80">{status?.model || "Loading..."}</span>
                </div>
                <div className="text-xs text-muted-foreground border-l border-border pl-4">
                  <span className="font-medium text-foreground/60 uppercase tracking-tighter">{status?.provider || "auto"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Channels moved to the right */}
          {status?.channels && status.channels.length > 0 && (
            <div className="flex flex-wrap items-center justify-end gap-2 md:max-w-[200px]">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50 w-full text-right mb-1">Active Channels</span>
              {status.channels.map(channel => (
                <span key={channel} className="px-2 py-1 rounded-lg bg-secondary/50 text-[10px] font-bold uppercase tracking-tighter text-foreground border border-border/50 shadow-sm">
                  {channel}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
      
      {/* Configuration Link Card */}
      <Link 
        href="/editor?file=config.json"
        className="group flex items-center justify-between p-5 bg-card border border-border rounded-2xl hover:border-border/60 hover:shadow-sm transition-all duration-300"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center border border-border bg-secondary/50 shadow-sm">
            <Settings className="w-6 h-6 text-muted-foreground" />
          </div>
          <div>
            <h3 className="text-base font-bold text-foreground tracking-tight">
              Edit Configuration
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              Directly modify config.json settings
            </p>
          </div>
        </div>
        <ArrowRight className="w-5 h-5 text-muted-foreground/40 group-hover:text-foreground/60 transition-transform group-hover:translate-x-1" />
      </Link>

      <div className="p-4 rounded-lg bg-secondary/30 border border-border text-xs font-mono text-muted-foreground flex items-center gap-3">
        <Terminal className="w-4 h-4" />
        <span>To manage gateway: <span className="text-foreground">nanobot gateway [start|stop|restart]</span></span>
      </div>
    </div>
  );
}
