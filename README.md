# Molt Admin 🦞

Interface d'administration locale pour la configuration, la mémoire et la personnalité de **Molt**.

## ⚠️ Règle de Sécurité Absolue

**ZERO DATA SENSIBLE** : Interdiction formelle de committer des secrets (tokens, mots de passe, clés API) sur ce dépôt.
- La configuration `openclaw.json` doit être lue localement mais ne doit jamais être commitée si elle contient des tokens réels (utiliser un fichier `.env` ou garder le fichier en dehors du suivi git si nécessaire).
- Le `.gitignore` est configuré pour protéger les données sensibles.

## Stack Technique
- **Next.js 15** (App Router)
- **Tailwind CSS**
- **Lucide React** (Icons)

## Développement
```bash
npm install
npm run dev
```
Accédez ensuite à l'interface sur `http://localhost:3000`.
