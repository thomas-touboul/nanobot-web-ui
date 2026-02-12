"use client";

import { useState, useEffect } from "react";
import { 
  FileText, 
  Settings, 
  Activity, 
  Clock, 
  Zap, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  Database
} from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/files")
      .then((res) => res.json())
      .then((data) => {
        setFiles(data.files || []);
        setLoading(false);
      });
  }, []);

  const stats = [
    { name: "Sessions Actives", value: "1", icon: Activity, color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-900/20" },
    { name: "Skills Installés", value: "9", icon: Zap, iconColor: "text-amber-600", bg: "bg-amber-100 dark:bg-amber-900/20" },
    { name: "Dernier Backup", value: "Aujourd'hui", icon: Database, color: "text-green-600", bg: "bg-green-100 dark:bg-green-900/20" },
    { name: "Uptime Gateway", value: "24h 12m", icon: Clock, color: "text-purple-600", bg: "bg-purple-100 dark:bg-purple-900/20" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Bonjour, Thomas 👋</h1>
        <p className="text-muted-foreground mt-1">Voici un aperçu de l'état de Molt et de ses configurations.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.name} className="p-6 bg-card border border-border rounded-xl shadow-sm space-y-3">
            <div className={`w-10 h-10 ${stat.bg} rounded-lg flex items-center justify-center`}>
              <stat.icon size={20} className={stat.color || stat.iconColor} />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <FileText size={18} className="text-blue-500" />
              Configuration & Mémoire
            </h2>
            <Link href="/editor" className="text-sm text-blue-600 hover:underline flex items-center gap-1 font-medium">
              Tout voir <ArrowRight size={14} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {loading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="h-24 bg-card border border-border rounded-xl animate-pulse" />
              ))
            ) : (
              files.slice(0, 4).map((file) => (
                <Link 
                  key={file.name} 
                  href={`/editor?file=${file.name}`}
                  className="p-4 bg-card border border-border rounded-xl hover:border-blue-500/50 hover:shadow-sm transition-all group"
                >
                  <div className="flex items-center justify-between mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    <span>{file.type}</span>
                    <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                  </div>
                  <h4 className="font-semibold text-card-foreground">{file.name}</h4>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Sidebar Status */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <CheckCircle2 size={18} className="text-green-500" />
            Checks Santé
          </h2>
          <div className="bg-card border border-border rounded-xl divide-y divide-border overflow-hidden">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm font-medium">Connectivité GitHub</span>
              </div>
              <CheckCircle2 size={14} className="text-green-500" />
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm font-medium">Secrets & Sécurité</span>
              </div>
              <CheckCircle2 size={14} className="text-green-500" />
            </div>
            <div className="p-4 flex items-center justify-between opacity-50">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-amber-500 rounded-full" />
                <span className="text-sm font-medium">Redis Cache</span>
              </div>
              <AlertCircle size={14} className="text-amber-500" />
            </div>
          </div>

          <div className="p-6 bg-blue-600 rounded-xl text-white space-y-4">
            <h3 className="font-bold">Besoin d'aide ?</h3>
            <p className="text-sm text-blue-100 leading-relaxed">
              Consultez la documentation technique d'OpenClaw pour configurer vos agents ou créer de nouveaux skills.
            </p>
            <button className="w-full py-2 bg-white text-blue-600 rounded-lg text-sm font-bold hover:bg-blue-50 transition-colors">
              Voir la Doc
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
