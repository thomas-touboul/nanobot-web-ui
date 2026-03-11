"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { UI_TEXT } from "@/constants/ui-text";

const systemNavigation = [
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
];

const brainNavigation = [
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
];

const operationsNavigation = [
  { 
    ...UI_TEXT.navigation.history,
    href: "/history", 
    match: (path: string) => path.startsWith("/history")
  },
  { 
    ...UI_TEXT.navigation.subagents,
    href: "/subagents", 
    match: (path: string) => path.startsWith("/subagents")
  },
  { 
    ...UI_TEXT.navigation.schedule,
    href: "/cron", 
    match: (path: string) => path.startsWith("/cron")
  },
];

interface NavItemProps {
  item: any;
  isActive: boolean;
  onClick?: () => void;
}

const NavItem = ({ item, isActive, onClick }: NavItemProps) => {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onClick}
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
};

const NavSection = ({ title, items, pathname, searchParams, onItemClick, isFirst }: any) => (
  <div className="space-y-1">
    <h3 className={cn(
      "px-4 text-[10px] font-bold uppercase tracking-[0.15em] text-muted-foreground/40 mb-2",
      isFirst ? "mt-3" : "mt-6"
    )}>
      {title}
    </h3>
    {items.map((item: any) => (
      <NavItem 
        key={item.href} 
        item={item} 
        isActive={item.match(pathname, searchParams)} 
        onClick={onItemClick} 
      />
    ))}
  </div>
);

interface NavigationProps {
  onItemClick?: () => void;
}

export function Navigation({ onItemClick }: NavigationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (
    <nav className="px-2 pb-4">
      <NavSection 
        title="System" 
        items={systemNavigation} 
        pathname={pathname} 
        searchParams={searchParams} 
        onItemClick={onItemClick} 
        isFirst
      />
      <NavSection 
        title="Brain" 
        items={brainNavigation} 
        pathname={pathname} 
        searchParams={searchParams} 
        onItemClick={onItemClick} 
      />
      <NavSection 
        title="Operations" 
        items={operationsNavigation} 
        pathname={pathname} 
        searchParams={searchParams} 
        onItemClick={onItemClick} 
      />
    </nav>
  );
}
