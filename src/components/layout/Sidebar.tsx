"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { 
  FileCode2, 
  BrainCircuit, 
  Fingerprint, 
  Zap, 
  Settings,
  TerminalSquare,
  User,
  FileText,
  Activity,
  ChevronDown,
  Library,
  MessageSquare,
  Webhook,
  History
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Suspense, useState, useEffect } from "react";

const mainNavigation = [
  { 
    title: "Configuration", 
    subtitle: "openclaw.json", 
    href: "/editor?file=openclaw.json", 
    icon: Settings,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    match: (path: string, params: URLSearchParams) => params.get("file") === "openclaw.json"
  },
  { 
    title: "Core Files", 
    subtitle: "Identity & Rules", 
    href: "/core-files", 
    icon: Library,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    match: (path: string) => path.startsWith("/core-files")
  },
  { 
    title: "Memory", 
    subtitle: "Short-term Logs", 
    href: "/memory", 
    icon: History,
    color: "text-sky-500",
    bgColor: "bg-sky-500/10",
    match: (path: string) => path.startsWith("/memory")
  },
  { 
    title: "Skills", 
    subtitle: "Capabilities", 
    href: "/skills", 
    icon: Zap,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    match: (path: string) => path.startsWith("/skills")
  },
  { 
    title: "Hooks", 
    subtitle: "Event Triggers", 
    href: "/hooks", 
    icon: Webhook,
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
    match: (path: string) => path.startsWith("/hooks")
  },
];

function SidebarContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card/50 backdrop-blur-sm h-screen sticky top-0">
      <div className="h-14 flex items-center px-6 border-b border-border/40">
        <Link href="/" className="flex items-center gap-2 font-semibold text-sm tracking-tight text-foreground hover:opacity-80 transition-opacity">
          <div className="w-5 h-5 bg-foreground rounded text-[10px] flex items-center justify-center text-background font-bold shadow-sm">
            OC
          </div>
          <span>openclaw-admin</span>
        </Link>
      </div>
      
      <nav className="flex-1 p-3 space-y-4">
        {/* Main Section */}
        <div className="space-y-1">
          {mainNavigation.map((item) => {
            const isActive = item.match(pathname, searchParams);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "group flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 border border-transparent shadow-sm",
                  isActive 
                    ? "bg-secondary border-border/50 shadow-md" 
                    : "hover:bg-secondary/50 hover:border-border/30 shadow-none"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-md flex items-center justify-center transition-all duration-200 shadow-inner",
                  isActive ? cn("bg-background", item.color) : cn("bg-secondary/50 text-muted-foreground group-hover:bg-background", `group-hover:${item.color}`)
                )}>
                  <item.icon className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className={cn(
                    "text-sm font-medium leading-none transition-colors",
                    isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                  )}>
                    {item.title}
                  </span>
                  <span className="text-[10px] text-muted-foreground font-mono mt-1 opacity-70 group-hover:opacity-100 transition-opacity">
                    {item.subtitle}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
    </aside>
  );
}

export default function Sidebar() {
  return (
    <Suspense fallback={<div className="w-64 border-r border-border bg-card h-screen" />}>
      <SidebarContent />
    </Suspense>
  );
}
