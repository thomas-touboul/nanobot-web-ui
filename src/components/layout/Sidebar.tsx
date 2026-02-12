"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileEdit, Settings, Brain, Bot, Users, HeartPulse, Hammer } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Éditeur", href: "/editor", icon: FileEdit },
  { name: "Mémoire", href: "/editor?file=MEMORY.md", icon: Brain },
  { name: "Personnalité", href: "/editor?file=SOUL.md", icon: Bot },
  { name: "Utilisateurs", href: "/users", icon: Users },
  { name: "Skills", href: "/skills", icon: Hammer },
  { name: "Système", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-border bg-card">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">M</div>
          <span>Molt <span className="text-blue-600">Admin</span></span>
        </Link>
      </div>
      
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto pb-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive 
                  ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400" 
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <item.icon className="w-4 h-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2 bg-green-500/10 text-green-600 dark:text-green-400 rounded-md text-xs font-semibold uppercase tracking-wider">
          <HeartPulse className="w-3 h-3" />
          Gateway Online
        </div>
      </div>
    </aside>
  );
}
