"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Puzzle, 
  Edit, 
  ArrowRight, 
  Loader2, 
  Plus, 
  Trash2, 
  X,
  AlertTriangle,
  Info,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { HeaderWithIcon } from "@/components/HeaderWithIcon";
import { UI_TEXT } from "@/constants/ui-text";

interface Skill {
  folderName: string;
  name: string;
  description: string;
}

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [confirmName, setConfirmName] = useState("");
  
  // Create Skill state
  const [newSkillTitle, setNewSkillTitle] = useState("");
  const [newSkillDescription, setNewSkillDescription] = useState("");
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
    if (!newSkillTitle || !newSkillDescription) return;
    setCreating(true);
    try {
      const res = await fetch("/api/skills", {
        method: "POST",
        body: JSON.stringify({ title: newSkillTitle, description: newSkillDescription }),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        setIsCreateModalOpen(false);
        setNewSkillTitle("");
        setNewSkillDescription("");
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
    <div className="space-y-8 container max-w-7xl py-8 animate-fade-in pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <HeaderWithIcon 
          title={UI_TEXT.pages.skills.title} 
          subtitle={UI_TEXT.pages.skills.subtitle} 
          icon={UI_TEXT.navigation.skills.icon}
          iconColorClass={UI_TEXT.navigation.skills.color}
          iconBgClass={UI_TEXT.navigation.skills.bgColor}
          iconBorderClass={UI_TEXT.navigation.skills.borderColor}
        />

        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl transition-all font-semibold shadow-lg hover:opacity-90 active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Create New Skill
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {skills.map((skill) => (
          <div 
            key={skill.folderName} 
            className="group relative flex flex-col md:flex-row bg-card border border-border rounded-2xl overflow-hidden hover:shadow-md hover:border-primary/20 transition-all duration-300 shadow-sm"
          >
            <div className="p-6 flex-1 flex flex-col md:flex-row gap-6">
              <div className="flex items-start gap-5 flex-1 min-w-0">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center border border-primary/20 bg-primary/10 shadow-sm shrink-0 group-hover:bg-primary/20 transition-colors">
                  <Puzzle className="w-6 h-6 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">
                      {skill.name}
                    </h3>
                    <span className="text-[10px] font-mono text-muted-foreground/40 tracking-wider">
                      {skill.folderName}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {skill.description || "No description available."}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0 border-t md:border-t-0 md:border-l border-border/50 pt-4 md:pt-0 md:pl-8">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/editor?file=workspace/skills/${skill.folderName}/SKILL.md`}
                    className="p-2 rounded-lg text-muted-foreground/60 hover:text-primary hover:bg-primary/10 transition-all"
                    title="Edit Skill"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button 
                    onClick={() => {
                      setSelectedSkill(skill);
                      setIsDeleteModalOpen(true);
                    }}
                    className="p-2 rounded-lg text-muted-foreground/40 hover:text-destructive hover:bg-destructive/10 transition-all"
                    title="Delete Skill"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <Link
                  href={`/editor?file=workspace/skills/${skill.folderName}/SKILL.md`}
                  className="p-2 rounded-lg text-muted-foreground/40 group-hover:text-primary transition-all group-hover:translate-x-0.5"
                >
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        ))}

        {skills.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border-2 border-dashed border-border rounded-2xl bg-card/30 shadow-inner">
            <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
              <Puzzle className="w-8 h-8 opacity-20" />
            </div>
            <p className="text-lg font-semibold">No skills detected</p>
            <p className="text-sm mt-1">Install skills in the <code className="text-xs bg-secondary px-1 py-0.5 rounded">.nanobot/skills</code> folder</p>
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
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                  Skill Title
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. My Awesome Skill"
                  value={newSkillTitle}
                  onChange={(e) => setNewSkillTitle(e.target.value)}
                  className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">Description</label>
                <textarea 
                  placeholder="Describe what this skill does and how to use it..."
                  value={newSkillDescription}
                  onChange={(e) => setNewSkillDescription(e.target.value)}
                  className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-3 text-sm h-64 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none shadow-inner"
                />
              </div>
              
              <div className="flex items-center gap-2 p-4 bg-blue-500/5 border border-blue-500/10 rounded-xl text-blue-600 dark:text-blue-400">
                <info className="w-4 h-4 shrink-0" />
                <p className="text-xs leading-relaxed">This will create a new directory in <code>.nanobot/workspace/skills/</code> and initialize it with a <code>SKILL.md</code> file.</p>
              </div>
            </div>

            <div className="p-4 bg-secondary/20 border-t border-border flex justify-end gap-3">
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="px-4 py-2 text-sm font-medium hover:bg-secondary rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateSkill}
                disabled={!newSkillTitle || !newSkillDescription || creating}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-all shadow-md active:scale-95 flex items-center gap-2"
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
                This action is <strong className="text-foreground">permanent</strong>. It will delete the <code>.nanobot/skills/{selectedSkill.folderName}</code> directory and all its contents.
              </p>
              
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                  Type <span className="font-mono text-primary">{selectedSkill.folderName}</span> to confirm:
                </label>
                <input 
                  type="text" 
                  value={confirmName}
                  onChange={(e) => setConfirmName(e.target.value)}
                  placeholder={selectedSkill.folderName}
                  className="w-full bg-secondary/30 border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-destructive/20 focus:ring-2 transition-all font-mono"
                />
              </div>
            </div>

            <div className="p-4 bg-secondary/20 border-t border-border flex justify-end gap-3">
              <button 
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setConfirmName("");
                }}
                className="px-4 py-2 text-sm font-medium hover:bg-secondary rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteSkill}
                disabled={confirmName !== selectedSkill.folderName || deleting}
                className="px-6 py-2 bg-destructive text-destructive-foreground rounded-xl text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition-all shadow-md active:scale-95 flex items-center gap-2"
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
