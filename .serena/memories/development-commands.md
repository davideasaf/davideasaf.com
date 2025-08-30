# Development Commands - davideasaf.com

## Core Development Commands
```bash
# Start development server
npm run dev
# or
vite

# Build for production
npm run build
# or
vite build

# Build for development
npm run build:dev
# or
vite build --mode development

# Preview production build
npm run preview
# or
vite preview

# Lint the codebase
npm run lint
# or
eslint .
```

## Development Server Configuration
- **Host**: `::` (IPv6 localhost)
- **Port**: 8080
- **Hot Reload**: Enabled by default
- **Component Tagging**: Enabled in development mode with lovable-tagger

## Build Commands
- **Production Build**: Optimizes and minifies code
- **Development Build**: Faster build with source maps
- **Asset Optimization**: Automatic image processing and WebP conversion

## Quality Assurance
- **Linting**: ESLint with TypeScript and React rules
- **Type Checking**: TypeScript compiler with strict mode
- **Code Formatting**: Not configured (consider adding Prettier)

## Content Development
- **Projects**: Add MDX files to `/content/projects/`
- **Neural Notes**: Add MDX files to `/content/neural-notes/`
- **Configuration**: Edit `/src/config/site.yaml` for site settings

## File Structure Commands
```bash
# List project files
ls -la

# List content directories
ls content/

# List source files
ls src/

# Check git status
git status
```

## Deployment Commands
```bash
# Build for deployment
npm run build

# Serve built files locally
npm run preview

# Deploy to production (static hosting)
# Copy /dist contents to your hosting provider
```

## Git Workflow
```bash
# Check current status
git status

# Create feature branch
git checkout -b feature/new-feature

# Add changes
git add .

# Commit changes
git commit -m "feat: add new feature"

# Push branch
git push origin feature/new-feature

# Create pull request
# Use GitHub web interface or GitHub CLI
```

## Package Management
```bash
# Install dependencies
npm install

# Add new dependency
npm install package-name

# Add development dependency
npm install --save-dev package-name

# Remove dependency
npm uninstall package-name
```

## Image Optimization
- **Automatic**: vite-imagetools handles optimization during build
- **Formats**: WebP primary, JPG fallback
- **Responsive**: Multiple sizes generated automatically
- **Quality**: 80% default for blog images, 85% for others

## Performance Monitoring
- **Bundle Analysis**: Use vite build output
- **Lighthouse**: Run on production build
- **Core Web Vitals**: Monitor with browser dev tools