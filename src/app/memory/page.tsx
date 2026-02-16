"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  History, 
  ChevronRight, 
  Loader2, 
  Search,
  Calendar,
  ArrowUpDown,
  Clock,
  Type,
  Brain
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MemoryFile {
  name: string;
  path: string;
  updatedAt: string;
  size: number;
}

type SortKey = "name" | "updatedAt" | "size";

export default function MemoryPage() {
  const [files, setFiles] = useState<MemoryFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Independent sorting states
  const [dailySort, setDailySort] = useState<{key: SortKey, order: "asc" | "desc"}>({ key: "updatedAt", order: "desc" });
  const [otherSort, setOtherSort] = useState<{key: SortKey, order: "asc" | "desc"}>({ key: "updatedAt", order: "desc" });

  const fetchFiles = () => {
    setLoading(true);
    fetch("/api/memory")
      .then((res) => res.json())
      .then((data) => {
        setFiles(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const isDailyLog = (name: string) => /^\d{4}-\d{2}-\d{2}\.md$/.test(name);

  const filteredFiles = files.filter(file => file.name.toLowerCase().includes(searchQuery.toLowerCase()));
  
  const getSortFn = (sort: {key: SortKey, order: "asc" | "desc"}) => (a: MemoryFile, b: MemoryFile) => {
    let valA: any = a[sort.key];
    let valB: any = b[sort.key];
    
    if (sort.key === "updatedAt") {
      valA = new Date(a.updatedAt).getTime();
      valB = new Date(b.updatedAt).getTime();
    }

    if (valA < valB) return sort.order === "asc" ? -1 : 1;
    if (valA > valB) return sort.order === "asc" ? 1 : -1;
    return 0;
  };

  const dailyFiles = filteredFiles.filter(f => isDailyLog(f.name)).sort(getSortFn(dailySort));
  const otherFiles = filteredFiles.filter(f => !isDailyLog(f.name)).sort(getSortFn(otherSort));

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    return (bytes / 1024).toFixed(1) + ' KB';
  };

  const SortButton = ({ active, label, icon: Icon, onClick, order }: any) => (
    <button 
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[9px] font-bold uppercase tracking-wider border transition-all",
        active ? "bg-sky-500/10 border-sky-500/30 text-sky-600 dark:text-sky-400" : "bg-transparent border-transparent text-muted-foreground hover:bg-secondary"
      )}
    >
      <Icon className="w-2.5 h-2.5" /> {label} {active && (order === "asc" ? "↑" : "↓")}
    </button>
  );

  const FileItem = ({ file, isDaily }: { file: MemoryFile, isDaily: boolean }) => (
    <Link
      href={`/editor?file=${file.path}`}
      className="group flex items-center justify-between px-4 py-3 bg-card border border-border rounded-xl hover:border-sky-500/20 hover:shadow-sm transition-all duration-200"
    >
      <div className="flex items-center gap-4 min-w-0">
        <div className={cn(
          "p-2 rounded-lg transition-colors shadow-inner shrink-0",
          isDaily ? "bg-sky-500/5 group-hover:bg-sky-500/10" : "bg-secondary group-hover:bg-amber-500/10"
        )}>
          {isDaily ? (
            <Calendar className="w-4 h-4 text-sky-500/70 group-hover:text-sky-500 transition-colors" />
          ) : (
            <Brain className="w-4 h-4 text-muted-foreground group-hover:text-amber-500 transition-colors" />
          )}
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-semibold text-sm text-foreground tracking-tight group-hover:text-sky-500 transition-colors truncate">
            {file.name}
          </span>
          <div className="flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5">
            <span className="uppercase font-bold tracking-tighter opacity-70">
              {formatDate(file.updatedAt)}
            </span>
            <span className="font-mono opacity-40">•</span>
            <span className="font-mono opacity-60">
              {formatSize(file.size)}
            </span>
          </div>
        </div>
      </div>
      <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-sky-500 transition-transform group-hover:translate-x-0.5 shrink-0" />
    </Link>
  );

  if (loading && files.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8 container max-w-7xl py-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
            <div className="p-2 bg-sky-500/10 rounded-lg shadow-sm border border-sky-500/20">
              <History className="w-8 h-8 text-sky-500" />
            </div>
            Memory
          </h1>
          <p className="text-muted-foreground text-sm">
            Access and manage your daily short-term memory logs.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-secondary/30 border border-border rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Daily Logs Column */}
        <div className="space-y-5">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-sky-500" />
              <h2 className="font-bold text-base tracking-tight uppercase text-muted-foreground">Daily Logs</h2>
              <span className="text-xs bg-secondary px-2 py-0.5 rounded-full font-mono font-bold text-muted-foreground/70">{dailyFiles.length}</span>
            </div>
            <div className="flex items-center gap-1">
              <SortButton 
                label="Date" icon={Clock} active={dailySort.key === "updatedAt"} order={dailySort.order}
                onClick={() => setDailySort({ key: "updatedAt", order: dailySort.key === "updatedAt" && dailySort.order === "desc" ? "asc" : "desc" })} 
              />
              <SortButton 
                label="Name" icon={Type} active={dailySort.key === "name"} order={dailySort.order}
                onClick={() => setDailySort({ key: "name", order: dailySort.key === "name" && dailySort.order === "desc" ? "asc" : "desc" })} 
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-2.5">
            {dailyFiles.map(f => <FileItem key={f.name} file={f} isDaily={true} />)}
            {dailyFiles.length === 0 && (
              <p className="text-xs text-muted-foreground italic px-1 py-10 text-center border border-dashed border-border rounded-2xl bg-secondary/10">No daily logs found.</p>
            )}
          </div>
        </div>

        {/* Other Memory Column */}
        <div className="space-y-5">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-amber-500" />
              <h2 className="font-bold text-base tracking-tight uppercase text-muted-foreground">Context & Projects</h2>
              <span className="text-xs bg-secondary px-2 py-0.5 rounded-full font-mono font-bold text-muted-foreground/70">{otherFiles.length}</span>
            </div>
            <div className="flex items-center gap-1">
              <SortButton 
                label="Date" icon={Clock} active={otherSort.key === "updatedAt"} order={otherSort.order}
                onClick={() => setOtherSort({ key: "updatedAt", order: otherSort.key === "updatedAt" && otherSort.order === "desc" ? "asc" : "desc" })} 
              />
              <SortButton 
                label="Name" icon={Type} active={otherSort.key === "name"} order={otherSort.order}
                onClick={() => setOtherSort({ key: "name", order: otherSort.key === "name" && otherSort.order === "desc" ? "asc" : "desc" })} 
              />
            </div>
          </div>
          <div className="grid grid-cols-1 gap-2.5">
            {otherFiles.map(f => <FileItem key={f.name} file={f} isDaily={false} />)}
            {otherFiles.length === 0 && (
              <p className="text-xs text-muted-foreground italic px-1 py-10 text-center border border-dashed border-border rounded-2xl bg-secondary/10">No project files found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
