"use client";

import { useState, useEffect } from "react";
import { 
  Cpu, 
  Save, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Key,
  Globe,
  Search,
  Eye,
  EyeOff
} from "lucide-react";
import { HeaderWithIcon } from "@/components/HeaderWithIcon";
import { cn } from "@/lib/utils";

interface ProviderConfig {
  apiKey: string;
  apiBase: string | null;
  extraHeaders: any | null;
}

type Providers = Record<string, ProviderConfig>;

export default function ModelsPage() {
  const [providers, setProviders] = useState<Providers>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch("/api/providers")
      .then((res) => res.json())
      .then((data) => {
        setProviders(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch providers:", err);
        setLoading(false);
      });
  }, []);

  const handleUpdate = (name: string, field: keyof ProviderConfig, value: string) => {
    setProviders((prev) => ({
      ...prev,
      [name]: {
        ...prev[name],
        [field]: value === "" && field === "apiBase" ? null : value,
      },
    }));
    setSaveSuccess(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/providers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(providers),
      });
      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Failed to save providers:", err);
    } finally {
      setSaving(false);
    }
  };

  const toggleKeyVisibility = (name: string) => {
    setShowKeys(prev => ({ ...prev, [name]: !prev[name] }));
  };

  const filteredProviders = Object.entries(providers).filter(([name]) => 
    name.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort(([a], [b]) => a.localeCompare(b));

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8 container max-w-7xl py-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <HeaderWithIcon 
          title="Providers" 
          subtitle="Manage your AI model providers and API keys."
          icon={Cpu}
          iconColorClass="text-cyan-500"
          iconBgClass="bg-cyan-500/10"
          iconBorderClass="border-cyan-500/20"
        />
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search providers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-card border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-64 transition-all"
            />
          </div>
          
          <button
            onClick={handleSave}
            disabled={saving}
            className={cn(
              "flex items-center gap-2 px-6 py-2 rounded-xl font-semibold transition-all duration-300 shadow-sm",
              saveSuccess 
                ? "bg-emerald-500 text-white" 
                : "bg-primary text-primary-foreground hover:opacity-90 active:scale-95 disabled:opacity-50"
            )}
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : saveSuccess ? (
              <CheckCircle2 className="w-4 h-4" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {saveSuccess ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredProviders.map(([name, config]) => (
          <div 
            key={name}
            className="group bg-card border border-border rounded-2xl p-6 hover:border-cyan-500/20 hover:shadow-md transition-all duration-300"
          >
            <div className="flex flex-col md:flex-row gap-6">
              <div className="md:w-1/4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2.5 bg-secondary/50 rounded-xl group-hover:bg-cyan-500/10 transition-colors shadow-inner">
                    <Cpu className="w-5 h-5 text-muted-foreground group-hover:text-cyan-500 transition-colors" />
                  </div>
                  <h3 className="font-bold text-base text-foreground tracking-tight group-hover:text-cyan-500 transition-colors truncate capitalize">
                    {name}
                  </h3>
                </div>
                <p className="text-xs text-muted-foreground px-1 leading-relaxed">
                  Configuration for {name} provider.
                </p>
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 ml-1">
                    <Key className="w-3 h-3" /> API Key
                  </label>
                  <div className="relative">
                    <input
                      type={showKeys[name] ? "text" : "password"}
                      value={config.apiKey || ""}
                      onChange={(e) => handleUpdate(name, "apiKey", e.target.value)}
                      placeholder="Enter API key..."
                      className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all pr-10"
                    />
                    <button 
                      onClick={() => toggleKeyVisibility(name)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showKeys[name] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 ml-1">
                    <Globe className="w-3 h-3" /> API Base (Optional)
                  </label>
                  <input
                    type="text"
                    value={config.apiBase || ""}
                    onChange={(e) => handleUpdate(name, "apiBase", e.target.value)}
                    placeholder="https://api.example.com/v1"
                    className="w-full px-4 py-2.5 bg-secondary/50 border border-border rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500/20 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        {filteredProviders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 bg-card border border-dashed border-border rounded-3xl">
            <AlertCircle className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">No providers found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
