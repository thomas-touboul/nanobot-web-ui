"use client";

import { useState, useEffect } from "react";
import { 
  FileCode2, 
  ArrowRight,
  Database,
  Activity,
  Server
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const [files, setFiles] = useState<{name: string, type: string}[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/files")
      .then((res) => res.json())
      .then((data) => {
        setFiles(data.files || []);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-8 container max-w-5xl py-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground text-sm">Vue d'ensemble de l'instance OpenClaw.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Status Card */}
        <div className="p-6 bg-card border border-border rounded-lg shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
          <div className="flex justify-between items-start z-10">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Gateway Status</p>
              <h3 className="text-2xl font-semibold mt-1 text-emerald-600 dark:text-emerald-400">Online</h3>
            </div>
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xs text-muted-foreground flex items-center gap-2 z-10">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            System operational
          </div>
          <div className="absolute right-0 bottom-0 w-24 h-24 bg-gradient-to-tr from-emerald-500/5 to-transparent rounded-full blur-xl transform translate-x-8 translate-y-8 group-hover:scale-150 transition-transform duration-500"></div>
        </div>

        {/* Database / Memory Card */}
        <div className="p-6 bg-card border border-border rounded-lg shadow-sm flex flex-col justify-between h-32 relative overflow-hidden group hover:border-blue-500/30 transition-colors">
          <div className="flex justify-between items-start z-10">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Mémoire</p>
              <h3 className="text-2xl font-semibold mt-1 text-foreground">Actif</h3>
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xs text-muted-foreground z-10">
            Linked to local storage
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <h2 className="text-lg font-semibold tracking-tight flex items-center gap-2">
            <FileCode2 className="w-5 h-5 text-muted-foreground" />
            Fichiers Récents
          </h2>
          <Link href="/editor" className="text-sm text-primary hover:text-primary/80 transition-colors flex items-center gap-1">
            Tout voir <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="h-20 bg-secondary/50 rounded-lg animate-pulse" />
            ))
          ) : (
            files.slice(0, 6).map((file) => (
              <Link 
                key={file.name} 
                href={`/editor?file=${file.name}`}
                className="group flex items-center p-4 bg-card hover:bg-secondary/40 border border-border hover:border-foreground/20 rounded-lg transition-all duration-200"
              >
                <div className="w-10 h-10 rounded-md bg-secondary flex items-center justify-center mr-4 group-hover:bg-background transition-colors border border-transparent group-hover:border-border">
                  <FileCode2 className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">{file.type}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
