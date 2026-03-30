"use client";

import { Server, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAgent } from "@/contexts/AgentContext";
import { useTranslation } from "@/contexts/LanguageContext";
import { useTheme } from "next-themes";
import { Sun, Moon, Languages } from "lucide-react";
import { useEffect, useState } from "react";

export default function TopBar() {
  const { activeAgent, agents } = useAgent();
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [isOnline, setIsOnline] = useState<boolean | null>(null);

  useEffect(() => {
    setMounted(true);
    const checkStatus = async () => {
      try {
        const res = await fetch('/api/gateway/status');
        const data = await res.json();
        setIsOnline(data.state === 'active');
      } catch (error) {
        setIsOnline(false);
      }
    };
    checkStatus();
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-2 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 h-12">
      {/* Gauche : Agent + Status */}
      <div className="flex items-center gap-3">
        {/* Agent Selector */}
        <div className="flex items-center gap-2">
          <Server className="h-4 w-4 text-muted-foreground" />
          <select 
            value={activeAgent.id}
            onChange={() => {}} // Pour plus tard
            className="text-xs bg-transparent border border-border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-foreground/20 disabled:opacity-50"
            disabled={agents.length <= 1}
          >
            {agents.map(agent => (
              <option key={agent.id} value={agent.id}>
                {agent.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Indicator */}
        <div className={cn(
          "flex items-center gap-2 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider transition-all",
          isOnline === null ? "bg-secondary/50 text-muted-foreground border-border" :
          isOnline ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : 
          "bg-red-500/10 text-red-500 border-red-500/20"
        )}>
          <div className={cn(
            "h-2 w-2 rounded-full",
            isOnline === null ? "bg-muted-foreground" :
            isOnline ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" : 
            "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"
          )} />
          <span className="hidden sm:inline">
            {isOnline === null ? '...' : isOnline ? t.common.online : t.common.offline}
          </span>
        </div>
      </div>

      {/* Droite : Language & Theme Switchers */}
      <div className="flex items-center gap-4">
        {/* Language Switcher */}
        <div className="flex items-center gap-1 bg-secondary/10 rounded-lg p-1 border border-border/40">
          <div className="px-1.5 flex items-center">
            <Languages className="h-3.5 w-3.5 text-muted-foreground" />
          </div>
          <button
            onClick={() => setLanguage("en")}
            className={cn(
              "px-2 py-1 rounded text-[10px] font-bold transition-all",
              language === "en" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage("fr")}
            className={cn(
              "px-2 py-1 rounded text-[10px] font-bold transition-all",
              language === "fr" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            FR
          </button>
        </div>

        {/* Theme Switcher */}
        <div className="flex items-center gap-1 bg-secondary/10 rounded-lg p-1 border border-border/40">
          <button
            onClick={() => setTheme("light")}
            className={cn(
              "p-1.5 rounded transition-all",
              theme === "light" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
            title="Light mode"
          >
            <Sun className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setTheme("dark")}
            className={cn(
              "p-1.5 rounded transition-all",
              theme === "dark" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
            title="Dark mode"
          >
            <Moon className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </header>
  );
}
