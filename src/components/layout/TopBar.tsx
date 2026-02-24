"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { NavigationItems } from "./Sidebar";
import Link from "next/link";

export default function TopBar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <>
      <header className="h-14 w-full border-b border-border bg-background px-4 md:px-6 flex items-center justify-between shrink-0 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md transition-all duration-200"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <Link href="/" className="flex md:hidden items-center gap-2 font-semibold text-sm tracking-tight text-foreground">
            <div className="w-5 h-5 bg-foreground rounded text-[10px] flex items-center justify-center text-background font-bold shadow-sm">
              OC
            </div>
          </Link>

          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="hidden xs:inline">Gateway Online</span>
            <span className="xs:hidden">Online</span>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <button 
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md transition-all duration-200"
            aria-label="Toggle theme"
          >
            {mounted && theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <div className="h-4 w-px bg-border/60 mx-1"></div>

          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-6 h-6 bg-gradient-to-tr from-zinc-800 to-zinc-600 dark:from-zinc-200 dark:to-zinc-400 rounded-full flex items-center justify-center text-[10px] font-bold text-background shadow-sm ring-1 ring-border/20">
              T
            </div>
            <span className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-default hidden xs:inline">
              Thomas
            </span>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div 
            className="fixed inset-y-0 left-0 w-full max-w-xs bg-card border-r border-border p-6 shadow-xl animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 font-semibold text-lg tracking-tight text-foreground mb-8">
              <div className="w-6 h-6 bg-foreground rounded text-[12px] flex items-center justify-center text-background font-bold shadow-sm">
                OC
              </div>
              <span>openclaw-admin</span>
            </div>
            <nav>
              <NavigationItems onItemClick={() => setMobileMenuOpen(false)} />
            </nav>
          </div>
        </div>
      )}
    </>
  );
}
