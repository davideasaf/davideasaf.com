## Migrate linting and formatting to Biome

This doc describes how to replace ESLint (and any Prettier usage) with Biome for unified linting, formatting, and import organization in this repo.

Reference: Biome Getting Started guide — [biomejs.dev/guides/getting-started](https://biomejs.dev/guides/getting-started/).

### Goals

- Use a single fast tool for format + lint + organize imports
- Replace `eslint` usage in scripts and CI
- Keep configuration minimal and repo‑local

### 1) Install Biome (pinned)

We use npm in this project. Pin the version with `-E`:

```bash
npm i -D -E @biomejs/biome
```

Alternative package managers are documented in the guide above.

### 2) Initialize configuration

Generate a `biome.json` at the repo root:

```bash
npx @biomejs/biome init
```

This creates a schema‑typed config. Tweak it to suit this codebase (TypeScript + React + Vite). Suggested baseline:

```json
{
  "$schema": "https://biomejs.dev/schemas/2.0.0/schema.json",
  "files": {
    "ignore": ["dist/**", "node_modules/**", "public/**"]
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "linter": {
    "enabled": true,
    "rules": { "recommended": true }
  },
  "organizeImports": { "enabled": true },
  "vcs": { "enabled": true, "client": "git" }
}
```

Notes:

- Keep the `$schema` version Biome generated if it differs; it will be correct for your installed version.
- Add any other generated-output paths you want ignored under `files.ignore`.

### 3) Update package scripts

Replace ESLint usage and add format/check/fix tasks:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:dev": "vite build --mode development",
    "preview": "vite preview",
    "format": "biome format --write .",
    "lint": "biome lint .",
    "check": "biome check .",
    "fix": "biome check --write ."
  }
}
```

Common usage:

```bash
# Format all files in-place
npm run format

# Lint without writing
npm run lint

# Run formatter + linter + organize imports
npm run check

# Apply safe fixes (recommended default in pre-commit)
npm run fix
```

CLI reference for these commands is in the Biome docs under “Command-line interface” in the Getting Started guide.

### 4) Remove ESLint (and Prettier, if present)

Delete ESLint config files and uninstall ESLint packages:

- Remove `eslint.config.js`
- Uninstall ESLint deps currently used in this repo:

```bash
npm rm eslint @eslint/js eslint-plugin-react-hooks eslint-plugin-react-refresh globals typescript-eslint
```

If a Prettier setup exists (not present today), remove `.prettierrc*` files and uninstall `prettier`.

### 5) Optional: IDE integration

- Install the official “Biome” extension for your editor (VS Code/IntelliJ/Zed are first‑party). This enables on‑save format and inline diagnostics.
- Disable any conflicting formatters/linters (ESLint, Prettier) to avoid double-editing.

### 6) Optional: CI integration (GitHub Actions)

Add a Biome check job (works like `biome check`, optimized for CI):

```yaml
name: biome
on: [push, pull_request]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"
      - run: npm ci
      - run: npx @biomejs/biome ci
```

Alternatively add `- run: npm run check` if you prefer scripts.

### 7) Rollout plan

1. Install + init Biome
2. Commit `biome.json`
3. Update package scripts and remove ESLint deps/config
4. Run `npm run fix` and commit the formatting/lint changes
5. Add CI job (optional)

### 8) Suppression comments (mapping)

Biome uses `biome-ignore` comments instead of ESLint disables. Examples:

```ts
// biome-ignore lint/suspicious/noExplicitAny: third-party types
const value: any = getLegacy();

// biome-ignore format: preserve intended layout
const tpl = `   indented   `;
```

See Biome’s Linter docs for rule names and domains.

### Verification

- Run `npm run check` locally; the exit code should be 0 after fixes.
- Ensure no editor shows overlapping ESLint/Prettier diagnostics.
- Confirm `dist/` and other generated paths are ignored by Biome.
