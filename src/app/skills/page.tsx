"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Puzzle, Edit, ArrowRight, Loader2, Zap } from "lucide-react";

interface Skill {
  folderName: string;
  name: string;
  description: string;
}

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, []);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 animate-fade-in max-w-7xl mx-auto">
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
                <div className="px-2 py-1 rounded-full bg-secondary/80 text-[10px] font-mono text-muted-foreground border border-border/50">
                  {skill.folderName}
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

        {skills.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-muted-foreground border-2 border-dashed border-border rounded-xl bg-card/50 shadow-inner">
            <Puzzle className="w-12 h-12 mb-4 opacity-20" />
            <p className="text-lg font-medium">No skills detected</p>
            <p className="text-sm">Install skills in the <code className="text-xs bg-secondary px-1 py-0.5 rounded">.openclaw/skills</code> folder</p>
          </div>
        )}
      </div>
    </div>
  );
}
