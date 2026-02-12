"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Save, ChevronLeft, Loader2, FileJson, FileText, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

function EditorContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const filename = searchParams.get("file");
  
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const files = [
    { name: "openclaw.json", label: "Configuration" },
    { name: "SOUL.md", label: "Personnalité" },
    { name: "MEMORY.md", label: "Mémoire Long Terme" },
    { name: "AGENTS.md", label: "Agents & Workspace" },
    { name: "TOOLS.md", label: "Outils & SSH" },
    { name: "USER.md", label: "Profil Thomas" },
  ];

  useEffect(() => {
    if (filename) {
      setLoading(true);
      fetch(`/api/files/${filename}`)
        .then((res) => res.json())
        .then((data) => {
          setContent(data.content || "");
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
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Éditeur de Fichiers</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {files.map((file) => (
            <div 
              key={file.name}
              onClick={() => router.push(`/editor?file=${file.name}`)}
              className="p-6 bg-card border border-border rounded-xl hover:border-blue-500 cursor-pointer transition-all group"
            >
              <div className="flex items-center gap-3 mb-4">
                {file.name.endsWith('.json') ? <FileJson className="text-purple-500" /> : <FileText className="text-blue-500" />}
                <span className="text-xs font-bold uppercase text-muted-foreground tracking-widest">{file.name.split('.').pop()}</span>
              </div>
              <h3 className="font-semibold text-lg">{file.label}</h3>
              <p className="text-sm text-muted-foreground mt-1">{file.name}</p>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.push("/editor")}
            className="p-2 hover:bg-accent rounded-full transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold">{filename}</h1>
            <p className="text-sm text-muted-foreground">Modification du fichier</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {message && (
            <div className="flex items-center gap-2 text-green-600 text-sm font-medium animate-in fade-in slide-in-from-right-4">
              <CheckCircle2 size={16} />
              {message}
            </div>
          )}
          <button 
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-all"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Enregistrer
          </button>
        </div>
      </div>

      <div className="flex-1 relative min-h-[500px]">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full p-6 bg-card border border-border rounded-xl font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            spellCheck={false}
          />
        )}
      </div>
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense fallback={<div>Chargement de l'éditeur...</div>}>
      <EditorContent />
    </Suspense>
  );
}
