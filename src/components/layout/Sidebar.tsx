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
  FileText
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Suspense } from "react";

const navigation = [
  { 
    title: "Configuration", 
    subtitle: "openclaw.json", 
    href: "/editor?file=openclaw.json", 
    icon: Settings,
    match: (path: string, params: URLSearchParams) => params.get("file") === "openclaw.json"
  },
  { 
    title: "Agents & Workspace", 
    subtitle: "AGENTS.md", 
    href: "/editor?file=AGENTS.md", 
    icon: BrainCircuit,
    match: (path: string, params: URLSearchParams) => params.get("file") === "AGENTS.md"
  },
  { 
    title: "Outils & SSH", 
    subtitle: "TOOLS.md", 
    href: "/editor?file=TOOLS.md", 
    icon: TerminalSquare,
    match: (path: string, params: URLSearchParams) => params.get("file") === "TOOLS.md"
  },
  { 
    title: "Mémoire Long Terme", 
    subtitle: "MEMORY.md", 
    href: "/editor?file=MEMORY.md", 
    icon: FileText,
    match: (path: string, params: URLSearchParams) => params.get("file") === "MEMORY.md"
  },
  { 
    title: "Personnalité", 
    subtitle: "SOUL.md", 
    href: "/editor?file=SOUL.md", 
    icon: Fingerprint,
    match: (path: string, params: URLSearchParams) => params.get("file") === "SOUL.md"
  },
  { 
    title: "Profil Utilisateur", 
    subtitle: "USER.md", 
    href: "/editor?file=USER.md", 
    icon: User,
    match: (path: string, params: URLSearchParams) => params.get("file") === "USER.md"
  },
  { 
    title: "Skills", 
    subtitle: "Compétences", 
    href: "/skills", 
    icon: Zap,
    match: (path: string) => path.startsWith("/skills")
  },
];

function SidebarContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card/50 backdrop-blur-sm h-screen sticky top-0">
      <div className="h-14 flex items-center px-6 border-b border-border/40">
        <Link href="/" className="flex items-center gap-2 font-semibold text-sm tracking-tight text-foreground hover:opacity-80 transition-opacity">
          <div className="w-5 h-5 bg-foreground rounded text-[10px] flex items-center justify-center text-background font-bold">
            OC
          </div>
          <span>openclaw-admin</span>
        </Link>
      </div>
      
      <nav className="flex-1 p-3 space-y-1">
        {navigation.map((item) => {
          const isActive = item.match 
            ? item.match(pathname, searchParams)
            : pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-md transition-all duration-200 border border-transparent",
                isActive 
                  ? "bg-secondary border-border/50 shadow-sm" 
                  : "hover:bg-secondary/50 hover:border-border/30"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-md flex items-center justify-center transition-colors",
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
