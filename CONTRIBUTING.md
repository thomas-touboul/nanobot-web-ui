# Contributing to Nanobot Web UI

Thank you for your interest in contributing to **Nanobot Web UI**! This document outlines the process for contributing to the project via forks and pull requests.

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Request Process](#pull-request-process)
- [Reporting Issues](#reporting-issues)
- [Questions](#questions)

---

## Code of Conduct

This project adheres to a simple principle: **be respectful and constructive**. We expect all contributors to foster a collaborative and inclusive environment.

---

## Getting Started

### 1. Fork the Repository

Click the "Fork" button on the [main repository](https://github.com/thomas-touboul/nanobot-web-ui) to create your own copy.

### 2. Clone Your Fork

```bash
git clone https://github.com/YOUR-USERNAME/nanobot-web-ui.git ~/.nanobot/nanobot-web-ui
cd ~/.nanobot/nanobot-web-ui
```

### 3. Add Upstream Remote

Link your fork to the original repository to sync changes:

```bash
git remote add upstream https://github.com/thomas-touboul/nanobot-web-ui.git
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Create a `.env.local` (Optional)

If you need to override the default `NANOBOT_HOME` path:

```env
NANOBOT_HOME=/path/to/.nanobot
```

---

## Development Workflow

### Keep Your Fork Updated

Regularly sync your fork with the upstream main branch:

```bash
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

### Create a Feature Branch

Always create a new branch for your changes:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/issue-description
```

Branch naming conventions:
- `feature/` for new features
- `fix/` for bug fixes
- `docs/` for documentation updates
- `refactor/` for code refactoring
- `chore/` for build/process changes

### Make Your Changes

- Write clean, readable code.
- Follow the [Code Standards](#code-standards).
- Test your changes locally:

```bash
npm run dev
# Visit http://localhost:3000
```

### Build Before Committing

Ensure the production build succeeds:

```bash
npm run build
```

Fix any TypeScript or build errors before proceeding.

---

## Code Standards

This project uses the following stack and conventions:

### Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Icons**: Lucide React
- **State Management**: React Context (no Redux)

### TypeScript

- Strict typing enforced.
- Avoid `any`; use proper interfaces.
- Prefer `interface` over `type` for object shapes unless using unions or tuples.
- Export types when they may be reused.

### Component Structure

- **Client Components**: Use `"use client"` directive when needed (state, effects, event handlers).
- **Server Components**: Default for pages and data-fetching components.
- Keep components small and focused.

### Styling

- Use Tailwind utility classes.
- Follow the existing design system (colors, spacing, border-radius).
- Reuse existing styles from `constants/ui-text.ts` where applicable.
- Avoid inline `style` props; use Tailwind or CSS modules.

### File Organization

- Place new pages in `src/app/` following Next.js App Router conventions.
- New components go in `src/components/` (or subfolders).
- Server-only utilities in `src/lib/server/`.
- Shared types in `src/lib/shared/`.

### API Routes

- Place in `src/app/api/` with a `route.ts` file.
- Use `NextResponse` for responses.
- Handle errors gracefully; return appropriate HTTP status codes.
- Validate input; never trust client data.

### Context and Hooks

- New global state? Create a React Context in `src/contexts/`.
- Reusable logic? Create a custom hook in `src/hooks/`.

---

## Commit Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/). Each commit message should be structured as:

```
<type>(<scope>): <subject>
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Formatting, missing semicolons, etc. (no code change)
- `refactor`: Code restructuring
- `perf`: Performance improvement
- `test`: Adding or updating tests
- `chore`: Build process, tooling, etc.
- `ci`: CI/CD changes

### Examples

```
feat(agent): add provider field to config
fix(chat): handle empty response error
docs(readme): add Tailscale setup section
style(ui): consistent border radius in cards
```

### Commit Message Rules

- Use the imperative mood: "add" not "added" or "adds".
- Do not capitalize the subject line.
- No period at the end of the subject.
- Keep subject under 50 characters.
- Body (if needed) should wrap at 72 characters and explain *what* and *why*.

---

## Pull Request Process

### 1. Open an Issue First (Optional but Recommended)

For significant changes, open an issue to discuss before starting work. This avoids duplicated effort and ensures alignment.

### 2. Prepare Your PR

- Ensure your branch is up-to-date with upstream/main:

```bash
git fetch upstream
git rebase upstream/main
```

- Squash related commits into logical units (use `git rebase -i`).
- Verify the build passes: `npm run build`.
- Ensure no linting errors: `npm run lint` (if configured).

### 3. Create the Pull Request

Push your branch to your fork:

```bash
git push origin feature/your-feature-name
```

Then open a Pull Request from your fork's branch to the upstream repository's `main` branch.

### 4. PR Description

Include in the PR description:

- **What** changes are made.
- **Why** the change is needed (reference related issues).
- **How** to test the changes (steps, screenshots if UI).
- Any **breaking changes** or migration steps.

### 5. Review Process

- Maintainers will review your code.
- Address feedback by pushing new commits to your branch.
- Once approved, a maintainer will merge your PR (squash merge by default).

### 6. Delete Your Branch

After merge, delete your feature branch locally and on your fork:

```bash
git branch -d feature/your-feature-name
git push origin --delete feature/your-feature-name
```

---

## Reporting Issues

When reporting bugs or requesting features, use the GitHub Issues tab.

### Bug Report

Include:

- **Description**: Clear, concise.
- **Steps to reproduce**: Detailed steps.
- **Expected behavior**: What should happen.
- **Actual behavior**: What happens instead.
- **Environment**: OS, browser, Node version, etc.
- **Screenshots/Logs**: If applicable.

### Feature Request

- **Problem**: What problem does this solve?
- **Proposed solution**: How should it work?
- **Alternatives considered**: Other approaches.
- **Screenshots/Mockups**: Visual aids.

---

## Questions?

Feel free to open an issue for any questions about contributing. For quick questions, you can also reach out via the project's discussion channels (if enabled).

---

Thank you for contributing! 🎉
