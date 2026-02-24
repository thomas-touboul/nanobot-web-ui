"use client";

import Link from "next/link";
import { Suspense } from "react";
import { NavigationItems } from "./Navigation";

function SidebarContent() {
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
        <NavigationItems />
      </nav>
    </aside>
  );
}

export default function Sidebar() {
  return (
    <Suspense fallback={<div className="hidden md:block w-64 border-r border-border bg-card h-screen" />}>
      <SidebarContent />
    </Suspense>
  );
}
