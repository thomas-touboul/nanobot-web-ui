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
  MessageSquare
} from "lucide-react";

/**
 * Centralized UI text, style and icon constants for the AI Agent Admin dashboard.
 * This facilitates maintenance and future internationalization (i18n).
 */

export const UI_TEXT = {
  navigation: {
    agent: {
      title: "Agent",
      subtitle: "Agent Settings",
      icon: Bot,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
    },
    channels: {
      title: "Channels",
      subtitle: "Telegram & WhatsApp",
      icon: MessageSquare,
      color: "text-violet-500",
      bgColor: "bg-violet-500/10",
      borderColor: "border-violet-500/20",
    },
    providers: {
      title: "Providers",
      subtitle: "Models & Keys",
      icon: Cpu,
      color: "text-cyan-500",
      bgColor: "bg-cyan-500/10",
      borderColor: "border-cyan-500/20",
    },
    coreFiles: {
      title: "Core Files",
      subtitle: "Identity & Rules",
      icon: Library,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    },
    memory: {
      title: "Memory",
      subtitle: "Short-term Logs",
      icon: History,
      color: "text-sky-500",
      bgColor: "bg-sky-500/10",
      borderColor: "border-sky-500/20",
    },
    skills: {
      title: "Skills",
      subtitle: "Capabilities",
      icon: Zap,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
    },
    subagents: {
      title: "Subagents",
      subtitle: "Active Tasks",
      icon: Users,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
    },
    history: {
      title: "History",
      subtitle: "Activity Logs",
      icon: ScrollText,
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10",
      borderColor: "border-indigo-500/20",
    },
    schedule: {
      title: "Schedule",
      subtitle: "Cron & Tasks",
      icon: Calendar,
      color: "text-rose-500",
      bgColor: "bg-rose-500/10",
      borderColor: "border-orange-500/20",
    },
  },
  pages: {
    dashboard: {
      title: "AI Agent Gateway",
      subtitle: "System status and quick access to your agent's core.",
      icon: Activity,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    },
    agent: {
      title: "Agent Configuration",
      subtitle: "Configure your agent's identity and behavior.",
      icon: Bot,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
    },
    channels: {
      title: "Channels",
      subtitle: "Manage Telegram, WhatsApp and other communication channels.",
      icon: MessageSquare,
      color: "text-violet-500",
      bgColor: "bg-violet-500/10",
      borderColor: "border-violet-500/20",
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
  },
  common: {
    loading: "Loading...",
    error: "An error occurred",
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    search: "Search...",
    refresh: "Refresh",
  }
};
