"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Save, ChevronLeft, Loader2, CheckCircle2, FileText } from "lucide-react";

function EditorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const filename = searchParams.get("file");
  
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (filename) {
      setLoading(true);
      fetch(`/api/files/${filename}`)
        .then((res) => res.json())
        .then((data) => {
          setContent(data.content || "");
          setLoading(false);
        })
        .catch(err => {
            console.error(err);
            setLoading(false);
        });
    }
  }, [filename]);

  const handleSave = async () => {
    if (!filename) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/files/${filename}`, {
        method: "POST",
        body: JSON.stringify({ content }),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        setMessage("Enregistré avec succès !");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  if (!filename) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
            <FileText className="w-8 h-8 opacity-50" />
        </div>
        <p className="font-medium">Sélectionnez un fichier dans la barre latérale pour l'éditer.</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-secondary/50 rounded-lg">
            <FileText className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">{filename}</h1>
            <p className="text-xs text-muted-foreground font-mono">/home/moltbot/.openclaw/{filename}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {message && (
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-medium animate-fade-in">
              <CheckCircle2 size={16} />
              {message}
            </div>
          )}
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-all shadow-sm"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Enregistrer
          </button>
        </div>
      </div>

      <div className="flex-1 relative min-h-[500px] border border-border rounded-xl overflow-hidden shadow-sm bg-card">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full p-6 bg-transparent font-mono text-sm resize-none focus:outline-none leading-relaxed"
            spellCheck={false}
          />
        )}
      </div>
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense fallback={<div className="h-full flex items-center justify-center"><Loader2 className="animate-spin text-muted-foreground" /></div>}>
      <EditorContent />
    </Suspense>
  );
}
