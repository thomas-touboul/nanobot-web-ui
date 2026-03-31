import { 
  Settings, 
  Cpu, 
  Library, 
  History, 
  Zap, 
  ScrollText, 
  Calendar,
  Activity,
  Users,
  Bot,
  MessageSquare,
  Shield
} from "lucide-react";

/**
 * Centralized UI text, style and icon constants for the Nanobot Web UI dashboard.
 * Supports internationalization (i18n).
 */

export const UI_ICONS = {
  chat: MessageSquare,
  agent: Bot,
  channels: MessageSquare,
  providers: Cpu,
  coreFiles: Library,
  memory: History,
  skills: Zap,
  subagents: Users,
  history: ScrollText,
  schedule: Calendar,
  security: Shield,
  gatewayLogs: Activity,
};

export const UI_STYLES = {
  chat: {
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
  },
  agent: {
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
  },
  channels: {
    color: "text-violet-500",
    bgColor: "bg-violet-500/10",
    borderColor: "border-violet-500/20",
  },
  providers: {
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/20",
  },
  coreFiles: {
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/20",
  },
  memory: {
    color: "text-sky-500",
    bgColor: "bg-sky-500/10",
    borderColor: "border-sky-500/20",
  },
  skills: {
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/20",
  },
  subagents: {
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/20",
  },
  history: {
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
    borderColor: "border-indigo-500/20",
  },
  schedule: {
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
    borderColor: "border-orange-500/20",
  },
  security: {
    color: "text-blue-900",
    bgColor: "bg-blue-900/10",
    borderColor: "border-blue-900/20",
  },
  gatewayLogs: {
    color: "text-rose-500",
    bgColor: "bg-rose-500/10",
    borderColor: "border-rose-500/20",
  },
};

export const UI_TRANSLATIONS = {
  en: {
    navigation: {
      chat: { title: "Chat", subtitle: "Direct Conversation" },
      agent: { title: "Agent", subtitle: "Agent Settings" },
      channels: { title: "Channels", subtitle: "Telegram & WhatsApp" },
      providers: { title: "Providers", subtitle: "Models & Keys" },
      coreFiles: { title: "Core Files", subtitle: "Identity & Rules" },
      memory: { title: "Memory", subtitle: "Short-term Logs" },
      skills: { title: "Skills", subtitle: "Capabilities" },
      subagents: { title: "Subagents", subtitle: "Active Tasks" },
      history: { title: "History", subtitle: "Activity Logs" },
      schedule: { title: "Schedule", subtitle: "Cron & Tasks" },
      security: { title: "Security", subtitle: "Access & Permissions" },
      gatewayLogs: { title: "Gateway Logs", subtitle: "Real-time service logs" },
    },
    pages: {
      chat: {
        title: "Direct Chat",
        subtitle: "Have a conversation with your agent directly from the dashboard.",
      },
       dashboard: {
         title: "Nanobot Gateway",
         subtitle: "System status and quick access to your agent's core.",
       },
      agent: {
        title: "Agent Configuration",
        subtitle: "Configure your agent's identity and behavior.",
      },
      channels: {
        title: "Channels",
        subtitle: "Manage Telegram, WhatsApp and other communication channels.",
      },
      providers: {
        title: "Providers",
        subtitle: "Manage your AI model providers, API keys, and custom API bases.",
      },
      coreFiles: {
        title: "Core Files",
        subtitle: "Manage the agent's identity, rules, and long-term memory.",
      },
      memory: {
        title: "Memory",
        subtitle: "Visualize and manage the agent's short-term memory and logs.",
      },
      skills: {
        title: "Skills",
        subtitle: "Manage and create specialized capabilities for your agent.",
      },
      subagents: {
        title: "Subagents Monitor",
        subtitle: "Track and manage background tasks and subagents activity.",
      },
      history: {
        title: "History",
        subtitle: "Long-term activity logs from HISTORY.md",
      },
      schedule: {
        title: "Schedule",
        subtitle: "Manage your recurring tasks and reminders.",
      },
      security: {
        title: "Security",
        subtitle: "Manage access control and permission settings.",
      },
      gatewayLogs: {
        title: "Gateway Logs",
        subtitle: "Real-time system logs from the nanobot-gateway service.",
      },
    },
    common: {
      loading: "Loading...",
      error: "An error occurred",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      search: "Search...",
      refresh: "Refresh",
      online: "Online",
      offline: "Offline",
      status: "Status",
    }
  },
  fr: {
    navigation: {
      chat: { title: "Chat", subtitle: "Conversation directe" },
      agent: { title: "Agent", subtitle: "Paramètres de l'agent" },
      channels: { title: "Canaux", subtitle: "Telegram & WhatsApp" },
      providers: { title: "Fournisseurs", subtitle: "Modèles & Clés" },
      coreFiles: { title: "Fichiers Core", subtitle: "Identité & Règles" },
      memory: { title: "Mémoire", subtitle: "Logs court terme" },
      skills: { title: "Compétences", subtitle: "Capacités" },
      subagents: { title: "Sous-agents", subtitle: "Tâches actives" },
      history: { title: "Historique", subtitle: "Logs d'activité" },
      schedule: { title: "Planning", subtitle: "Cron & Tâches" },
      security: { title: "Sécurité", subtitle: "Accès & Permissions" },
      gatewayLogs: { title: "Logs Gateway", subtitle: "Logs service temps-réel" },
    },
    pages: {
      chat: {
        title: "Chat Direct",
        subtitle: "Discutez directement avec votre agent depuis le tableau de bord.",
      },
       dashboard: {
         title: "Gateway Nanobot",
         subtitle: "État du système et accès rapide au cœur de votre agent.",
       },
      agent: {
        title: "Configuration de l'Agent",
        subtitle: "Configurez l'identité et le comportement de votre agent.",
      },
      channels: {
        title: "Canaux",
        subtitle: "Gérez Telegram, WhatsApp et les autres canaux de communication.",
      },
      providers: {
        title: "Fournisseurs",
        subtitle: "Gérez vos fournisseurs de modèles IA, clés API et bases API personnalisées.",
      },
      coreFiles: {
        title: "Fichiers Core",
        subtitle: "Gérez l'identité de l'agent, ses règles et sa mémoire long terme.",
      },
      memory: {
        title: "Mémoire",
        subtitle: "Visualisez et gérez la mémoire court terme de l'agent et les logs.",
      },
      skills: {
        title: "Compétences",
        subtitle: "Gérez et créez des capacités spécialisées pour votre agent.",
      },
      subagents: {
        title: "Moniteur de Sous-agents",
        subtitle: "Suivez et gérez les tâches d'arrière-plan et l'activité des sous-agents.",
      },
      history: {
        title: "Historique",
        subtitle: "Logs d'activité long terme depuis HISTORY.md",
      },
      schedule: {
        title: "Planning",
        subtitle: "Gérez vos tâches récurrentes et vos rappels.",
      },
      security: {
        title: "Sécurité",
        subtitle: "Gérez le contrôle d'accès et les paramètres de permissions.",
      },
      gatewayLogs: {
        title: "Logs Gateway",
        subtitle: "Logs système en temps réel du service nanobot-gateway.",
      },
    },
    common: {
      loading: "Chargement...",
      error: "Une erreur est survenue",
      save: "Enregistrer",
      cancel: "Annuler",
      delete: "Supprimer",
      search: "Rechercher...",
      refresh: "Actualiser",
      online: "En ligne",
      offline: "Hors ligne",
      status: "État",
    }
  }
};

// Legacy support to avoid breaking everything at once
export const UI_TEXT = UI_TRANSLATIONS.en;
