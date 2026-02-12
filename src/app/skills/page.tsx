"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Puzzle, 
  Edit, 
  ArrowRight, 
  Loader2, 
  Zap, 
  Plus, 
  Trash2, 
  X,
  AlertTriangle,
  Info
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Skill {
  folderName: string;
  name: string;
  description: string;
}

const DEFAULT_SKILL_TEMPLATE = `---
name: New Skill
description: A short description of what this skill does.
---

# New Skill

Describe how to use this skill here.
`;

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [confirmName, setConfirmName] = useState("");
  
  // Create Skill state
  const [newSkillFolder, setNewSkillFolder] = useState("");
  const [newSkillContent, setNewSkillContent] = useState(DEFAULT_SKILL_TEMPLATE);
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchSkills = () => {
    setLoading(true);
    fetch("/api/skills")
      .then((res) => res.json())
      .then((data) => {
        setSkills(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleCreateSkill = async () => {
    if (!newSkillFolder) return;
    setCreating(true);
    try {
      const res = await fetch("/api/skills", {
        method: "POST",
        body: JSON.stringify({ folderName: newSkillFolder, content: newSkillContent }),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        setIsCreateModalOpen(false);
        setNewSkillFolder("");
        setNewSkillContent(DEFAULT_SKILL_TEMPLATE);
        fetchSkills();
      } else {
        const data = await res.json();
        alert(data.error || "Failed to create skill");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteSkill = async () => {
    if (!selectedSkill || confirmName !== selectedSkill.folderName) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/skills?folderName=${selectedSkill.folderName}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setIsDeleteModalOpen(false);
        setSelectedSkill(null);
        setConfirmName("");
        fetchSkills();
      } else {
        alert("Failed to delete skill");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setDeleting(false);
    }
  };

  if (loading && skills.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 animate-fade-in max-w-7xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg shadow-sm border border-primary/20">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Skills</h1>
          </div>
          <p className="text-muted-foreground text-lg ml-12">
            Manage your OpenClaw agent's capabilities and tools.
          </p>
        </div>

        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-all shadow-md active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Create New Skill
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((skill) => (
          <div 
            key={skill.folderName} 
            className="group relative flex flex-col bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl hover:border-primary/20 transition-all duration-300 shadow-sm"
          >
            <div className="p-6 flex-1 space-y-4">
              <div className="flex items-start justify-between">
                <div className="p-2 bg-secondary rounded-lg group-hover:bg-primary/10 transition-colors shadow-inner">
                  <Puzzle className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="px-2 py-1 rounded-full bg-secondary/80 text-[10px] font-mono text-muted-foreground border border-border/50">
                    {skill.folderName}
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedSkill(skill);
                      setIsDeleteModalOpen(true);
                    }}
                    className="p-1 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-xl mb-2 group-hover:text-primary transition-colors">
                  {skill.name}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {skill.description || "No description available."}
                </p>
              </div>
            </div>

            <div className="p-4 border-t border-border bg-secondary/30 flex justify-end">
              <Link
                href={`/editor?file=skills/${skill.folderName}/SKILL.md`}
                className="flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
              >
                <Edit className="w-4 h-4" />
                Edit Skill File
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        ))}

        {skills.length === 0 && !loading && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-muted-foreground border-2 border-dashed border-border rounded-xl bg-card/50 shadow-inner">
            <Puzzle className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-lg font-medium">No skills detected</p>
            <p className="text-sm">Install skills in the <code className="text-xs bg-secondary px-1 py-0.5 rounded">.openclaw/skills</code> folder</p>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border shadow-2xl rounded-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-border flex items-center justify-between bg-secondary/20">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Plus className="w-5 h-5 text-primary" />
                </div>
                <h2 className="text-xl font-bold tracking-tight">Create New Skill</h2>
              </div>
              <button onClick={() => setIsCreateModalOpen(false)} className="p-2 hover:bg-secondary rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2">
                  Folder Name
                  <span className="text-[10px] font-normal text-muted-foreground font-mono bg-secondary px-1.5 py-0.5 rounded">lowercase, no spaces</span>
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. my-awesome-skill"
                  value={newSkillFolder}
                  onChange={(e) => setNewSkillFolder(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                  className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-mono"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">SKILL.md Template</label>
                <textarea 
                  value={newSkillContent}
                  onChange={(e) => setNewSkillContent(e.target.value)}
                  className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-xs font-mono h-64 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none shadow-inner"
                />
              </div>
              
              <div className="flex items-center gap-2 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-blue-600 dark:text-blue-400">
                <Info className="w-4 h-4 shrink-0" />
                <p className="text-xs">This will create a new directory in <code>.openclaw/skills/</code> and initialize it with your content.</p>
              </div>
            </div>

            <div className="p-4 bg-secondary/30 border-t border-border flex justify-end gap-3">
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 text-sm font-medium hover:bg-secondary rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateSkill}
                disabled={!newSkillFolder || creating}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 transition-all shadow-md active:scale-95 flex items-center gap-2"
              >
                {creating && <Loader2 className="w-4 h-4 animate-spin" />}
                Create Skill
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && selectedSkill && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border shadow-2xl rounded-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-border flex items-center justify-between bg-destructive/5">
              <div className="flex items-center gap-3 text-destructive">
                <div className="p-2 bg-destructive/10 rounded-lg">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold tracking-tight">Delete Skill</h2>
              </div>
              <button onClick={() => {
                setIsDeleteModalOpen(false);
                setConfirmName("");
              }} className="p-2 hover:bg-secondary rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed">
                This action is <strong className="text-foreground">permanent</strong>. It will delete the <code>.openclaw/skills/{selectedSkill.folderName}</code> directory and all its contents.
              </p>
              
              <div className="space-y-2">
                <label className="text-sm font-semibold">
                  Type <span className="font-mono text-primary">{selectedSkill.folderName}</span> to confirm:
                </label>
                <input 
                  type="text" 
                  value={confirmName}
                  onChange={(e) => setConfirmName(e.target.value)}
                  placeholder={selectedSkill.folderName}
                  className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-destructive/20 focus:ring-2 transition-all font-mono"
                />
              </div>
            </div>

            <div className="p-4 bg-secondary/30 border-t border-border flex justify-end gap-3">
              <button 
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setConfirmName("");
                }}
                className="px-4 py-2 text-sm font-medium hover:bg-secondary rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteSkill}
                disabled={confirmName !== selectedSkill.folderName || deleting}
                className="px-6 py-2 bg-destructive text-destructive-foreground rounded-lg text-sm font-medium hover:bg-destructive/90 disabled:opacity-50 transition-all shadow-md active:scale-95 flex items-center gap-2"
              >
                {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
