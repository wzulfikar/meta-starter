The user invoked `/meta-starter $ARGUMENTS` from their project directory. The meta-starter repo lives at `~/meta-starter`.

Determine which mode to run based on `$ARGUMENTS`:

---

## Mode: no argument

If `$ARGUMENTS` is empty, introduce meta-starter to the user:

> **meta-starter** is a curated inventory of patterns, tooling decisions, and architectural choices accumulated from real projects. It scaffolds new projects using official CLIs and layers opinionated defaults on top — so the base template stays up to date and the repo only stores what's actually custom.
>
> **Usage:**
> - `/meta-starter init` — start a new project (web, mobile, or desktop)
> - `/meta-starter update` — pull the latest meta-starter changes and see what's new
> - `/meta-starter <question>` — ask anything about meta-starter's patterns, tooling, or decisions

---

## Mode: init

If `$ARGUMENTS` is `init` (or starts with `init`):

### Step 1 — Interview the developer

Ask these questions (conversationally or all at once):

1. **Project name** — what will it be called?
2. **Project type** — web, mobile (iOS/Android), desktop, or a combination?
3. **What does it do?** — a few sentences. What problem does it solve? Who uses it?
4. **Which features do you need?**
   - User authentication (login/signup)
   - Database (persistent data storage)
   - Payments or billing
   - File uploads / storage
   - Public-facing API (with rate limiting)
   - Offline support (mobile only)

### Step 2 — Scaffold with the official CLI

Based on the project type, run the appropriate command. The project is created **inside the current working directory** under a subfolder named after the project. Do NOT use `~/meta-starter` as the destination.

**Web (Next.js on Cloudflare via OpenNext):**
```bash
npm create cloudflare@latest <project-name> -- --framework=next
```
Creates under `<project-name>/`. Reference: https://opennext.js.org/cloudflare

**Mobile (Expo via Ignite):**
```bash
npx ignite-cli new <ProjectName>
```
Creates under `<ProjectName>/`. Reference: https://github.com/infinitered/ignite

**Desktop (Wails + Vite + React + Tailwind + shadcn):**
```bash
wails init -n <project-name> -t https://github.com/Mahcks/wails-vite-react-tailwind-shadcnui-ts
```
Creates under `<project-name>/`. Reference: https://github.com/Mahcks/wails-vite-react-tailwind-shadcnui-ts

For combinations (e.g. web + mobile), scaffold each template separately into its own subfolder.

### Step 3 — Apply meta-starter overlays

After scaffolding, copy the meta-starter template overlay on top of the generated project:

```bash
~/meta-starter/sync.sh <template-name> <project-name>/
```

Where `<template-name>` is `web-opennext`, `mobile-expo`, or `desktop-wails`.

Then follow the post-setup steps in the template's agent doc:
- Web: `~/meta-starter/web-opennext/docs/agents/starter-template.md`
- Mobile: `~/meta-starter/mobile-expo/docs/agents/starter-template.md`
- Desktop: no starter-template doc — apply the invariants below directly

### Step 4 — Apply invariants (all projects)

These always apply, no exceptions:
- **bun** — replace npm/pnpm as package manager and runtime
- **biome** — replace eslint + prettier for linting and formatting
- **lefthook** — replace husky for git hooks
- **tsgo** — replace tsc (`bun add -d @typescript/native-preview`)
- **ky** — replace axios or raw fetch for HTTP
- **zod** — schema validation
- **lucide-react** / **lucide-react-native** — icons

### Step 5 — Prune unneeded features

For each feature the developer said they **don't need**, remove the relevant files and clean up imports and env var references:

| Feature | Files to remove |
|---------|----------------|
| Supabase auth + DB | `src/lib/supabase/`, `SUPABASE_URL` + `SUPABASE_ANON_KEY` env vars |
| Payments (Autumn) | `src/server/lib/autumn.ts` and usages |
| Rate limiting | `src/server/routes/checkRateLimit.ts` and usages |
| Auth middleware | `src/server/routes/parseAuth.ts` (if no authentication) |

### Step 6 — Apply relevant patterns

Check `~/meta-starter/patterns/` and apply what's relevant:

| Pattern | Applies to |
|---------|-----------|
| `lefthook-for-automated-maintenance.md` | All — biome on staged files, tsgo pre-push |
| `safe-env.md` | All — validated env object, fail at startup |
| `encrypted-secrets.md` | All — commit encrypted `.env.secrets` |
| `package-json-scripts.md` | All — standard script names |
| `icons.md` | All — lucide, lucide-animated, simple-icons |
| `zed.md` | All — `.zed/settings.json` for biome auto-format |
| `agent-tools.md` | All — MCP tools for browser, simulator, GitHub |
| `thin-api-wrapper-with-ky.md` | All — ky wrapper for services without SDK |
| `parse-dont-validate-with-zod.md` | All — parse at layer boundaries |
| `react-query-cache.md` | Web / Mobile — cached data, load indicator, clear on logout |
| `services.md` | All — reference for Cloudflare, Supabase, Plunk, Trigger.dev, Autumn, Sanity, Sentry |
| `utilities.md` | All — p-queue, date-fns, nuqs |
| `expo-rapid-iteration.md` | Mobile — TestFlight/Play Store + EAS OTA updates |
| `expo-minimal-screens.md` | Mobile — Home + Settings screens |
| `product-demo.md` | Mobile — RocketSim, TinyShot, Butterkit |

### Step 7 — Finalise

1. Update `package.json` with the correct project name
2. Create `AGENTS.md` in the new project root summarising:
   - Tech stack used
   - Which optional features were included and why
   - Any project-specific conventions

---

## Mode: update

If `$ARGUMENTS` is `update`:

1. **Note the current commit** before pulling:
   ```bash
   git -C ~/meta-starter rev-parse HEAD
   ```

2. **Pull latest changes:**
   ```bash
   git -C ~/meta-starter pull origin main
   ```

3. **Get the diff** between the previous commit and the new HEAD:
   ```bash
   git -C ~/meta-starter diff <previous-commit> HEAD --stat
   git -C ~/meta-starter diff <previous-commit> HEAD
   ```

4. **Summarise the changes** for the user in plain language:
   - Which patterns were added or updated
   - Which services were added or updated
   - Any changes to invariants or tooling defaults
   - Any new templates or template modifications

---

## Mode: question

If `$ARGUMENTS` is anything other than the above, treat it as a question about meta-starter. Read the relevant files in `~/meta-starter` (patterns, template docs, AGENTS.md) and answer based on what's actually there. Cite the specific file and section when relevant.
