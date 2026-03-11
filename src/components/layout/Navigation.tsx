"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { UI_TEXT } from "@/constants/ui-text";

export const mainNavigation = [
  { 
    ...UI_TEXT.navigation.configuration,
    href: "/editor?file=config.json", 
    match: (path: string, params: URLSearchParams) => params.get("file") === "config.json"
  },
  { 
    ...UI_TEXT.navigation.providers,
    href: "/models", 
    match: (path: string) => path.startsWith("/models")
  },
  { 
    ...UI_TEXT.navigation.coreFiles,
    href: "/core-files", 
    match: (path: string) => path.startsWith("/core-files")
  },
  { 
    ...UI_TEXT.navigation.memory,
    href: "/memory", 
    match: (path: string) => path.startsWith("/memory")
  },
  { 
    ...UI_TEXT.navigation.skills,
    href: "/skills", 
    match: (path: string) => path.startsWith("/skills")
  },
  { 
    ...UI_TEXT.navigation.subagents,
    href: "/subagents", 
    match: (path: string) => path.startsWith("/subagents")
  },
  { 
    ...UI_TEXT.navigation.history,
    href: "/history", 
    match: (path: string) => path.startsWith("/history")
  },
  { 
    ...UI_TEXT.navigation.schedule,
    href: "/cron", 
    match: (path: string) => path.startsWith("/cron")
  },
];

interface NavigationProps {
  onItemClick?: () => void;
}

export function Navigation({ onItemClick }: NavigationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <nav className="space-y-1 px-2">
      {mainNavigation.map((item) => {
        const isActive = item.match(pathname, searchParams);
        const Icon = item.icon;
        
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onItemClick}
            className={`
              group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200
              ${isActive 
                ? `${item.bgColor} ${item.color} shadow-sm` 
                : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'}
            `}
          >
            <div className={`
              p-1.5 rounded-md mr-3 transition-colors
              ${isActive ? 'bg-transparent' : 'group-hover:text-foreground'}
            `}>
              <Icon className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <span>{item.title}</span>
              <span className={`text-[10px] font-normal opacity-60 ${isActive ? 'text-inherit' : 'text-muted-foreground'}`}>
                {item.subtitle}
              </span>
            </div>
          </Link>
        );
      })}
    </nav>
  );
}
