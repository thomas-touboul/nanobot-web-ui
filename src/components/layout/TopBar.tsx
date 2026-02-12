"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Activity } from "lucide-react";
import { useEffect, useState } from "react";

export default function TopBar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-30 h-14 border-b border-border bg-background/80 backdrop-blur-md px-6 flex items-center justify-between">
      <div className="flex items-center">
        <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full animate-fade-in">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          Gateway Online
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button 
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md transition-all duration-200"
          aria-label="Toggle theme"
        >
          {mounted && theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        <div className="h-4 w-px bg-border/60 mx-1"></div>

        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-gradient-to-tr from-zinc-800 to-zinc-600 dark:from-zinc-200 dark:to-zinc-400 rounded-full flex items-center justify-center text-[10px] font-bold text-background shadow-sm ring-1 ring-border/20">
            T
          </div>
          <span className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-default">
            Thomas
          </span>
        </div>
      </div>
    </header>
  );
}
