"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Search, Bell } from "lucide-react";
import { useEffect, useState } from "react";

export default function TopBar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => setMounted(true), []);

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border bg-background/95 backdrop-blur px-6 flex items-center justify-between">
      <div className="flex-1 flex items-center max-w-xl">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Rechercher dans la mémoire..." 
            className="w-full pl-10 pr-4 py-2 bg-muted/50 border border-input rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-muted-foreground hover:bg-accent rounded-full transition-colors relative">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-blue-600 rounded-full border-2 border-background"></span>
        </button>

        <button 
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 text-muted-foreground hover:bg-accent rounded-full transition-colors"
        >
          {mounted && theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <div className="h-8 w-px bg-border mx-2"></div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block text-xs font-medium">
            <p className="text-slate-900 dark:text-slate-100">Thomas</p>
            <p className="text-slate-500">Administrateur</p>
          </div>
          <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/40 text-blue-600 rounded-full flex items-center justify-center font-bold">
            T
          </div>
        </div>
      </div>
    </header>
  );
}
