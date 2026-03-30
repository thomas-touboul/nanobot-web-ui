# AI Agent Admin 🐈

> Dashboard de gestion local pour votre agent IA Nanobot

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📋 Table des matières

- [Présentation](#présentation)
- [✨ Fonctionnalités](#-fonctionnalités)
  - [🤖 Configuration de l'Agent](#-configuration-de-lagent)
  - [💬 Gestion des canaux](#-gestion-des-canaux)
  - [🧠 Base de connaissances](#-base-de-connaissances)
  - [⚡ Opérations](#-opérations)
  - [🛠️ Système](#️-système)
  - [🌐 Internationalisation](#-internationalisation)
  - [💬 Chat intégré](#-chat-intégré)
- [🏗️ Stack technique](#️-stack-technique)
- [🚀 Démarrage rapide](#-démarrage-rapide)
- [⚙️ Configuration](#️-configuration)
- [🔌 API Routes](#-api-routes)
- [📁 Architecture](#-architecture)
- [🔒 Sécurité](#-sécurité)
- [📝 Licence](#-licence)

---

## Présentation

**AI Agent Admin** est un dashboard web moderne et puissant pour configurer, surveiller et opérer votre agent IA **Nanobot** en local. Il offre une interface intuitive pour gérer tous les aspects de votre agent : configuration, mémoire, canaux de communication, tâches planifiées, et bien plus encore.

L'application est construite avec **Next.js 15** (App Router), **Tailwind CSS 4**, et s'intègre directement avec les fichiers de configuration locale de Nanobot (`~/.nanobot/config.json`) ainsi qu'avec le service systemd `nanobot-gateway`.

---

## ✨ Fonctionnalités

### 🤖 Configuration de l'Agent

- **Paramètres du modèle** : Définir le modèle par défaut, température, max tokens, reasoning effort, et memory window
- **Surveillance temps réel** : Statut du service Nanobot (PID, port, probe RPC)
- **Éditeur de configuration** : Éditeur JSON intégré pour modifications avancées
- **Identité de l'agent** : Configuration du workspace, provider, et contraintes opérationnelles (maxToolIterations)

### 💬 Gestion des canaux

- **Telegram** : Token bot, chat IDs autorisés, comportement de réponse
- **WhatsApp** : URL bridge, token d'authentification, numéros autorisés
- **Paramètres globaux** : Gestion des indicateurs de progression (sendProgress)

### 🧠 Base de connaissances

- **Fichiers mémoire** : Parcourir et gérer les fichiers `.md` thématiques
- **Fichiers système** : Éditer les fichiers core (`AGENTS.md`, `SOUL.md`, `TOOLS.md`, etc.)
- **Éditeur intégré** : Éditeur avec coloration syntaxique pour tous types de fichiers

### ⚡ Opérations

- **Monitoring des subagents** : Suivi en temps réel des tâches et sub-agents
- **Cron & Rappels** : Voir et gérer les tâches planifiées depuis `jobs.json`
- **Historique** : Parcourir l'historique des conversations et logs d'activité

### 🛠️ Système

- **Providers** : Gérer les clés API des fournisseurs de modèles (OpenAI, Anthropic, etc.)
- **Centre de compétences** : Lister, éditer, et supprimer les skills de l'agent
- **Thèmes** : Support clair/sombre avec détection automatique des préférences système

### 🌐 Internationalisation

- **Support multilingue** : Interface disponible en **français** et **anglais**
- **Sélecteur de langue** : Changement dynamique depuis la barre supérieure
- **Traductions complètes** : Tous les textes de l'interface sont traduits
- **Context i18n** : Architecture avec `LanguageContext` et fichiers `locales/fr.json`, `locales/en.json`
- **Persistance** : La langue choisie est sauvegardée dans le localStorage

### 💬 Chat intégré

- **Interface de chat** : Discutez directement avec votre agent depuis le dashboard
- **Markdown & syntax highlighting** : Support du GFM et coloration syntaxique pour le code
- **Sessions persistantes** : Les conversations sont sauvegardées dans le localStorage
- **Nouvelle session** : Bouton pour réinitialiser le chat
- **Traduit** : Interface du chat entièrement traduite selon la langue sélectionnée
- **API dédiée** : Endpoint `/api/chat` pour les interactions

---

## 🏗️ Stack technique

- **Framework** : Next.js 15 (App Router, Server & Client Components)
- **Styling** : Tailwind CSS 4
- **UI Components** : Shadcn UI (Radix UI primitives)
- **Icons** : Lucide React
- **Markdown** : react-markdown, remark-gfm
- **Syntax Highlighting** : react-syntax-highlighter (thème OneDark)
- **State Management** : React Context (AgentContext, LanguageContext, ThemeProvider)
- **API** : Route Handlers Next.js (app/api)
- **Intégration système** : Lecture/écriture de `~/.nanobot/config.json`,监控 systemd via `systemctl`
- **Language** : TypeScript strict

---

## 🚀 Démarrage rapide

### Prérequis

- Node.js 18+
- npm ou yarn
- Un agent Nanobot configuré localement

### Installation

```bash
# Cloner le dépôt
git clone https://github.com/thomas-touboul/ai-agent-admin.git
cd ai-agent-admin

# Installer les dépendances
npm install
```

### Développement

```bash
# Lancer le serveur de développement
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur.

### Production

```bash
# Build
npm run build

# Démarrer le serveur de production
npm start
```

---

## ⚙️ Configuration

Le dashboard lit et écrit directement dans votre fichier de configuration Nanobot :

```
~/.nanobot/config.json
```

### Sections de configuration supportées

- `agents.defaults` — Paramètres du modèle et comportement
- `channels` — Configuration Telegram, WhatsApp, etc.
- `providers` — Clés API pour les fournisseurs d'IA
- `gateway` — Configuration du service et heartbeat
- `tools` — Paramètres web search, exécution, MCP servers

### Variables d'environnement (optionnelles)

```env
# Chemin personnalisé vers le dossier .nanobot (par défaut: ~/.nanobot)
NANOBOT_HOME=/chemin/vers/.nanobot
```

---

## 🔌 API Routes

| Route | Méthode | Description |
|-------|---------|-------------|
| `/api/config` | GET/POST | Lire/modifier la configuration globale |
| `/api/chat` | POST | Envoyer un message à l'agent (sessions) |
| `/api/gateway/status` | GET | Statut du service nanobot-gateway |
| `/api/gateway/logs` | GET | Logs du gateway (fichier journal) |
| `/api/memory` | GET/POST/PUT/DELETE | Gestion des fichiers mémoire |
| `/api/files` | GET/POST/PUT/DELETE | Édition de fichiers arbitraires |
| `/api/cron` | GET | Liste des tâches cron |
| `/api/history` | GET | Historique des conversations |
| `/api/subagents` | GET | Liste des subagents actifs |
| `/api/providers` | GET/POST/PUT/DELETE | Gestion des providers |
| `/api/skills` | GET/POST/PUT/DELETE | Gestion des compétences |

---

## 📁 Architecture

```
src/
├── app/
│   ├── agent/              # Page configuration agent
│   ├── chat/               # Page chat intégré
│   ├── channels/           # Gestion canaux
│   ├── core-files/         # Fichiers système
│   ├── cron/               # Tâches planifiées
│   ├── editor/             # Éditeur JSON universel
│   ├── gateway-logs/       # Logs du gateway
│   ├── history/            # Historique conversations
│   ├── layout.tsx          # Layout racine avec providers
│   ├── memory/             # Fichiers mémoire
│   ├── models/             # Page providers
│   ├── page.tsx            # Page d'accueil (dashboard)
│   ├── security/           # Sécurité (chat IDs, etc.)
│   ├── skills/             # Gestion skills
│   └── subagents/          # Monitoring subagents
├── components/
│   ├── HeaderWithIcon.tsx  # En-tête avec icône
│   ├── ThemeProvider.tsx   # Gestion thème clair/sombre
│   └── layout/
│       ├── Navigation.tsx  # Barre latérale
│       ├── Sidebar.tsx     # Sidebar responsive
│       └── TopBar.tsx      # Barre supérieure (langue, thème)
├── constants/
│   └── ui-text.ts          # Textes UI + icones + styles
├── contexts/
│   ├── AgentContext.tsx    # Contexte agent (config)
│   ├── LanguageContext.tsx # Contexte i18n (fr/en)
│   └── ThemeProvider.tsx   # Contexte thème
├── hooks/
├── lib/
│   ├── cli.ts              # Wrapper CLI nanobot
│   ├── server/
│   │   └── agent-paths.ts  # Résolution chemins agent
│   ├── shared/
│   │   └── agent-types.ts  # Types TypeScript
│   └── utils.ts            # Utilitaires (cn, etc.)
└── locales/                # (à créer) Fichiers de traduction
    ├── fr.json
    └── en.json
```

---

## 🔒 Sécurité

Ce dashboard est conçu pour un usage **local uniquement**. Il interagit directement avec :

- Votre dossier `~/.nanobot` (fichiers de configuration)
- Le service systemd `nanobot-gateway` (via `systemctl`)
- Le système de fichiers local

**Recommandations** :
- Ne pas exposer ce dashboard sur internet sans authentification
- Utiliser un reverse proxy avec auth si accès distant nécessaire
- Vérifier les permissions du dossier `~/.nanobot` (chmod 700)
- Ne pas partager les logs contenant des informations sensibles

---

## 📝 Licence

MIT — Voir le fichier [LICENSE](LICENSE) pour plus de détails.
