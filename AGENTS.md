# Repository Guidelines

Use this playbook to keep changes consistent with the existing AI portfolio experience.

## Project Structure & Module Organization
- `src/` holds the React + TypeScript app; `components/`, `hooks/`, `pages/`, and `lib/` rely on the `@/` path alias for clean imports.
- `content/` contains Markdown with frontmatter for projects and Neural Notes—treat it as the source of truth for copy and media references.
- `public/` serves static assets and favicons; `dist/` is disposable build output.
- `docs/` captures product and testing plans (see `docs/epic-1-e2e-testing.md`); `planning-docs/` stores higher-level briefs.
- `scripts/` and `tools/` include build-time utilities; coordinate before modifying them because they affect image processing and content ingestion.

## Build, Test, and Development Commands
- `npm install` prepares dependencies (Node 20+ recommended).
- `npm run dev` starts Vite with hot reload on port 8080; use for iterative UI work.
- `npm run build` / `npm run build:dev` generate production or debug bundles; run before `npm run preview` to smoke-test locally.
- `npm run lint`, `npm run check`, and `npm run fix` run Biome linting and auto-fixes; `npm run format` rewrites files to the canonical style.

## Coding Style & Naming Conventions
- Biome enforces two-space indentation, double quotes, and ~100 character line width—let the formatter win.
- Components and pages use `PascalCase` filenames, hooks live in `src/hooks` as `use-<name>.ts`, and utility modules belong in `src/lib`.
- Co-locate component styles with Tailwind utility classes; prefer `class-variance-authority` patterns already present in shadcn-derived components.
- Keep comments purposeful (performance notes, architectural hints) and use TypeScript types or zod schemas for runtime-boundaries.

## Testing Guidelines
- Follow the Playwright plan in `docs/epic-1-e2e-testing.md`; place new E2E specs under a `tests/e2e` tree and target built assets.
- Until the harness is formalized, document manual test steps in PRs and include viewport coverage (mobile + desktop).
- Use stable selectors (data attributes) for Playwright to avoid brittle UI coupling; update the docs when new flows are covered.

## Commit & Pull Request Guidelines
- Match the existing `[agent] Short imperative summary` commit style; group related changes to keep diffs reviewable.
- PRs should link the motivating doc or issue, describe testing evidence, and attach before/after screenshots for UI tweaks.
- Request review when CI + local lint pass; note any skipped checks and justify them in the PR body.
