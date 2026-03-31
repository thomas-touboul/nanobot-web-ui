"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { Navigation } from "./Navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

function SidebarContent() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle - Only visible on small screens when sidebar is hidden */}
      <div className="md:hidden fixed top-4 left-4 z-[60]">
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 bg-card border border-border rounded-lg shadow-sm text-foreground"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Sidebar Container */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col w-64 border-r border-border bg-card/50 backdrop-blur-sm transition-transform duration-300 md:translate-x-0 md:static md:h-screen",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
         <div className="h-12 flex items-center px-6 border-b border-border/40">
           <Link href="/" className="flex items-center gap-2 font-semibold text-sm tracking-tight text-foreground hover:opacity-80 transition-opacity">
             <div className="w-5 h-5 bg-foreground rounded text-[10px] flex items-center justify-center text-background font-bold shadow-sm">
               N
             </div>
             <span className="hidden sm:inline">Nanobot Web UI</span>
           </Link>
         </div>
        
        <div className="flex-1 py-2 overflow-y-auto">
          <Navigation onItemClick={() => setMobileMenuOpen(false)} />
        </div>
      </aside>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}
    </>
  );
}

export default function Sidebar() {
  return (
    <Suspense fallback={<div className="hidden md:block w-64 border-r border-border bg-card h-screen" />}>
      <SidebarContent />
    </Suspense>
  );
}
