"use client";

import { useState, useEffect } from "react";
import { FileText, Settings, ShieldAlert, Activity } from "lucide-react";

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

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
            Molt <span className="text-blue-500">Admin</span> 🦞
          </h1>
          <p className="text-slate-500">Gérez votre configuration et votre mémoire en toute simplicité.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-full border border-amber-200 text-sm font-medium">
          <ShieldAlert size={16} />
          <span>Zéro Secrets en Git</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Status Card */}
        <div className="md:col-span-3 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
              <Activity size={24} />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">Gateway Status</h3>
              <p className="text-sm text-green-600 font-medium">Online & Ready</p>
            </div>
          </div>
          <button className="px-4 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 transition-colors">
            Redémarrer la Gateway
          </button>
        </div>

        {/* Files Section */}
        <div className="md:col-span-2 space-y-4">
          <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
            <FileText size={20} className="text-blue-500" />
            Fichiers de Configuration
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {loading ? (
              <div className="col-span-2 text-center py-10 text-slate-400">Chargement...</div>
            ) : (
              files.map((file) => (
                <div key={file.name} className="p-4 bg-white rounded-xl shadow-sm border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer group">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded ${file.type === 'json' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                      {file.type}
                    </span>
                    <Settings size={14} className="text-slate-300 group-hover:text-blue-400" />
                  </div>
                  <h4 className="font-medium text-slate-900 truncate">{file.name}</h4>
                  <p className="text-xs text-slate-400 mt-1 truncate">{file.path}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-900">Actions Rapides</h2>
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
            <button className="w-full text-left p-3 bg-white rounded-xl border border-slate-200 text-sm font-medium hover:border-blue-300 transition-all">
              Éditer ma Personnalité (SOUL)
            </button>
            <button className="w-full text-left p-3 bg-white rounded-xl border border-slate-200 text-sm font-medium hover:border-blue-300 transition-all">
              Mettre à jour la Mémoire
            </button>
            <button className="w-full text-left p-3 bg-white rounded-xl border border-slate-200 text-sm font-medium hover:border-blue-300 transition-all">
              Gérer les Skills
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
