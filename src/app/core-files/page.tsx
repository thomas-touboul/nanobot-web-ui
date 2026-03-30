"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Library, 
  ChevronRight, 
  Loader2, 
  Fingerprint,
  BrainCircuit,
  TerminalSquare,
  User,
  Activity,
  ShieldCheck,
  FileText,
  LucideIcon
} from "lucide-react";
import { HeaderWithIcon } from "@/components/HeaderWithIcon";
import { useTranslation } from "@/contexts/LanguageContext";
import { UI_ICONS, UI_STYLES } from "@/constants/ui-text";

interface File {
  name: string;
  path: string;
  type: string;
}

const fileIcons: Record<string, LucideIcon> = {
  "SOUL.md": Fingerprint,
  "AGENTS.md": BrainCircuit,
  "TOOLS.md": TerminalSquare,
  "MEMORY.md": Library,
  "USER.md": User,
  "HEARTBEAT.md": Activity,
  "IDENTITY.md": ShieldCheck,
};

const fileDescriptions: Record<string, string> = {
  "SOUL.md": "Personality and behavioral guidelines.",
  "AGENTS.md": "Agent config and workspace rules.",
  "TOOLS.md": "Tool notes and SSH aliases.",
  "MEMORY.md": "Long-term curated memories.",
  "USER.md": "User info and preferences.",
  "HEARTBEAT.md": "Automated background routines.",
  "IDENTITY.md": "Base identity and system role.",
};

export default function CoreFilesPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();

  useEffect(() => {
    fetch("/api/files")
      .then((res) => res.json())
      .then((data) => {
        const coreFiles = (data.files || []).filter((f: File) => 
          f.name !== "config.json" && f.name !== "MEMORY.md"
        );
        setFiles(coreFiles);
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
    <div className="space-y-8 container max-w-7xl py-8 animate-fade-in pb-20">
      <HeaderWithIcon 
        title={t.pages.coreFiles.title}
        subtitle={t.pages.coreFiles.subtitle}
        icon={UI_ICONS.coreFiles}
        iconColorClass={UI_STYLES.coreFiles.color}
        iconBgClass={UI_STYLES.coreFiles.bgColor}
        iconBorderClass={UI_STYLES.coreFiles.borderColor}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {files.map((file) => {
          const Icon = fileIcons[file.name] || FileText;
          return (
            <Link
              key={file.name}
              href={`/editor?file=${file.path}`}
              className="group flex flex-col p-5 bg-card border border-border rounded-2xl hover:border-emerald-500/20 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-2.5 bg-secondary/50 rounded-xl group-hover:bg-emerald-500/10 transition-colors shadow-inner">
                  <Icon className="w-5 h-5 text-muted-foreground group-hover:text-emerald-500 transition-colors" />
                </div>
                <h3 className="font-bold text-base text-foreground tracking-tight group-hover:text-emerald-500 transition-colors truncate">
                  {file.name}
                </h3>
              </div>
              
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 h-9">
                {fileDescriptions[file.name] || "System definition file."}
              </p>

              <div className="mt-6 pt-4 border-t border-border/40 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground group-hover:text-primary transition-colors">
                <span>Open Editor</span>
                <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
