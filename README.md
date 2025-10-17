# AI Engineer Portfolio

A modern, responsive portfolio website for an AI Product Engineer specializing in generative AI and machine learning solutions.

## 🚀 Features

- **Clean, Modern Design**: Orange-themed design system with beautiful gradients and animations
- **Neural Notes**: AI-focused blog section with multimedia content support
- **Project Showcase**: Detailed project portfolio with live demos and code links  
- **File-Based Content Management**: Markdown + YAML frontmatter loaded from `/content` directory
- **Automatic Image Optimization**: WebP conversion and responsive sizing with vite-imagetools
- **Responsive Design**: Optimized for all devices and screen sizes
- **SEO Optimized**: Proper meta tags, structured data, and performance optimized

## 🎨 Design System

The portfolio uses a custom orange-focused design system with:
- Primary color: Orange (#FF6B35) with variations
- Gradients and glow effects for visual appeal
- Smooth animations and transitions
- Semantic design tokens for consistency

## 📝 Content Management

### Adding Projects

Create new project files in `/content/projects/`:

```markdown
---
title: "Your Project Name"
description: "Brief project description"
date: "2024-01-20"
tags: ["AI", "React", "Python"]
github: "https://github.com/username/repo"
demo: "https://your-demo.com"
featured: true
---

# Your Project Content Here
```

### Adding Neural Notes

Create new posts in `/content/neural-notes/`:

```markdown
---
title: "Your Post Title"
excerpt: "Brief excerpt for the post"
date: "2024-01-15"
tags: ["AI", "ML"]
hasVideo: true
videoUrl: "https://youtube.com/embed/video-id"
---

# Your Post Content Here
```

## 🚀 Deployment Strategy

### Git-Based Workflow
1. **Main Branch**: Production-ready content
2. **Feature Branches**: Draft content and new features
3. **Tags**: Version releases (v1.0, v1.1, etc.)

### Recommended Workflow
```bash
# Create new content
git checkout -b feature/new-neural-note
# Add your content files
git add content/neural-notes/new-post.md
git commit -m "feat: add new neural note about transformers"
git push origin feature/new-neural-note
# Create PR for review
# Merge to main for deployment
```

### Automated Deployment
- Set up GitHub Actions for automatic deployment
- Preview deployments for pull requests
- Content validation and linting in CI/CD

## 🛠️ Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS
- **UI Components**: shadcn/ui with custom variants
- **Build Tool**: Vite with vite-imagetools for image optimization
- **Content**: Markdown with YAML frontmatter (parsed with front-matter)
- **Code Quality**: Biome for linting, formatting, and import organization
- **Git Hooks**: Pre-commit hooks for automated code quality checks
- **Image Optimization**: Automatic WebP conversion and responsive sizing
- **Deployment**: Lovable (or any static host)

## 👨‍💻 Development Setup

### Prerequisites

- Node.js 20+ and npm
- Git
- Pre-commit (for code quality hooks)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/davideasaf.com
   cd davideasaf.com
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Install pre-commit** (if not already installed):
   ```bash
   pipx install pre-commit
   ```

4. **Set up pre-commit hooks**:
   ```bash
   pre-commit install
   ```

5. **Start development server**:
   ```bash
   npm run dev
   ```

### Development Commands

- `npm run dev` - Start development server on port 8080
- `npm run build` - Production build
- `npm run build:dev` - Development build with source maps
- `npm run lint` - Run Biome linter
- `npm run format` - Format code with Biome
- `npm run check` - Run Biome checks (lint + format)
- `npm run fix` - Auto-fix Biome issues
- `npm test` - Run tests in watch mode
- `npm run test:run` - Run tests once
- `npm run test:coverage` - Run tests with coverage report
- `npm run test:ui` - Run tests with interactive UI

### Testing

This project uses **Vitest** for unit testing with a focus on critical application paths (80/20 approach).

#### Running Tests

```bash
# Run tests in watch mode (recommended during development)
npm test

# Run tests once
npm run test:run

# Run tests with coverage report
npm run test:coverage

# Run tests with interactive UI
npm run test:ui
```

#### Testing Philosophy

We follow the **80/20 principle**: focus on high-value tests that catch the most critical bugs with minimal test code.

**What we test:**
- Content processing (Markdown/MDX parsing, frontmatter extraction)
- Core UI components (reusable components used across pages)
- Data transformations (formatting, filtering, sorting)
- Page-level component logic
- Error boundaries and error handling

**What we don't test (initially):**
- Third-party library internals
- Simple presentational components with no logic
- One-off edge cases with low probability

#### Coverage Requirements

- **Minimum threshold**: 38% overall coverage (enforced in CI)
- **Target**: 70-80% coverage for critical paths
- **Coverage reports**: Generated automatically in CI and available locally via `npm run test:coverage`

#### Writing Tests

Tests should:
1. **Import and test real functions** - Never duplicate production logic in tests
2. **Export functions when needed** - Export functions that need testing
3. **Test integration points** - Verify that production functions work correctly
4. **Use fixtures for data** - Provide test data, not reimplemented logic

See `CLAUDE.md` for detailed testing best practices.

### Code Quality

This project uses automated code quality checks:

- **Pre-commit hooks**: Automatically run Biome checks and tests on staged files before commit
- **CI/CD validation**: GitHub Actions runs linting, tests, and coverage checks on pull requests
- **Biome configuration**: Enforces 2-space indentation, double quotes, 100 line width

#### Bypassing Hooks

In emergencies, you can bypass pre-commit hooks:
```bash
git commit --no-verify -m "Emergency commit"
```

#### Manual Code Quality Checks

Run quality checks manually:
```bash
# Check all files
pre-commit run --all-files

# Run specific Biome commands
npm run check    # Check and auto-fix
npm run lint     # Lint only
npm run format   # Format only

# Run tests
npm run test:run          # Quick test run
npm run test:coverage     # With coverage report
```

## 📱 Sections

1. **Hero Section**: Introduction with call-to-actions
2. **About**: Skills, experience, and highlights  
3. **Projects**: Featured work with live demos
4. **Neural Notes**: AI-focused blog with multimedia support
5. **Contact**: Multiple ways to get in touch

## 🎯 SEO Features

- Semantic HTML structure
- Optimized meta tags and descriptions
- Clean URLs and proper heading hierarchy
- Image alt attributes
- Mobile-first responsive design
- Fast loading times

## 📞 Contact

Feel free to reach out for collaborations, consulting, or just to connect!

- **Email**: david@davidasaf.dev
- **GitHub**: [Your GitHub Profile]
- **LinkedIn**: [Your LinkedIn Profile]

---

Built with ❤️ using modern web technologies and AI-first design principles.