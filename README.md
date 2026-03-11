# AI Agent Admin 🐈

A powerful, local management dashboard for the configuration, memory, and personality of your **Nanobot** AI agent.

## 🚀 New Features

- **Real-time Gateway Monitoring**: Live status of the Nanobot service, including PID, port, and RPC probe.
- **Subagents Monitor**: Track background tasks and sub-agents in real-time with a dedicated dashboard.
- **Cron & Reminders Manager**: View and manage scheduled tasks directly from the UI by reading `jobs.json`.
- **Dynamic UI**: Fully responsive sidebar-based interface with integrated theme switching and gateway status.
- **Providers Management**: Easily manage your AI model providers, API keys, and custom API bases.
- **Skills Center**: List, create, and manage specialized agent skills with a simplified creation workflow.
- **Workspace Memory**: Visualization and management of the agent's knowledge base (`AGENTS.md`, `MEMORY.md`, `SOUL.md`, etc.).

## 🛠 Tech Stack

- **Next.js 15** (App Router)
- **Tailwind CSS 4**
- **Lucide React** (Icons)
- **Shadcn UI** (Components)
- **Systemd Integration**: Direct monitoring of the local nanobot-gateway service.

## 📦 Getting Started

First, install the dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to access the dashboard.

## 🔒 Security

This dashboard is designed for **local use**. It interacts directly with your `~/.nanobot` configuration files. Ensure your local environment is secure.

## License

MIT
