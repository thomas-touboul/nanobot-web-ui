"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { UI_ICONS, UI_STYLES } from "@/constants/ui-text";
import { useTranslation } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface NavigationProps {
  onItemClick?: () => void;
}

export function Navigation({ onItemClick }: NavigationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { t, language } = useTranslation();

  const systemNavigation = [
    { 
      title: t.navigation.chat.title,
      subtitle: t.navigation.chat.subtitle,
      icon: UI_ICONS.chat,
      ...UI_STYLES.chat,
      href: "/chat", 
      match: (path: string) => path.startsWith("/chat")
    },
    { 
      title: t.navigation.agent.title,
      subtitle: t.navigation.agent.subtitle,
      icon: UI_ICONS.agent,
      ...UI_STYLES.agent,
      href: "/agent", 
      match: (path: string) => path.startsWith("/agent")
    },
    { 
      title: t.navigation.channels.title,
      subtitle: t.navigation.channels.subtitle,
      icon: UI_ICONS.channels,
      ...UI_STYLES.channels,
      href: "/channels", 
      match: (path: string) => path.startsWith("/channels")
    },
    { 
      title: t.navigation.providers.title,
      subtitle: t.navigation.providers.subtitle,
      icon: UI_ICONS.providers,
      ...UI_STYLES.providers,
      href: "/models", 
      match: (path: string) => path.startsWith("/models")
    },
    { 
      title: t.navigation.security.title,
      subtitle: t.navigation.security.subtitle,
      icon: UI_ICONS.security,
      ...UI_STYLES.security,
      href: "/security", 
      match: (path: string) => path.startsWith("/security")
    },
    { 
      title: t.navigation.gatewayLogs.title,
      subtitle: t.navigation.gatewayLogs.subtitle,
      icon: UI_ICONS.gatewayLogs,
      ...UI_STYLES.gatewayLogs,
      href: "/gateway-logs", 
      match: (path: string) => path.startsWith("/gateway-logs")
    },
  ];

  const brainNavigation = [
    { 
      title: t.navigation.coreFiles.title,
      subtitle: t.navigation.coreFiles.subtitle,
      icon: UI_ICONS.coreFiles,
      ...UI_STYLES.coreFiles,
      href: "/core-files", 
      match: (path: string) => path.startsWith("/core-files")
    },
    { 
      title: t.navigation.memory.title,
      subtitle: t.navigation.memory.subtitle,
      icon: UI_ICONS.memory,
      ...UI_STYLES.memory,
      href: "/memory", 
      match: (path: string) => path.startsWith("/memory")
    },
    { 
      title: t.navigation.skills.title,
      subtitle: t.navigation.skills.subtitle,
      icon: UI_ICONS.skills,
      ...UI_STYLES.skills,
      href: "/skills", 
      match: (path: string) => path.startsWith("/skills")
    },
  ];

  const operationsNavigation = [
    { 
      title: t.navigation.history.title,
      subtitle: t.navigation.history.subtitle,
      icon: UI_ICONS.history,
      ...UI_STYLES.history,
      href: "/history", 
      match: (path: string) => path.startsWith("/history")
    },
    { 
      title: t.navigation.subagents.title,
      subtitle: t.navigation.subagents.subtitle,
      icon: UI_ICONS.subagents,
      ...UI_STYLES.subagents,
      href: "/subagents", 
      match: (path: string) => path.startsWith("/subagents")
    },
    { 
      title: t.navigation.schedule.title,
      subtitle: t.navigation.schedule.subtitle,
      icon: UI_ICONS.schedule,
      ...UI_STYLES.schedule,
      href: "/cron", 
      match: (path: string) => path.startsWith("/cron")
    },
  ];

  return (
    <nav className="px-2 pb-4">
      <NavSection 
        title={language === 'fr' ? "Système" : "System"} 
        items={systemNavigation} 
        pathname={pathname} 
        searchParams={searchParams} 
        onItemClick={onItemClick} 
        isFirst
      />
      <NavSection 
        title={language === 'fr' ? "Cerveau" : "Brain"} 
        items={brainNavigation} 
        pathname={pathname} 
        searchParams={searchParams} 
        onItemClick={onItemClick} 
      />
      <NavSection 
        title={language === 'fr' ? "Opérations" : "Operations"} 
        items={operationsNavigation} 
        pathname={pathname} 
        searchParams={searchParams} 
        onItemClick={onItemClick} 
      />
    </nav>
  );
}

const NavItem = ({ item, isActive, onClick }: { item: any; isActive: boolean; onClick?: () => void }) => {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
        isActive 
          ? `${item.bgColor} ${item.color} shadow-sm` 
          : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
      )}
    >
      <div className={cn(
        "p-1.5 rounded-md mr-3 transition-colors",
        isActive ? 'bg-transparent' : 'group-hover:text-foreground'
      )}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex flex-col">
        <span>{item.title}</span>
        <span className={cn(
          "text-[10px] font-normal opacity-60",
          isActive ? 'text-inherit' : 'text-muted-foreground'
        )}>
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
