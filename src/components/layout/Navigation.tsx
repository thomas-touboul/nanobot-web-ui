"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { 
  Settings,
  Cpu,
  Zap,
  Library,
  ScrollText,
  Activity,
  History
} from "lucide-react";
import { cn } from "@/lib/utils";

export const mainNavigation = [
  { 
    title: "Configuration", 
    subtitle: "config.json", 
    href: "/editor?file=config.json", 
    icon: Settings,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    match: (path: string, params: URLSearchParams) => params.get("file") === "config.json"
  },
  { 
    title: "Providers", 
    subtitle: "Models & Keys", 
    href: "/models", 
    icon: Cpu,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    match: (path: string) => path.startsWith("/models")
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
    title: "History", 
    subtitle: "Activity Logs", 
    href: "/history", 
    icon: ScrollText,
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
    match: (path: string) => path.startsWith("/history")
  },
  { 
    title: "Schedule", 
    subtitle: "Cron & Tasks", 
    href: "/cron", 
    icon: Activity,
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
    match: (path: string) => path.startsWith("/cron")
  },
];

export function NavigationItems({ onItemClick }: { onItemClick?: () => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <div className="space-y-1">
      {mainNavigation.map((item) => {
        const Icon = item.icon;
        const isActive = item.match(pathname, searchParams);

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onItemClick}
            className={cn(
              "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
              isActive 
                ? "bg-secondary text-foreground shadow-sm" 
                : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
            )}
          >
            <div className={cn(
              "p-1.5 rounded-lg transition-colors",
              isActive ? item.bgColor : "bg-transparent group-hover:bg-secondary"
            )}>
              <Icon className={cn(
                "w-4 h-4",
                isActive ? item.color : "text-muted-foreground group-hover:text-foreground"
              )} />
            </div>
            <div className="flex flex-col">
              <span>{item.title}</span>
              <span className="text-[10px] text-muted-foreground/60 font-normal leading-tight">
                {item.subtitle}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
