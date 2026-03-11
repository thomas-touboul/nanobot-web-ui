"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  ChevronRight, 
  Loader2, 
  Search,
  Clock,
  Type,
  FileText,
  LucideIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { HeaderWithIcon } from "@/components/HeaderWithIcon";

interface MemoryFile {
  name: string;
  path: string;
  updatedAt: string;
  size: number;
}

type SortKey = "name" | "updatedAt" | "size";

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

interface SortButtonProps {
  active: boolean;
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  order: "asc" | "desc";
}

const SortButton = ({ active, label, icon: Icon, onClick, order }: SortButtonProps) => (
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

const FileItem = ({ file }: { file: MemoryFile }) => {
  return (
    <Link
      href={`/editor?file=${file.path}`}
      className="group flex items-center justify-between px-4 py-3 bg-card border border-border rounded-xl hover:border-sky-500/20 hover:shadow-sm transition-all duration-200"
    >
      <div className="flex items-center gap-4 min-w-0">
        <div className="p-2 rounded-lg bg-sky-500/5 group-hover:bg-sky-500/10 transition-colors shadow-inner shrink-0">
          <FileText className="w-4 h-4 text-sky-500/70 group-hover:text-sky-500 transition-colors" />
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
};

const CoreCard = ({ file, title, description }: { file: MemoryFile, title: string, description: string }) => (
  <Link
    href={`/editor?file=${file.path}`}
    className="group relative p-6 bg-card border border-border rounded-2xl hover:border-sky-500/20 hover:shadow-md transition-all duration-300 overflow-hidden"
  >
    <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity text-sky-500">
      <Clock className="w-32 h-32" />
    </div>
    <div className="relative z-10 flex flex-col gap-4">
      <div className="w-12 h-12 rounded-xl flex items-center justify-center border border-sky-500/20 bg-sky-500/10 shadow-sm">
        <Clock className="w-6 h-6 text-sky-500" />
      </div>
      <div>
        <h3 className="text-lg font-bold text-foreground tracking-tight">{title}</h3>
        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{description}</p>
      </div>
      <div className="flex items-center gap-3 mt-2">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">Last Update</span>
          <span className="text-xs font-medium">{formatDate(file.updatedAt)}</span>
        </div>
        <div className="w-px h-6 bg-border/50" />
        <div className="flex flex-col">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">Size</span>
          <span className="text-xs font-medium">{formatSize(file.size)}</span>
        </div>
      </div>
    </div>
  </Link>
);

export default function MemoryPage() {
  const [files, setFiles] = useState<MemoryFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState<{key: SortKey, order: "asc" | "desc"}>({ key: "name", order: "asc" });

  useEffect(() => {
    fetch("/api/memory")
      .then((res) => res.json())
      .then((data) => {
        setFiles(data.files || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const memoryFile = files.find(f => f.name === "MEMORY.md");
  const otherFiles = files.filter(f => f.name !== "HISTORY.md" && f.name !== "MEMORY.md");

  const filteredFiles = otherFiles.filter(file => 
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const sortedFiles = [...filteredFiles].sort((a, b) => {
    let valA: string | number = a[sort.key];
    let valB: string | number = b[sort.key];
    
    if (sort.key === "updatedAt") {
      valA = new Date(a.updatedAt).getTime();
      valB = new Date(b.updatedAt).getTime();
    }

    if (valA < valB) return sort.order === "asc" ? -1 : 1;
    if (valA > valB) return sort.order === "asc" ? 1 : -1;
    return 0;
  });

  if (loading && files.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8 container max-w-7xl py-4 animate-fade-in pb-20">
      <HeaderWithIcon 
          title="Knowledge Base"
          subtitle="Manage project-specific memory and long-term facts."
          icon={Clock}
          iconColorClass="text-sky-500"
          iconBgClass="bg-sky-500/10"
          iconBorderClass="border-sky-500/20"
      />

      {/* Section 1: Core Memory */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 px-1">
          <div className="w-1 h-6 bg-sky-500 rounded-full" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-foreground/70">Core Memory</h2>
        </div>
        <div className="grid grid-cols-1 gap-6">
          {memoryFile && (
            <CoreCard 
              file={memoryFile} 
              title="Long-term Memory" 
              description="Structured facts about users, preferences, and project contexts. Always in context."
            />
          )}
        </div>
      </div>

      {/* Section 2: Knowledge Base */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-1">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-sky-500 rounded-full" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-foreground/70">Documents</h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-secondary/30 border border-border rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all"
              />
            </div>
            <div className="flex items-center gap-1 bg-secondary/20 p-1 rounded-xl border border-border/40">
              <SortButton 
                label="Name" icon={Type} active={sort.key === "name"} order={sort.order}
                onClick={() => setSort({ key: "name", order: sort.key === "name" && sort.order === "asc" ? "desc" : "asc" })} 
              />
              <SortButton 
                label="Date" icon={Clock} active={sort.key === "updatedAt"} order={sort.order}
                onClick={() => setSort({ key: "updatedAt", order: sort.key === "updatedAt" && sort.order === "desc" ? "asc" : "desc" })} 
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedFiles.map(f => <FileItem key={f.path} file={f} />)}
          {sortedFiles.length === 0 && (
            <div className="col-span-full py-12 text-center border border-dashed border-border rounded-2xl bg-secondary/5">
              <p className="text-sm text-muted-foreground italic">No additional documents found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
