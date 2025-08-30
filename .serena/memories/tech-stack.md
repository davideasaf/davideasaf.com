# Technology Stack - davideasaf.com

## Core Technologies
- **Frontend Framework**: React 18.3.1 with TypeScript 5.8.3
- **Build Tool**: Vite 5.4.19 with React SWC plugin
- **Language**: TypeScript (strict mode enabled)
- **Styling**: Tailwind CSS 3.4.17 with custom design system
- **Routing**: React Router DOM 6.30.1 with lazy loading
- **State Management**: TanStack Query 5.83.0 for server state
- **Forms**: React Hook Form 7.61.1 with Zod validation

## UI Component Library
- **Base Components**: shadcn/ui built on Radix UI primitives
- **Icon Library**: Lucide React 0.462.0
- **Animation**: Tailwind CSS Animate plugin
- **Toast Notifications**: Sonner 1.7.4
- **Tooltips**: Radix UI Tooltip primitive

## Content Processing
- **Markdown Processing**: MDX 3.1.1 with remark plugins
- **YAML Parsing**: js-yaml 4.1.0
- **Frontmatter**: remark-mdx-frontmatter 5.2.0
- **Image Optimization**: vite-imagetools 8.0.0 with Sharp 0.34.3
- **Syntax Highlighting**: highlight.js 11.11.1 with rehype-highlight

## Development Tools
- **Package Manager**: npm/bun (bun.lockb present)
- **Linting**: ESLint 9.32.0 with TypeScript support
- **Code Formatting**: Not explicitly configured (use Prettier if needed)
- **Type Checking**: TypeScript compiler with strict settings
- **Git Hooks**: Not configured (consider husky for pre-commit hooks)

## Build Configuration
- **Vite Config**: Custom plugins for MDX and image optimization
- **PostCSS**: Autoprefixer 10.4.21 for CSS vendor prefixes
- **Asset Optimization**: Automatic WebP conversion and responsive images
- **Bundle Splitting**: Code splitting for routes with lazy loading

## Deployment
- **Target**: Static site generation
- **Host**: Lovable (or any static host)
- **Build Output**: `/dist` directory with optimized assets
- **SEO**: React Helmet Async for meta tag management

## Development Environment
- **Node Version**: Compatible with modern Node.js
- **Browser Support**: Modern browsers with CSS Grid and Flexbox
- **Mobile Support**: Responsive design with mobile-first approach
- **Performance**: Optimized with lazy loading and code splitting