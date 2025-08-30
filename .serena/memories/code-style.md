# Code Style and Conventions - davideasaf.com

## TypeScript Configuration
- **Strict Mode**: Enabled for maximum type safety
- **Target**: ES2020 for modern browser support
- **Module System**: ES modules with `"type": "module"`
- **JSX**: React JSX transform enabled

## ESLint Configuration
- **Config Type**: Flat config with @eslint/js and typescript-eslint
- **Browser Globals**: Enabled for client-side code
- **React Hooks**: Enforced with exhaustive deps
- **React Refresh**: Warn on component exports that can't hot reload

## Naming Conventions
- **Files**: PascalCase for components (`.tsx`), camelCase for utilities (`.ts`)
- **Components**: PascalCase (e.g., `HeroSection`, `NeuralNotes`)
- **Hooks**: camelCase with `use` prefix (e.g., `useMobile`)
- **Utilities**: camelCase (e.g., `formatDate`, `calculateReadingTime`)
- **Types/Interfaces**: PascalCase (e.g., `SiteConfig`, `ProjectData`)

## Import Organization
```typescript
// External dependencies first
import React from 'react';
import { useState } from 'react';

// UI components
import { Button } from '@/components/ui/button';

// Local components
import { HeroSection } from '@/components/HeroSection';

// Utilities and hooks
import { formatDate } from '@/lib/utils';
import { useMobile } from '@/hooks/use-mobile';

// Types
import type { SiteConfig } from '@/lib/config';
```

## Component Structure
- **Functional Components**: Preferred over class components
- **Hooks**: Custom hooks for shared logic
- **Props**: TypeScript interfaces for component props
- **Default Exports**: For page components and main components
- **Named Exports**: For utilities, hooks, and reusable components

## Styling Conventions
- **CSS Classes**: Tailwind utility classes
- **Custom CSS**: CSS variables for design tokens
- **Responsive Design**: Mobile-first approach
- **Color System**: CSS custom properties for theme colors
- **Animation**: Tailwind animate classes and CSS transitions

## File Organization
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui base components
│   └── [feature]/      # Feature-specific components
├── pages/              # Route components
├── lib/                # Business logic and utilities
├── hooks/              # Custom React hooks
├── assets/             # Static assets
└── config/             # Configuration files
```

## Content Management
- **File Format**: MDX with YAML frontmatter
- **Naming**: kebab-case for file names
- **Frontmatter**: Consistent YAML structure
- **Images**: Referenced with relative paths
- **Links**: Relative URLs within the site

## Performance Best Practices
- **Lazy Loading**: Route-based code splitting
- **Image Optimization**: Automatic WebP conversion
- **Bundle Splitting**: Separate chunks for vendor and app code
- **Tree Shaking**: Enabled by default with Vite
- **Caching**: Long-term caching for static assets

## Error Handling
- **Type Safety**: Strict TypeScript prevents runtime errors
- **Fallback UI**: Graceful degradation for missing content
- **Console Logging**: Debug information in development
- **User Feedback**: Toast notifications for user actions

## Git Commit Conventions
- **Format**: `[type]: [description]`
- **Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
- **Scope**: Optional component or feature name
- **Description**: Present tense, imperative mood

## Testing Strategy
- **Framework**: Not configured (consider Vitest for unit tests)
- **Coverage**: Focus on critical user paths
- **Testing Philosophy**: 80/20 rule - test most important functionality
- **Manual Testing**: Browser testing for UI/UX verification