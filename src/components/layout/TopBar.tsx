"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Navigation } from "./Navigation";
import { cn } from "@/lib/utils";

export default function TopBar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    const interval = setInterval(checkStatus, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  if (!mounted) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center">
          <button 
            className="lg:hidden p-2 -ml-2 hover:bg-secondary rounded-md transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        <div className="flex items-center gap-3">
          {/* Status Indicator */}
          <div className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-widest transition-all duration-500",
            isOnline === null ? "bg-secondary/50 text-muted-foreground border-border" :
            isOnline ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : 
            "bg-red-500/10 text-red-500 border-red-500/20 animate-pulse"
          )}>
            <div className={cn(
              "h-1.5 w-1.5 rounded-full",
              isOnline === null ? "bg-muted-foreground" :
              isOnline ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : 
              "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"
            )} />
            <span className="hidden xs:inline">Gateway {isOnline === null ? 'Checking...' : isOnline ? 'Online' : 'Offline'}</span>
            <span className="xs:hidden">{isOnline === null ? '...' : isOnline ? 'ON' : 'OFF'}</span>
          </div>

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2.5 rounded-xl bg-secondary/50 hover:bg-secondary border border-border/50 transition-all duration-200"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 z-50 bg-background animate-in slide-in-from-left duration-300">
          <div className="p-4">
            <Navigation onItemClick={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}
    </header>
  );
}
