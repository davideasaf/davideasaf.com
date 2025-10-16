# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development**: `npm run dev` - Start dev server on port 8080
- **Build**: `npm run build` - Production build
- **Dev Build**: `npm run build:dev` - Development build with source maps
- **Lint**: `npm run lint` - Run Biome linter
- **Format**: `npm run format` - Format code with Biome
- **Check**: `npm run check` - Run Biome checks (lint + format)
- **Fix**: `npm run fix` - Auto-fix Biome issues

## Architecture Overview

This is a React-based portfolio website built with modern web technologies:

### Tech Stack
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with SWC for fast compilation
- **Styling**: Tailwind CSS with custom orange-themed design system
- **UI Components**: shadcn/ui (Radix UI primitives)
- **Routing**: React Router DOM with lazy loading
- **Content**: File-based content management using Markdown + YAML frontmatter
- **Image Optimization**: vite-imagetools with automatic WebP conversion
- **Analytics**: PostHog integration for tracking
- **Linting/Formatting**: Biome (replaces ESLint/Prettier)

### Project Structure
- `/src/pages/` - Main route components (Index, Projects, NeuralNotes, etc.)
- `/src/components/` - Reusable components and sections
- `/src/components/ui/` - shadcn/ui components with custom styling
- `/content/` - Markdown content files with YAML frontmatter
  - `/content/projects/` - Project portfolio entries
  - `/content/neural-notes/` - Blog posts
- `/tools/` - Build-time utilities (e.g., remark plugins for image processing)

### Key Features
- **Lazy Loading**: All pages are code-split for optimal performance
- **Content Management**: File-based system loading Markdown files with frontmatter
- **Image Optimization**: Automatic WebP conversion and responsive sizing
- **Orange Design System**: Custom color palette and gradient effects
- **SEO Optimized**: React Helmet for meta tags and structured data

### Development Patterns
- Use `@/` alias for src imports (configured in Vite)
- Biome configuration enforces 2-space indentation, double quotes, 100 line width
- PostHog analytics integration with environment variables
- Error boundaries and loading states for better UX
- MDX support for rich content with custom remark plugins

### Content Creation
Projects and neural notes use YAML frontmatter in Markdown files. Key fields include:
- `title`, `description`, `date`, `tags`
- Projects: `github`, `demo`, `featured`
- Neural Notes: `excerpt`, `hasVideo`, `videoUrl`

### Testing Best Practices

**CRITICAL: Always test production code, never duplicate it**

When writing tests, follow these principles:

1. **Import and test real functions** - Never duplicate production logic in tests
   ```typescript
   // ❌ WRONG - Duplicating logic
   function getPrimaryMediaForTest(meta) { /* copy of production code */ }
   const result = getPrimaryMediaForTest(meta);

   // ✅ CORRECT - Testing actual production code
   import { getPrimaryMedia } from "./content";
   const result = getPrimaryMedia(meta);
   ```

2. **Export functions when needed for testing** - If a function needs testing but isn't exported, export it
   ```typescript
   // In production code
   export const parseFrontmatterYaml = <TMeta>(...) => { /* implementation */ }

   // In test
   import { parseFrontmatterYaml } from "./content";
   ```

3. **Test integration points, not just isolated logic** - Tests should verify that production functions work correctly
   - Test `loadNeuralNotes()` and `loadProjects()` for filtering/sorting
   - Test actual MDX loading behavior when possible
   - Verify real data flows through the system correctly

4. **Test fixtures should complement, not replace, real testing**
   - Use fixtures to provide test data, not to reimplement production logic
   - Test actual functions against fixture data
   - Fixtures are for input, not for reimplementing behavior

5. **Why this matters**:
   - **False confidence**: Tests that duplicate logic will pass even if production code is broken
   - **Maintenance burden**: Changes to production require duplicate changes in tests
   - **Missed regressions**: Production bugs slip through because tests validate the wrong code

6. **Test runner**: Vitest with coverage reporting
   - Run tests: `npm test`
   - Coverage report: `npm run test:coverage`
   - Target: 70-80% coverage for critical paths

### Important Notes
- PostHog API keys should never be hardcoded - use environment variables
- Feature flags should use enums/constants and minimal callsites
- Biome handles both linting and formatting - no need for separate ESLint/Prettier
- Images in content are automatically optimized by vite-imagetools
- The orange theme (#FF6B35) is central to the design system
- before making commits, you must always run npm run lint. If there are linting issues they must be fixed
before committing.