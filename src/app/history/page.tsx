"use client";

import { useState, useEffect } from "react";
import { 
  ScrollText, 
  Search, 
  Calendar, 
  Clock, 
  RefreshCw,
  AlertCircle,
  ChevronRight,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { HeaderWithIcon } from "@/components/HeaderWithIcon";

interface HistoryEntry {
  date: string;
  content: string;
}

export default function HistoryPage() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchHistory = async (query = "") => {
    setLoading(true);
    try {
      const response = await fetch(`/api/history${query ? `?q=${encodeURIComponent(query)}` : ""}`);
      if (!response.ok) throw new Error("Failed to fetch history");
      const data = await response.json();
      setEntries(data.entries || []);
      setError(null);
    } catch (err) {
      setError("Could not load history logs. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchHistory(searchQuery);
  };

  return (
    <div className="space-y-8 container max-w-7xl py-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <HeaderWithIcon 
          icon={ScrollText} 
          title="History" 
          subtitle="Long-term activity logs from HISTORY.md"
          iconColorClass="text-indigo-500"
          iconBgClass="bg-indigo-500/10"
          iconBorderClass="border-indigo-500/20"
        />
        
        <div className="flex items-center gap-3">
          <form onSubmit={handleSearch} className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              placeholder="Search logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-secondary/50 border border-border/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all w-full md:w-64"
            />
          </form>
          <button 
            onClick={() => fetchHistory(searchQuery)}
            className="p-2.5 bg-secondary/50 border border-border/50 rounded-xl hover:bg-secondary transition-colors"
            title="Refresh"
          >
            <RefreshCw className={cn("w-4 h-4 text-muted-foreground", loading && "animate-spin")} />
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-2xl text-destructive text-sm">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="space-y-4">
        {loading && entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-500/50" />
            <p className="text-muted-foreground animate-pulse">Loading history logs...</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-secondary/20 border border-dashed border-border rounded-3xl gap-4">
            <div className="p-4 bg-background rounded-full shadow-sm">
              <ScrollText className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <div className="text-center">
              <p className="text-foreground font-medium">No history entries found</p>
              <p className="text-muted-foreground text-sm">Try a different search term or check back later.</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {entries.map((entry, index) => {
              const [datePart, timePart] = entry.date.split(' ');
              return (
                <div 
                  key={index} 
                  className="group relative flex flex-col md:flex-row gap-6 p-6 bg-card border border-border rounded-2xl hover:border-indigo-500/20 transition-all duration-300"
                >
                  <div className="flex md:flex-col items-center md:items-start gap-3 md:gap-1 min-w-[140px]">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-500 uppercase tracking-wider">
                      <Calendar className="w-3.5 h-3.5" />
                      {datePart}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                      <Clock className="w-3.5 h-3.5" />
                      {timePart}
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                      {entry.content}
                    </p>
                  </div>

                  <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity hidden md:block">
                    <ChevronRight className="w-5 h-5 text-indigo-500/20" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
