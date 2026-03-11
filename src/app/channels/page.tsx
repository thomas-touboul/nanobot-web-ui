"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Save, Loader2, RotateCcw, Send, Smartphone } from "lucide-react";
import { HeaderWithIcon } from "@/components/HeaderWithIcon";
import { UI_TEXT } from "@/constants/ui-text";

interface ChannelConfig {
  sendProgress?: boolean;
  telegram?: {
    enabled?: boolean;
    token?: string;
    allowFrom?: string[];
    proxy?: string | null;
    replyToMessage?: boolean;
  };
  whatsapp?: {
    enabled?: boolean;
    bridgeUrl?: string;
    bridgeToken?: string;
    allowFrom?: string[];
  };
}

export default function ChannelsPage() {
  const [config, setConfig] = useState<ChannelConfig>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  const [newChatId, setNewChatId] = useState("");
  const [newNumber, setNewNumber] = useState("");

  const fetchConfig = async () => {
    try {
      const res = await fetch("/api/config");
      if (res.ok) {
        const data = await res.json();
        setConfig(data.channels || {});
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
        body: JSON.stringify({ channels: config }),
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

  const addChatId = () => {
    if (!newChatId.trim()) return;
    const currentIds = config.telegram?.allowFrom || [];
    setConfig({
      ...config,
      telegram: {
        ...config.telegram,
        allowFrom: [...currentIds, newChatId.trim()]
      }
    });
    setNewChatId("");
  };

  const removeChatId = (index: number) => {
    const currentIds = config.telegram?.allowFrom || [];
    setConfig({
      ...config,
      telegram: {
        ...config.telegram,
        allowFrom: currentIds.filter((_, i) => i !== index)
      }
    });
  };

  const addNumber = () => {
    if (!newNumber.trim()) return;
    const currentNumbers = config.whatsapp?.allowFrom || [];
    setConfig({
      ...config,
      whatsapp: {
        ...config.whatsapp,
        allowFrom: [...currentNumbers, newNumber.trim()]
      }
    });
    setNewNumber("");
  };

  const removeNumber = (index: number) => {
    const currentNumbers = config.whatsapp?.allowFrom || [];
    setConfig({
      ...config,
      whatsapp: {
        ...config.whatsapp,
        allowFrom: currentNumbers.filter((_, i) => i !== index)
      }
    });
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
          title={UI_TEXT.pages.channels.title}
          subtitle={UI_TEXT.pages.channels.subtitle}
          icon={UI_TEXT.pages.channels.icon}
          iconColorClass={UI_TEXT.pages.channels.color}
          iconBgClass={UI_TEXT.pages.channels.bgColor}
          iconBorderClass={UI_TEXT.pages.channels.borderColor}
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

      {/* Global Channel Settings */}
      <div className="p-6 bg-card border border-border rounded-2xl shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60 mb-6">
          Global Settings
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl">
            <div>
              <h4 className="font-semibold text-sm">Send Progress Updates</h4>
              <p className="text-xs text-muted-foreground mt-1">Show typing indicators while processing</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.sendProgress ?? false}
                onChange={(e) => setConfig({ ...config, sendProgress: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-secondary peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-violet-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-500"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Telegram */}
        <div className="p-6 bg-card border border-border rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-blue-500/10">
              <Send className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Telegram</h3>
              <p className="text-xs text-muted-foreground">Bot integration via Telegram API</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl">
              <div>
                <h4 className="font-semibold text-sm">Enable Telegram</h4>
                <p className="text-xs text-muted-foreground mt-1">Receive and send messages</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.telegram?.enabled ?? false}
                  onChange={(e) => setConfig({
                    ...config,
                    telegram: { ...config.telegram, enabled: e.target.checked }
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-secondary peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-violet-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-500"></div>
              </label>
            </div>

            {config.telegram?.enabled && (
              <>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                    Bot Token
                  </label>
                  <input
                    type="password"
                    value={config.telegram?.token || ''}
                    onChange={(e) => setConfig({
                      ...config,
                      telegram: { ...config.telegram, token: e.target.value }
                    })}
                    placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz"
                    className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all font-mono"
                  />
                  <p className="text-xs text-muted-foreground">Get this from @BotFather on Telegram.</p>
                </div>

                <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl">
                  <div>
                    <h4 className="font-semibold text-sm">Reply to Message</h4>
                    <p className="text-xs text-muted-foreground mt-1">Reply to the message that triggered the response</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.telegram?.replyToMessage ?? false}
                      onChange={(e) => setConfig({
                        ...config,
                        telegram: { ...config.telegram, replyToMessage: e.target.checked }
                      })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-secondary peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-violet-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-500"></div>
                  </label>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                    Allowed Chat IDs
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newChatId}
                      onChange={(e) => setNewChatId(e.target.value)}
                      placeholder="Add chat ID..."
                      className="flex-1 bg-secondary/30 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all"
                      onKeyDown={(e) => e.key === 'Enter' && addChatId()}
                    />
                    <button
                      onClick={addChatId}
                      className="px-4 py-2.5 bg-violet-500 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-all"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(config.telegram?.allowFrom || []).map((id, index) => (
                      <span key={index} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-violet-500/10 text-violet-600 rounded-lg text-xs font-mono">
                        {id}
                        <button onClick={() => removeChatId(index)} className="hover:text-violet-800">
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* WhatsApp */}
        <div className="p-6 bg-card border border-border rounded-2xl shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-emerald-500/10">
              <Smartphone className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold">WhatsApp</h3>
              <p className="text-xs text-muted-foreground">WhatsApp Business integration</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl">
              <div>
                <h4 className="font-semibold text-sm">Enable WhatsApp</h4>
                <p className="text-xs text-muted-foreground mt-1">Receive and send messages</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.whatsapp?.enabled ?? false}
                  onChange={(e) => setConfig({
                    ...config,
                    whatsapp: { ...config.whatsapp, enabled: e.target.checked }
                  })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-secondary peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-emerald-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>

            {config.whatsapp?.enabled && (
              <>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                    Bridge URL
                  </label>
                  <input
                    type="text"
                    value={config.whatsapp?.bridgeUrl || ''}
                    onChange={(e) => setConfig({
                      ...config,
                      whatsapp: { ...config.whatsapp, bridgeUrl: e.target.value }
                    })}
                    placeholder="ws://localhost:3001"
                    className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-mono"
                  />
                  <p className="text-xs text-muted-foreground">WebSocket URL of the WhatsApp bridge server.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                    Bridge Token
                  </label>
                  <input
                    type="password"
                    value={config.whatsapp?.bridgeToken || ''}
                    onChange={(e) => setConfig({
                      ...config,
                      whatsapp: { ...config.whatsapp, bridgeToken: e.target.value }
                    })}
                    placeholder="Authentication token"
                    className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-mono"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                    Allowed Numbers
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newNumber}
                      onChange={(e) => setNewNumber(e.target.value)}
                      placeholder="+33612345678"
                      className="flex-1 bg-secondary/30 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
                      onKeyDown={(e) => e.key === 'Enter' && addNumber()}
                    />
                    <button
                      onClick={addNumber}
                      className="px-4 py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:opacity-90 transition-all"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(config.whatsapp?.allowFrom || []).map((num, index) => (
                      <span key={index} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-600 rounded-lg text-xs font-mono">
                        {num}
                        <button onClick={() => removeNumber(index)} className="hover:text-emerald-800">
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Raw Config Access */}
      <div className="p-6 bg-card border border-border rounded-2xl shadow-sm">
        <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60 mb-4">
          Advanced
        </h3>
        <p className="text-sm text-muted-foreground mb-4">
          For more advanced channel configuration, edit the config.json file directly.
        </p>
        <a
          href="/editor?file=config.json"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-secondary text-secondary-foreground rounded-xl transition-all font-medium hover:bg-secondary/80 active:scale-95"
        >
          <MessageSquare className="w-4 h-4" />
          Open config.json in Editor
        </a>
      </div>
    </div>
  );
}
