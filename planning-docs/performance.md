## Loader elimination and snappiness plan

### Goals

- Remove full-screen loaders on initial app load and on navigation to `projects` and `neural-notes`.
- Keep the site purely static, with instant-feeling route transitions.

### Phase 1 — Remove page-level loaders (no infra changes)

1. Make content APIs synchronous

   - Add sync getters in `src/lib/content.ts`:
     - `getNeuralNotesSync()`, `getNeuralNoteBySlugSync(slug)`
     - `getProjectsSync()`, `getProjectByIdSync(id)`
   - Implementation: use `import.meta.glob(..., { eager: true })` synchronously and compute reading time with a fixed WPM constant (e.g. 200) to avoid async config loading. Sort deterministically at module init.

2. Update pages to read synchronously and remove spinners

   - `src/pages/NeuralNotes.tsx`: replace `useEffect`+state with a sync call (optionally `useMemo`) to `getNeuralNotesSync()`. Delete the loading UI branch.
   - `src/pages/NeuralNote.tsx`: same pattern using `getNeuralNoteBySlugSync(slug)`. Keep the not-found error branch.
   - `src/pages/Project.tsx`: compute `project` directly from the static array or `getProjectByIdSync(id)`; remove `useEffect` and loading state entirely.

3. Reduce route-level Suspense fallback

   - Eager-import the most common pages (`Index`, `Projects`, `NeuralNotes`). Keep `Project`, `NeuralNote`, and `NotFound` lazy.
   - Keep `<Suspense>` but its fallback will rarely show (only for detail routes). Optionally set `fallback={null}` or a minimal top progress bar instead of a full-screen overlay.

4. Prefetch route chunks before navigation
   - In `src/components/Navigation.tsx`, prefetch list routes on hover: `import('@/pages/Projects')`, `import('@/pages/NeuralNotes')`.
   - In list pages, prefetch detail routes on mount: `import('@/pages/Project')`, `import('@/pages/NeuralNote')`. Optionally prefetch when a card enters the viewport (IntersectionObserver) for scalability.

Expected outcome after Phase 1

- First load of `/` renders immediately (no spinner).
- Navigating to `/projects` and `/neural-notes` shows content immediately (no spinner).
- Navigating into a specific project or note is effectively instant after prefetch.

### Phase 2 — Optional PWA/service worker for instant revisits

1. Add `vite-plugin-pwa`

   - Install and configure with `registerType: 'autoUpdate'`.
   - Provide a minimal web manifest (name, theme colors, icons in `public/`).
   - Workbox config: precache hashed `dist/assets/**/*.{js,css}` and runtime cache images (`stale-while-revalidate`).

2. Benefits
   - Subsequent visits and route navigations load from the service worker cache (near-instant).
   - Offline capability for previously visited pages and assets.
   - No change to authoring model; still fully static.

Notes

- PWA/SW does not eliminate first-visit network fetches; Phase 1 changes address first-visit spinners. PWA accelerates subsequent visits and enables offline.

### Phase 3 — Nice-to-haves

- Preload above-the-fold hero image(s) and critical CSS if needed.
- Consider a tiny route-change progress bar (top edge) instead of a blocking overlay.

### Acceptance criteria

- No full-screen loader on initial app load.
- Navigating to `/projects` and `/neural-notes` shows immediate content without a spinner.
- Detail pages (`/projects/:id`, `/neural-notes/:slug`) feel instant after prefetch (TTI < 100ms on repeat).

### Rollout

- Implement Phase 1 in a single PR. Measure. If desired, follow with PWA in a second PR.
