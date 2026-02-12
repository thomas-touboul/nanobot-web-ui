"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { LayoutDashboard, FileCode2, BrainCircuit, Fingerprint, Zap, Radio } from "lucide-react";
import { cn } from "@/lib/utils";
import { Suspense } from "react";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Éditeur", href: "/editor", icon: FileCode2, match: (path: string, params: URLSearchParams) => path === "/editor" && !params.get("file") },
  { name: "Mémoire", href: "/editor?file=MEMORY.md", icon: BrainCircuit, match: (path: string, params: URLSearchParams) => path === "/editor" && params.get("file") === "MEMORY.md" },
  { name: "Personnalité", href: "/editor?file=SOUL.md", icon: Fingerprint, match: (path: string, params: URLSearchParams) => path === "/editor" && params.get("file") === "SOUL.md" },
  { name: "Skills", href: "/skills", icon: Zap, match: (path: string) => path.startsWith("/skills") },
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
      
      <nav className="flex-1 p-3 space-y-0.5">
        {navigation.map((item) => {
          const isActive = item.match 
            ? item.match(pathname, searchParams)
            : pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-all duration-200",
                isActive 
                  ? "bg-secondary text-foreground font-semibold" 
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              )}
            >
              <item.icon className={cn("w-4 h-4", isActive ? "text-foreground" : "text-muted-foreground/70")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border/40">
        <div className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full w-fit">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
          Gateway Online
        </div>
      </div>
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
