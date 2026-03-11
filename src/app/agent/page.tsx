"use client";

import { useEffect, useState } from "react";
import { Bot, Save, Loader2, RotateCcw } from "lucide-react";
import { HeaderWithIcon } from "@/components/HeaderWithIcon";
import { UI_TEXT } from "@/constants/ui-text";

interface AgentConfig {
  name?: string;
  description?: string;
  timezone?: string;
  language?: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  reasoningEffort?: "low" | "medium" | "high" | null;
  heartbeat?: {
    enabled?: boolean;
    intervalS?: number;
  };
  memoryWindow?: number;
  systemPrompt?: string;
}

export default function AgentPage() {
  const [config, setConfig] = useState<AgentConfig>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const fetchConfig = async () => {
    try {
      const res = await fetch("/api/config");
      if (res.ok) {
        const data = await res.json();
        setConfig(data.agent || {});
      }
    } catch (err) {
      console.error("Failed to load config:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const saveRes = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agent: config }),
      });
      
      if (saveRes.ok) {
        setMessage({ type: 'success', text: 'Configuration saved successfully!' });
      } else {
        setMessage({ type: 'error', text: 'Failed to save configuration.' });
      }
    } catch (err) {
      console.error(err);
      setMessage({ type: 'error', text: 'An error occurred while saving.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8 container max-w-7xl py-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <HeaderWithIcon 
          title={UI_TEXT.pages.agent.title}
          subtitle={UI_TEXT.pages.agent.subtitle}
          icon={UI_TEXT.pages.agent.icon}
          iconColorClass={UI_TEXT.pages.agent.color}
          iconBgClass={UI_TEXT.pages.agent.bgColor}
          iconBorderClass={UI_TEXT.pages.agent.borderColor}
        />
        
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchConfig}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-secondary text-secondary-foreground rounded-xl transition-all font-medium hover:bg-secondary/80 active:scale-95 shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl transition-all font-semibold shadow-lg hover:opacity-90 active:scale-95 disabled:opacity-50 shrink-0"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl border ${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' : 'bg-red-500/10 border-red-500/20 text-red-600'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Agent Configuration */}
        <div className="p-6 bg-card border border-border rounded-2xl shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60 mb-6">
            Agent Configuration
          </h3>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                Agent Name
              </label>
              <input
                type="text"
                value={config.name || ''}
                onChange={(e) => setConfig({ ...config, name: e.target.value })}
                placeholder="e.g. My AI Assistant"
                className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
              />
              <p className="text-xs text-muted-foreground">The display name of your agent.</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                Description
              </label>
              <textarea
                value={config.description || ''}
                onChange={(e) => setConfig({ ...config, description: e.target.value })}
                placeholder="Brief description of the agent's purpose..."
                rows={3}
                className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all resize-none"
              />
              <p className="text-xs text-muted-foreground">Optional description for documentation.</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                  Language
                </label>
                <select
                  value={config.language || 'en'}
                  onChange={(e) => setConfig({ ...config, language: e.target.value })}
                  className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                >
                  <option value="en">English</option>
                  <option value="fr">Français</option>
                  <option value="es">Español</option>
                  <option value="de">Deutsch</option>
                  <option value="it">Italiano</option>
                  <option value="pt">Português</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                  Timezone
                </label>
                <input
                  type="text"
                  value={config.timezone || ''}
                  onChange={(e) => setConfig({ ...config, timezone: e.target.value })}
                  placeholder="Europe/Paris"
                  className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground -mt-4">Primary language and IANA timezone identifier.</p>
          </div>
        </div>

        {/* Model Settings */}
        <div className="p-6 bg-card border border-border rounded-2xl shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60 mb-6">
            Model Settings
          </h3>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                Default Model
              </label>
              <input
                type="text"
                value={config.model || ''}
                onChange={(e) => setConfig({ ...config, model: e.target.value })}
                placeholder="e.g. gemini/gemini-3-flash-preview"
                className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all font-mono"
              />
              <p className="text-xs text-muted-foreground">Model identifier (provider/model-name format).</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                  Temperature
                </label>
                <input
                  type="number"
                  value={config.temperature ?? 0.7}
                  onChange={(e) => setConfig({ ...config, temperature: parseFloat(e.target.value) })}
                  min={0}
                  max={2}
                  step={0.1}
                  className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                />
                <p className="text-xs text-muted-foreground">0-2 (0 = deterministic)</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                  Max Tokens
                </label>
                <input
                  type="number"
                  value={config.maxTokens || 4096}
                  onChange={(e) => setConfig({ ...config, maxTokens: parseInt(e.target.value) })}
                  min={1}
                  step={1}
                  className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
                />
                <p className="text-xs text-muted-foreground">Response length limit</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                Reasoning Effort
              </label>
              <select
                value={config.reasoningEffort || ''}
                onChange={(e) => setConfig({ ...config, reasoningEffort: e.target.value as any || null })}
                className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
              >
                <option value="">Not set</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <p className="text-xs text-muted-foreground">For reasoning-capable models (o1, etc.)</p>
            </div>
          </div>
        </div>

        {/* Heartbeat Settings */}
        <div className="p-6 bg-card border border-border rounded-2xl shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60 mb-6">
            Heartbeat & Maintenance
          </h3>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl">
              <div>
                <h4 className="font-semibold text-sm">Enable Heartbeat</h4>
                <p className="text-xs text-muted-foreground mt-1">Periodic tasks execution</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.heartbeat?.enabled ?? true}
                  onChange={(e) => setConfig({
                    ...config,
                    heartbeat: { ...config.heartbeat, enabled: e.target.checked }
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-secondary peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-amber-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                Heartbeat Interval (seconds)
              </label>
              <input
                type="number"
                value={config.heartbeat?.intervalS || 86400}
                onChange={(e) => setConfig({
                  ...config,
                  heartbeat: { ...config.heartbeat, intervalS: parseInt(e.target.value) || 86400 }
                })}
                min={60}
                step={60}
                className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
              />
              <p className="text-xs text-muted-foreground">Default: 86400 (24 hours)</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                Memory Window
              </label>
              <input
                type="number"
                value={config.memoryWindow || 100}
                onChange={(e) => setConfig({ ...config, memoryWindow: parseInt(e.target.value) })}
                min={1}
                step={1}
                className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
              />
              <p className="text-xs text-muted-foreground">Number of exchanges to keep in context</p>
            </div>
          </div>
        </div>

        {/* System Prompt */}
        <div className="p-6 bg-card border border-border rounded-2xl shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60 mb-6">
            System Prompt
          </h3>
          
          <div className="space-y-4">
            <textarea
              value={config.systemPrompt || ''}
              onChange={(e) => setConfig({ ...config, systemPrompt: e.target.value })}
              placeholder="Enter the system prompt that defines the agent's behavior, personality, and capabilities..."
              rows={10}
              className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all resize-none font-mono"
            />
            <p className="text-xs text-muted-foreground">
              The system prompt is sent with every request to guide the model's behavior. 
              You can also manage this in the Core Files section.
            </p>
          </div>
        </div>
      </div>

      {/* Raw Config Access */}
      <div className="p-6 bg-card border border-border rounded-2xl shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60 mb-4">
          Advanced
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          For more advanced configuration options, edit the config.json file directly.
        </p>
        <a
          href="/editor?file=config.json"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-secondary text-secondary-foreground rounded-xl transition-all font-medium hover:bg-secondary/80 active:scale-95"
        >
          <Bot className="w-4 h-4" />
          Open config.json in Editor
        </a>
      </div>
    </div>
  );
}
