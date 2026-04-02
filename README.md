# Nanobot Web UI 🐈

Local management dashboard for your [Nanobot](https://github.com/HKUDS/nanobot) AI agents

[![Next.js](https://img.shields.io/badge/Next.js-16.2.1-black)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📋 Table of Contents

- [Overview](#overview)
- [✨ Features](#-features)
  - [🤖 Agent Configuration](#-agent-configuration)
  - [🔀 Multi-Agent Management](#-multi-agent-management)
  - [💬 Channel Management](#-channel-management)
  - [🧠 Knowledge Base](#-knowledge-base)
  - [⚡ Operations](#-operations)
  - [🛠️ System](#️-system)
  - [🌐 Internationalization](#-internationalization)
  - [💬 Integrated Chat](#-integrated-chat)
- [🏗️ Tech Stack](#️-tech-stack)
- [🚀 Quick Start](#-quick-start)
- [🤖 Multi-Agent Setup](#-multi-agent-setup)
- [⚙️ Configuration](#️-configuration)
- [🔌 API Routes](#-api-routes)
- [📁 Architecture](#-architecture)
- [🔒 Security](#-security)
- [📝 License](#-license)

---

## Overview

**Nanobot Web UI** is a modern, powerful web dashboard for configuring, monitoring, and operating your **Nanobot** AI agent locally. It provides an intuitive interface to manage all aspects of your agent: configuration, memory, communication channels, scheduled tasks, and more.

Built with **Next.js 16.2.1** (App Router), **Tailwind CSS 4**, it integrates directly with Nanobot's local configuration files (`~/.nanobot/config.json`) and the `nanobot-gateway` systemd service.

---

## ✨ Features

### 🤖 Agent Configuration

- **Model Settings**: Configure default model, temperature, max tokens, reasoning effort, and memory window
- **Live Gateway Monitoring**: Real-time Nanobot service status (PID, port, RPC probe)
- **Direct Config Editor**: Built-in JSON editor for advanced configuration changes
- **Agent Identity**: Workspace, provider, and operational constraints (maxToolIterations)

### 🔀 Multi-Agent Management

- **Agent Selector**: Top bar dropdown to switch between configured agents
- **Agent-Scoped Views**: All pages automatically reflect the selected agent's data (config, memory, history, etc.)
- **Independent Workspaces**: Each agent has its own `~/.nanobot-[name]/` workspace with separate:
  - Configuration (`config.json`)
  - Memory files (`workspace/memory/`)
  - History (`workspace/memory/HISTORY.md`)
  - Skills (`workspace/skills/`)
  - Cron jobs (`workspace/cron/jobs.json`)
  - Gateway service and logs
- **X-Agent-ID Header**: API routes use the `X-Agent-ID` header to route requests to the correct agent
- **Dynamic Service Discovery**: Automatically detects agents from `~/.nanobot*` directories

### 💬 Channel Management

- **Telegram**: Bot token, allowed chat IDs, reply behavior
- **WhatsApp**: Bridge URL, auth token, allowed numbers
- **Global Settings**: Manage send progress indicators across all channels

### 🧠 Knowledge Base

- **Memory Files**: Browse and manage thematic `.md` files
- **Core Files**: Edit system files (`AGENTS.md`, `SOUL.md`, `TOOLS.md`, etc.)
- **Full-text Editor**: Built-in editor with syntax highlighting for all file types

### ⚡ Operations

- **Subagents Monitor**: Real-time tracking of background tasks and sub-agents
- **Cron & Reminders**: View and manage scheduled tasks from `jobs.json`
- **History**: Browse conversation history and agent activity logs

### 🛠️ System

- **Providers**: Manage AI model provider API keys (OpenAI, Anthropic, etc.)
- **Skills Center**: List, edit, and delete agent skills
- **Theme Support**: Light/dark mode with system preference detection

### 🌐 Internationalization

- **Multilingual UI**: Interface available in **French** and **English**
- **Language Selector**: Dynamic language switching from the top bar
- **Full Translations**: All interface texts are translated
- **i18n Context**: Architecture with `LanguageContext` and `locales/fr.json`, `locales/en.json`
- **Persistence**: Selected language saved in localStorage

### 💬 Integrated Chat

- **Chat Interface**: Directly chat with your agent from the dashboard
- **Markdown & Syntax Highlighting**: GFM support and code syntax highlighting
- **Persistent Sessions**: Conversations saved in localStorage
- **New Session**: Button to reset the chat
- **Translated**: Entire chat UI translated according to selected language
- **Dedicated API**: `/api/chat` endpoint for interactions

---

## 🏗️ Tech Stack

- **Framework**: Next.js 16.2.1 (App Router, Server & Client Components)
- **Styling**: Tailwind CSS 4
- **UI Components**: Shadcn UI (Radix UI primitives)
- **Icons**: Lucide React
- **Markdown**: react-markdown, remark-gfm
- **Syntax Highlighting**: react-syntax-highlighter (OneDark theme)
- **State Management**: React Context (AgentContext, LanguageContext, ThemeProvider)
- **API**: Next.js Route Handlers (app/api)
- **System Integration**: Read/write `~/.nanobot/config.json`, systemd monitoring via `systemctl`
- **Language**: Strict TypeScript

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- npm or yarn
- A locally configured Nanobot agent

### Installation

```bash
# Clone the repository into ~/.nanobot/
git clone https://github.com/thomas-touboul/nanobot-web-ui.git ~/.nanobot/nanobot-web-ui
cd ~/.nanobot/nanobot-web-ui

# Install dependencies
npm install
```

### Development

```bash
# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production

```bash
# Build
npm run build

# Start the production server
npm start
```

For persistent background operation and auto-restart on boot, create a systemd service:

```bash
# System-wide service (requires sudo)
sudo nano /etc/systemd/system/nanobot-web-ui.service
```

```ini
[Unit]
Description=AI Agent Admin Dashboard
After=network.target

[Service]
Type=simple
User=moltbot
WorkingDirectory=/home/<USER>/.nanobot/nanobot-web-ui
Environment="PORT=18791"
Environment="NODE_ENV=production"
ExecStart=/usr/bin/npm start
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl daemon-reload
sudo systemctl enable nanobot-web-ui.service
sudo systemctl start nanobot-web-ui.service
sudo systemctl status nanobot-web-ui.service
```

For user-level services (recommended when `nanobot-gateway` is a user service), place the service file in `~/.config/systemd/user/nanobot-web-ui.service` and use `systemctl --user` commands. Enable linger with `sudo loginctl enable-linger <user>` to keep the service running after logout.

---

## 🤖 Multi-Agent Setup

Nanobot Web UI supports managing **multiple agents** from a single dashboard. Each agent has its own isolated workspace.

### Directory Structure

```
~/.nanobot/           # Default agent (legacy)
~/.nanobot-coding/    # Coding agent
~/.nanobot-trading/   # Trading agent
~/.nanobot-[name]/    # Custom agents
```

### Creating a New Agent

1. **Create the workspace directory**:
   ```bash
   mkdir -p ~/.nanobot-myagent/workspace/memory
   ```

2. **Create a basic config.json**:
   ```bash
   cat > ~/.nanobot-myagent/config.json << 'EOF'
   {
     "agents": {
       "defaults": {
         "model": "claude-sonnet-4-20250514",
         "provider": "anthropic"
       }
     },
     "gateway": {
       "port": 18792
     }
   }
   EOF
   ```

3. **Create and start the gateway service**:
   ```bash
   nano ~/.config/systemd/user/nanobot-myagent-gateway.service
   ```
   
   ```ini
   [Unit]
   Description=Nanobot MyAgent Gateway
   After=network.target

   [Service]
   Type=simple
   WorkingDirectory=/home/<USER>/.nanobot-myagent
   ExecStart=/home/<USER>/.local/share/uv/tools/nanobot-ai/bin/nanobot gateway start
   Restart=always
   RestartSec=10

   [Install]
   WantedBy=multi-user.target
   ```
   
   ```bash
   systemctl --user daemon-reload
   systemctl --user enable nanobot-myagent-gateway.service
   systemctl --user start nanobot-myagent-gateway.service
   ```

4. **Configure the gateway port** in `config.json`:
   ```json
   {
     "gateway": {
       "port": 18792
     }
   }
   ```

The agent will appear in the top bar dropdown automatically.

### Agent Discovery

The dashboard automatically discovers agents by scanning for `~/.nanobot*` directories. The agent ID is derived from the directory name:
- `.nanobot/` → `default`
- `.nanobot-coding/` → `coding`
- `.nanobot-trading/` → `trading`

---

## 🌐 Remote Access with Tailscale

You can securely access the dashboard from anywhere using **Tailscale**, a zero-config mesh VPN based on WireGuard.

### Setup

1. **Install Tailscale** on your server (Linux):
   ```bash
   curl -fsSL https://tailscale.com/install.sh | sh
   # Or: apt install tailscale
   ```

2. **Start and authenticate** on the server:
   ```bash
   sudo tailscale up
   ```
   Follow the URL to log in with the same account as your mobile device.

3. **Install Tailscale** on your mobile device (iOS/Android) and log in with the same account.

4. **Get the server's Tailscale IP**:
   ```bash
   tailscale ip
   ```
   It will look like `100.x.y.z`.

5. **Access the dashboard** from your mobile browser:
   ```
   http://<TAILSCALE_IP>:18791
   ```
   (Replace `18791` with your configured port if different.)

### Production Deployment

When running the dashboard as a systemd service (see below), ensure it listens on all interfaces:

```ini
# In /etc/systemd/system/nanobot-web-ui.service or ~/.config/systemd/user/nanobot-web-ui.service
Environment="PORT=18791"
ExecStart=/usr/bin/npm start
```

The service will be reachable via Tailscale automatically.

### Firewall

Tailscale traffic is encrypted and authenticated; no additional firewall rules are needed for the Tailscale interface. If you have a local firewall (ufw, firewalld), ensure the dashboard port (e.g., 18791) is allowed **only** on the Tailscale interface or locally.

---

## ⚙️ Configuration

The dashboard reads from and writes directly to the active agent's Nanobot configuration file:

```
~/.nanobot-[agent-id]/config.json
```

For the default agent: `~/.nanobot/config.json`

### Supported Config Sections

- `agents.defaults` — Model settings and behavior
- `channels` — Telegram, WhatsApp, etc. configuration
- `providers` — AI provider API keys
- `gateway` — Service configuration and heartbeat
- `tools` — Web search, execution, MCP servers settings

### Environment Variables (optional)

```env
# Custom path to .nanobot folder (default: ~/.nanobot)
NANOBOT_HOME=/path/to/.nanobot
```

---

## 🔌 API Routes

All routes support the `X-Agent-ID` header to target a specific agent. If omitted, the default agent is used.

| Route | Method | Description |
|-------|--------|-------------|
| `/api/agents` | GET | List all discovered agents |
| `/api/config` | GET/POST | Read/modify global configuration |
| `/api/chat` | POST | Send a message to the agent (sessions) |
| `/api/gateway/status` | GET | Nanobot-gateway service status |
| `/api/gateway/logs` | GET | Gateway logs (journal file) |
| `/api/memory` | GET/POST/PUT/DELETE | Memory files management |
| `/api/files` | GET/POST/PUT/DELETE | Arbitrary file editing |
| `/api/cron` | GET | Cron tasks list |
| `/api/history` | GET | Conversation history |
| `/api/subagents` | GET | Active subagents list |
| `/api/providers` | GET/POST/PUT/DELETE | Providers management |
| `/api/skills` | GET/POST/PUT/DELETE | Skills management |

---

## 📁 Architecture

```
src/
├── app/
│   ├── agent/              # Agent configuration page
│   ├── chat/               # Integrated chat page
│   ├── channels/           # Channel management
│   ├── core-files/         # System files
│   ├── cron/               # Scheduled tasks
│   ├── editor/             # Universal JSON editor
│   ├── gateway-logs/       # Gateway logs
│   ├── history/            # Conversation history
│   ├── layout.tsx          # Root layout with providers
│   ├── memory/             # Memory files
│   ├── models/             # Providers page
│   ├── page.tsx            # Homepage (dashboard)
│   ├── security/           # Security (chat IDs, etc.)
│   ├── skills/             # Skills management
│   └── subagents/          # Subagents monitoring
├── components/
│   ├── HeaderWithIcon.tsx  # Header with icon
│   ├── ThemeProvider.tsx   # Light/dark theme management
│   └── layout/
│       ├── Navigation.tsx  # Sidebar
│       ├── Sidebar.tsx     # Responsive sidebar
│       └── TopBar.tsx      # Top bar (language, theme)
├── constants/
│   └── ui-text.ts          # UI texts + icons + styles
├── contexts/
│   ├── AgentContext.tsx    # Agent context (config)
│   ├── LanguageContext.tsx # i18n context (fr/en)
│   └── ThemeProvider.tsx   # Theme context
├── hooks/
├── lib/
│   ├── api-client.ts       # agentFetch() wrapper for multi-agent
│   ├── cli.ts              # Nanobot CLI wrapper
│   ├── server/
│   │   ├── agents.ts      # Agent discovery logic
│   │   ├── agent-paths.ts # AgentPathResolver class
│   │   └── request-agent.ts # X-Agent-ID header parsing
│   ├── shared/
│   │   └── agent-types.ts # TypeScript types for agents
│   └── utils.ts            # Utilities (cn, etc.)
└── locales/                # (to be created) Translation files
    ├── fr.json
    └── en.json
```

---

## 🔒 Security

This dashboard is designed for **local use only**. It interacts directly with:

- Your `~/.nanobot` folder (configuration files)
- The `nanobot-gateway` systemd service (via `systemctl`)
- The local filesystem

**Recommendations**:
- Do not expose this dashboard on the internet without authentication
- Use a reverse proxy with auth if remote access is necessary
- Check permissions on the `~/.nanobot` folder (chmod 700)
- Do not share logs containing sensitive information

---

## 📝 License

MIT — See the [LICENSE](LICENSE) file for details.
