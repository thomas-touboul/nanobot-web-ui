"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  Save, 
  Loader2, 
  CheckCircle2, 
  FileText, 
  Pencil, 
  Eye, 
  X 
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark, oneLight } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "next-themes";

function EditorContent() {
  const searchParams = useSearchParams();
  const filename = searchParams.get("file");
  const { resolvedTheme } = useTheme();
  
  const [content, setContent] = useState("");
  const [originalContent, setOriginalContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (filename) {
      setLoading(true);
      fetch(`/api/files/${filename}`)
        .then((res) => res.json())
        .then((data) => {
          setContent(data.content || "");
          setOriginalContent(data.content || "");
          setLoading(false);
          // Default to preview mode for supported types
          setIsEditing(false);
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
        setMessage("Saved!");
        setOriginalContent(content);
        setIsEditing(false); // Return to preview after save
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  const handleExitEdit = () => {
    if (canPreview) {
      setIsEditing(false);
    } else {
      setContent(originalContent);
      setIsEditing(false);
    }
  };

  if (!filename) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4 animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center shadow-inner">
            <FileText className="w-8 h-8 opacity-50" />
        </div>
        <p className="font-medium">Select a file from the sidebar to edit.</p>
      </div>
    );
  }

  const isMarkdown = filename.endsWith(".md");
  const isJson = filename.endsWith(".json");
  const canPreview = isMarkdown || isJson;
  
  const syntaxStyle = resolvedTheme === 'dark' ? atomDark : oneLight;

  return (
    <div className="h-full flex flex-col space-y-4 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-secondary/50 rounded-lg shadow-sm border border-border/40">
            <FileText className="w-5 h-5 text-muted-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">{filename}</h1>
            <p className="text-[10px] text-muted-foreground font-mono">/home/moltbot/.openclaw/{filename}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {message && (
            <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-medium animate-fade-in mr-2">
              <CheckCircle2 size={16} />
              {message}
            </div>
          )}

          {!isEditing ? (
             <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-all shadow-sm border border-border"
            >
              <Pencil className="w-4 h-4" />
              Edit
            </button>
          ) : (
            <>
              <button
                onClick={handleExitEdit}
                className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg text-sm font-medium hover:bg-secondary/80 transition-all shadow-sm border border-border"
              >
                {canPreview ? <Eye className="w-4 h-4" /> : <X className="w-4 h-4" />}
                {canPreview ? "Preview" : "Cancel"}
              </button>
              
              <button 
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-all shadow-sm"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex-1 relative min-h-[500px] border border-border rounded-xl overflow-hidden shadow-lg bg-card">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {isEditing ? (
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="absolute inset-0 w-full h-full p-4 md:p-6 bg-transparent font-mono text-xs resize-none focus:outline-none leading-relaxed"
                spellCheck={false}
                autoFocus
              />
            ) : (
              <div className="absolute inset-0 w-full h-full overflow-y-auto p-4 md:p-6 bg-card">
                {isMarkdown ? (
                  <div className="prose prose-sm prose-zinc dark:prose-invert max-w-none">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        code({node, inline, className, children, ...props}: any) {
                          const match = /language-(\w+)/.exec(className || '');
                          return !inline && match ? (
                            <SyntaxHighlighter
                              style={syntaxStyle}
                              language={match[1]}
                              PreTag="div"
                              {...props}
                            >
                              {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                          ) : (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          );
                        }
                      }}
                    >
                      {content}
                    </ReactMarkdown>
                  </div>
                ) : isJson ? (
                  <SyntaxHighlighter 
                    language="json" 
                    style={syntaxStyle}
                    customStyle={{ background: 'transparent', padding: 0, fontSize: '0.75rem' }}
                    wrapLongLines
                  >
                    {content}
                  </SyntaxHighlighter>
                ) : (
                  <pre className="font-mono text-xs whitespace-pre-wrap">{content}</pre>
                )}
              </div>
            )}
          </>
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
