"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { Navigation } from "./Navigation";
import { useTheme } from "next-themes";
import { Sun, Moon, Activity, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

function SidebarContent() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOnline, setIsOnline] = useState<boolean | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    <>
      {/* Mobile Toggle - Only visible on small screens when sidebar is hidden */}
      <div className="md:hidden fixed top-4 left-4 z-[60]">
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 bg-card border border-border rounded-lg shadow-sm text-foreground"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Sidebar Container */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col w-64 border-r border-border bg-card/50 backdrop-blur-sm transition-transform duration-300 md:translate-x-0 md:static md:h-screen",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-14 flex items-center px-6 border-b border-border/40">
          <Link href="/" className="flex items-center gap-2 font-semibold text-sm tracking-tight text-foreground hover:opacity-80 transition-opacity">
            <div className="w-5 h-5 bg-foreground rounded text-[10px] flex items-center justify-center text-background font-bold shadow-sm">
              A
            </div>
            <span>AI Agent Admin</span>
          </Link>
        </div>
        
        <div className="flex-1 py-4 overflow-y-auto">
          <Navigation onItemClick={() => setMobileMenuOpen(false)} />
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border/40 space-y-3 bg-secondary/10">
          {/* Status Indicator */}
          <div className={cn(
            "flex items-center justify-between px-3 py-2 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all duration-500",
            isOnline === null ? "bg-secondary/50 text-muted-foreground border-border" :
            isOnline ? "bg-emerald-500/5 text-emerald-500 border-emerald-500/10" : 
            "bg-red-500/5 text-red-500 border-red-500/10 animate-pulse"
          )}>
            <div className="flex items-center gap-2">
              <div className={cn(
                "h-1.5 w-1.5 rounded-full",
                isOnline === null ? "bg-muted-foreground" :
                isOnline ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" : 
                "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"
              )} />
              <span>Gateway {isOnline === null ? '...' : isOnline ? 'Online' : 'Offline'}</span>
            </div>
            <Activity className={cn("h-3 w-3", isOnline ? "text-emerald-500/50" : "text-red-500/50")} />
          </div>

          {/* Theme Switcher */}
          <div className="flex items-center justify-between p-1 bg-background/50 rounded-xl border border-border/40">
            <button
              onClick={() => setTheme("light")}
              className={cn(
                "flex-1 flex items-center justify-center py-1.5 rounded-lg transition-all",
                theme === "light" ? "bg-card text-foreground shadow-sm border border-border/20" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Sun className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={cn(
                "flex-1 flex items-center justify-center py-1.5 rounded-lg transition-all",
                theme === "dark" ? "bg-card text-foreground shadow-sm border border-border/20" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Moon className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}

export default function Sidebar() {
  return (
    <Suspense fallback={<div className="hidden md:block w-64 border-r border-border bg-card h-screen" />}>
      <SidebarContent />
    </Suspense>
  );
}
