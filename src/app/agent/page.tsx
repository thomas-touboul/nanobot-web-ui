"use client";

import { useEffect, useState } from "react";
import { Bot, Save, Loader2, RotateCcw, Folder, Cpu, Gauge, Zap, Brain } from "lucide-react";
import { HeaderWithIcon } from "@/components/HeaderWithIcon";
import { useTranslation } from "@/contexts/LanguageContext";
import { UI_ICONS, UI_STYLES } from "@/constants/ui-text";
import { agentFetch } from "@/lib/api-client";
import { useAgent } from "@/contexts/AgentContext";

interface AgentConfig {
  workspace?: string;
  model?: string;
  provider?: string;
  temperature?: number;
  maxTokens?: number;
  reasoningEffort?: "low" | "medium" | "high" | null;
  memoryWindow?: number;
  maxToolIterations?: number;
}

export default function AgentPage() {
  const [config, setConfig] = useState<AgentConfig>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const { t, language } = useTranslation();
  const { activeAgent } = useAgent();

  const fetchConfig = async () => {
    try {
      const res = await agentFetch("/api/config", {}, activeAgent);
      if (res.ok) {
        const data = await res.json();
        const agentConfig = data.agents?.defaults || {};
        setConfig(agentConfig);
      } else {
        console.error("API error:", res.status);
      }
    } catch (err) {
      console.error("Failed to load config:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, [activeAgent]);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const saveRes = await agentFetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agents: { defaults: config } }),
      }, activeAgent);
      
      if (saveRes.ok) {
        setMessage({ 
          type: 'success', 
          text: language === 'fr' ? 'Configuration enregistrée avec succès !' : 'Configuration saved successfully!' 
        });
      } else {
        setMessage({ 
          type: 'error', 
          text: language === 'fr' ? "Échec de l'enregistrement de la configuration." : 'Failed to save configuration.' 
        });
      }
    } catch (err) {
      console.error(err);
      setMessage({ 
        type: 'error', 
        text: language === 'fr' ? 'Une erreur est survenue lors de l\'enregistrement.' : 'An error occurred while saving.' 
      });
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
          title={t.pages.agent.title}
          subtitle={t.pages.agent.subtitle}
          icon={UI_ICONS.agent}
          iconColorClass={UI_STYLES.agent.color}
          iconBgClass={UI_STYLES.agent.bgColor}
          iconBorderClass={UI_STYLES.agent.borderColor}
        />
        
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchConfig}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-secondary text-secondary-foreground rounded-xl transition-all font-medium hover:bg-secondary/80 active:scale-95 shrink-0"
          >
            <RotateCcw className="w-4 h-4" />
            {t.common.refresh}
          </button>
          <button 
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl transition-all font-semibold shadow-lg hover:opacity-90 active:scale-95 disabled:opacity-50 shrink-0"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {t.common.save}
          </button>
        </div>
      </div>

      {message && (
        <div className={`p-4 rounded-xl border ${message.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' : 'bg-red-500/10 border-red-500/20 text-red-600'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8">
        <div className="p-8 bg-card border border-border rounded-3xl shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Core Identity */}
            <div className="space-y-6 md:col-span-2 lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                    Workspace Path
                  </label>
                  <input
                    type="text"
                    value={config.workspace || ''}
                    readOnly
                    className="w-full bg-secondary/20 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all font-mono opacity-60 cursor-default"
                  />
                  <p className="text-[10px] text-muted-foreground ml-1 italic">
                    {language === 'fr' ? 'Lecture seule - Géré par le système' : 'Read only - System managed'}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                    Provider
                  </label>
                  <input
                    type="text"
                    value={config.provider || ''}
                    onChange={(e) => setConfig({ ...config, provider: e.target.value })}
                    placeholder="e.g. openrouter, openai"
                    className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                    Default Model
                  </label>
                  <input
                    type="text"
                    value={config.model || ''}
                    onChange={(e) => setConfig({ ...config, model: e.target.value })}
                    placeholder="e.g. anthropic/claude-3-5-sonnet"
                    className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="h-px bg-border md:col-span-2 lg:col-span-3 my-2" />

            {/* Inference Settings */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1 flex items-center gap-2">
                <Gauge className="w-3.5 h-3.5" />
                Temperature
              </label>
              <input
                type="number"
                value={config.temperature ?? ''}
                onChange={(e) => setConfig({ ...config, temperature: e.target.value ? parseFloat(e.target.value) : undefined })}
                min={0}
                max={2}
                step={0.1}
                placeholder="0.1"
                className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <p className="text-[11px] text-muted-foreground ml-1">0-2 (0 = {language === 'fr' ? 'déterministe' : 'deterministic'})</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                Max Tokens
              </label>
              <input
                type="number"
                value={config.maxTokens ?? ''}
                onChange={(e) => setConfig({ ...config, maxTokens: e.target.value ? parseInt(e.target.value) : undefined })}
                min={1}
                step={1}
                placeholder="8192"
                className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <p className="text-[11px] text-muted-foreground ml-1">{language === 'fr' ? 'Limite de longueur de réponse' : 'Response length limit'}</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                Reasoning Effort
              </label>
              <select
                value={config.reasoningEffort || ''}
                onChange={(e) => setConfig({ ...config, reasoningEffort: e.target.value as any || null })}
                className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              >
                <option value="">{language === 'fr' ? 'Non défini' : 'Not set'}</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <p className="text-[11px] text-muted-foreground ml-1">{language === 'fr' ? 'Pour les modèles de raisonnement' : 'For reasoning models'}</p>
            </div>

            <div className="h-px bg-border md:col-span-2 lg:col-span-3 my-2" />

            {/* Operational Constraints */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1 flex items-center gap-2">
                <Brain className="w-3.5 h-3.5" />
                Memory Window
              </label>
              <input
                type="number"
                value={config.memoryWindow ?? ''}
                onChange={(e) => setConfig({ ...config, memoryWindow: e.target.value ? parseInt(e.target.value) : undefined })}
                min={1}
                step={1}
                placeholder="200"
                className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <p className="text-[11px] text-muted-foreground ml-1">{language === 'fr' ? 'Nombre d\'échanges à garder' : 'Number of exchanges to keep'}</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1 flex items-center gap-2">
                <Zap className="w-3.5 h-3.5" />
                Max Tool Iterations
              </label>
              <input
                type="number"
                value={config.maxToolIterations ?? ''}
                onChange={(e) => setConfig({ ...config, maxToolIterations: e.target.value ? parseInt(e.target.value) : undefined })}
                min={1}
                step={1}
                placeholder="40"
                className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <p className="text-[11px] text-muted-foreground ml-1">{language === 'fr' ? 'Limite d\'appels d\'outils' : 'Tool call limit'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
