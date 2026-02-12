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
  Library
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Suspense, useState, useEffect } from "react";

const mainNavigation = [
  { 
    title: "Configuration", 
    subtitle: "openclaw.json", 
    href: "/editor?file=openclaw.json", 
    icon: Settings,
    match: (path: string, params: URLSearchParams) => params.get("file") === "openclaw.json"
  },
  { 
    title: "Skills", 
    subtitle: "Capabilities", 
    href: "/skills", 
    icon: Zap,
    match: (path: string) => path.startsWith("/skills")
  },
];

const knowledgeBase = [
  { 
    title: "Agents & Workspace", 
    subtitle: "AGENTS.md", 
    href: "/editor?file=AGENTS.md", 
    icon: BrainCircuit,
    match: (path: string, params: URLSearchParams) => params.get("file") === "AGENTS.md"
  },
  { 
    title: "Tools & SSH", 
    subtitle: "TOOLS.md", 
    href: "/editor?file=TOOLS.md", 
    icon: TerminalSquare,
    match: (path: string, params: URLSearchParams) => params.get("file") === "TOOLS.md"
  },
  { 
    title: "Long Term Memory", 
    subtitle: "MEMORY.md", 
    href: "/editor?file=MEMORY.md", 
    icon: FileText,
    match: (path: string, params: URLSearchParams) => params.get("file") === "MEMORY.md"
  },
  { 
    title: "Personality", 
    subtitle: "SOUL.md", 
    href: "/editor?file=SOUL.md", 
    icon: Fingerprint,
    match: (path: string, params: URLSearchParams) => params.get("file") === "SOUL.md"
  },
  { 
    title: "User Profile", 
    subtitle: "USER.md", 
    href: "/editor?file=USER.md", 
    icon: User,
    match: (path: string, params: URLSearchParams) => params.get("file") === "USER.md"
  },
  { 
    title: "Tasks & Routine", 
    subtitle: "HEARTBEAT.md", 
    href: "/editor?file=HEARTBEAT.md", 
    icon: Activity,
    match: (path: string, params: URLSearchParams) => params.get("file") === "HEARTBEAT.md"
  },
];

function SidebarContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(true);

  // Auto-expand if a child is active
  useEffect(() => {
    const isChildActive = knowledgeBase.some(item => item.match(pathname, searchParams));
    if (isChildActive) setIsOpen(true);
  }, [pathname, searchParams]);

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
                  "w-8 h-8 rounded-md flex items-center justify-center transition-colors shadow-inner",
                  isActive ? "bg-background text-primary" : "bg-secondary/50 text-muted-foreground group-hover:bg-background group-hover:text-foreground"
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

        {/* Knowledge Base Group */}
        <div className="space-y-1">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground transition-colors group"
          >
            <div className="flex items-center gap-2">
              <Library className="w-3.5 h-3.5" />
              <span>Workspace Memory</span>
            </div>
            <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", !isOpen && "-rotate-90")} />
          </button>

          <div className={cn(
            "space-y-1 transition-all duration-200 overflow-hidden",
            isOpen ? "max-h-[500px] opacity-100 mt-1" : "max-h-0 opacity-0"
          )}>
            {knowledgeBase.map((item) => {
              const isActive = item.match(pathname, searchParams);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "group flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 border border-transparent ml-2",
                    isActive 
                      ? "bg-secondary/80 border-border/40 shadow-sm" 
                      : "hover:bg-secondary/30 hover:border-border/20"
                  )}
                >
                  <div className={cn(
                    "w-7 h-7 rounded-md flex items-center justify-center transition-colors shadow-inner",
                    isActive ? "bg-background text-primary" : "bg-secondary/30 text-muted-foreground group-hover:bg-background group-hover:text-foreground"
                  )}>
                    <item.icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex flex-col">
                    <span className={cn(
                      "text-xs font-medium leading-none transition-colors",
                      isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                    )}>
                      {item.title}
                    </span>
                    <span className="text-[9px] text-muted-foreground font-mono mt-0.5 opacity-60 group-hover:opacity-90 transition-opacity">
                      {item.subtitle}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
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
