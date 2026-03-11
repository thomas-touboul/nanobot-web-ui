# AI Agent Admin 🐈

A powerful, local management dashboard for the configuration, memory, and operations of your **Nanobot** AI agent.

## ✨ Features

### 🤖 Agent Configuration
- **Model Settings**: Configure default model, temperature, max tokens, reasoning effort, and memory window
- **Live Gateway Monitoring**: Real-time status of the Nanobot service (PID, port, RPC probe)
- **Direct Config Editor**: Built-in JSON editor for advanced configuration changes

### 💬 Channel Management
- **Telegram**: Configure bot token, allowed chat IDs, and reply behavior
- **WhatsApp**: Set up bridge URL, authentication token, and allowed numbers
- **Global Settings**: Manage send progress indicators across all channels

### 🧠 Knowledge Base
- **Memory Files**: Browse and manage thematic memory files (`.md`)
- **Core Files**: Edit system files (`AGENTS.md`, `SOUL.md`, `TOOLS.md`, etc.)
- **Full-text Editor**: Built-in editor with syntax highlighting for all file types

### ⚡ Operations
- **Subagents Monitor**: Track background tasks and sub-agents in real-time
- **Cron & Reminders**: View and manage scheduled tasks from `jobs.json`
- **History**: Browse conversation history and agent activity logs

### 🛠️ System
- **Providers**: Manage AI model providers and API keys
- **Skills Center**: List, edit, and delete agent skills
- **Theme Support**: Light/dark mode with system preference detection

## 🏗️ Tech Stack

- **Next.js 15** (App Router)
- **Tailwind CSS 4**
- **Lucide React** (Icons)
- **Shadcn UI** (Components)
- **Systemd Integration**: Direct monitoring of the local nanobot-gateway service

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

Build for production:

```bash
npm run build
```

## ⚙️ Configuration

The dashboard reads from and writes to your local `~/.nanobot/config.json` file. Changes made through the UI are immediately persisted to disk.

### Supported Config Sections

- `agents.defaults` - Model and behavior settings
- `channels` - Telegram, WhatsApp, and other channel configurations
- `providers` - API keys for various AI providers
- `gateway` - Service configuration and heartbeat settings
- `tools` - Web search, execution, and MCP server settings

## 🔒 Security

This dashboard is designed for **local use only**. It interacts directly with your `~/.nanobot` configuration files and local system services. Ensure your local environment is secure.

## 📝 License

MIT
