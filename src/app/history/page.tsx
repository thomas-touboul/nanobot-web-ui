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
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { HeaderWithIcon } from "@/components/HeaderWithIcon";
import { UI_TEXT } from "@/constants/ui-text";

interface HistoryEntry {
  date: string;
  content: string;
}

interface HistoryResponse {
  entries: HistoryEntry[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

export default function HistoryPage() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [pagination, setPagination] = useState<HistoryResponse>({
    entries: [],
    total: 0,
    page: 1,
    totalPages: 0,
    limit: 10
  });

  const fetchHistory = async (query = "", page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query) params.append('q', query);
      params.append('page', page.toString());
      params.append('limit', '10');
      
      const response = await fetch(`/api/history?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch history");
      const data: HistoryResponse = await response.json();
      setEntries(data.entries || []);
      setPagination(data);
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
    fetchHistory(searchQuery, 1);
  };

  const goToPage = (page: number) => {
    if (page < 1 || page > pagination.totalPages) return;
    fetchHistory(searchQuery, page);
  };

  const { page, totalPages, total } = pagination;

  return (
    <div className="space-y-8 container max-w-7xl py-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <HeaderWithIcon 
          icon={UI_TEXT.navigation.history.icon} 
          title={UI_TEXT.pages.history.title} 
          subtitle={UI_TEXT.pages.history.subtitle}
          iconColorClass={UI_TEXT.navigation.history.color}
          iconBgClass={UI_TEXT.navigation.history.bgColor}
          iconBorderClass={UI_TEXT.navigation.history.borderColor}
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
            onClick={() => fetchHistory(searchQuery, page)}
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
          <>
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border/40">
                <div className="text-sm text-muted-foreground">
                  Showing <span className="font-medium text-foreground">{(page - 1) * pagination.limit + 1}</span> to{" "}
                  <span className="font-medium text-foreground">{Math.min(page * pagination.limit, total)}</span> of{" "}
                  <span className="font-medium text-foreground">{total}</span> entries
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => goToPage(1)}
                    disabled={page === 1}
                    className="p-2 rounded-lg border border-border bg-background hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="First page"
                  >
                    <ChevronsLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => goToPage(page - 1)}
                    disabled={page === 1}
                    className="p-2 rounded-lg border border-border bg-background hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Previous page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum: number;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (page <= 3) {
                        pageNum = i + 1;
                      } else if (page >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = page - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => goToPage(pageNum)}
                          className={cn(
                            "w-8 h-8 text-sm font-medium rounded-lg transition-colors",
                            page === pageNum
                              ? "bg-primary text-primary-foreground"
                              : "bg-background border border-border hover:bg-secondary"
                          )}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => goToPage(page + 1)}
                    disabled={page === totalPages}
                    className="p-2 rounded-lg border border-border bg-background hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Next page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => goToPage(totalPages)}
                    disabled={page === totalPages}
                    className="p-2 rounded-lg border border-border bg-background hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Last page"
                  >
                    <ChevronsRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
