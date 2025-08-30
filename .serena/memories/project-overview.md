# Project Overview - davideasaf.com

## Purpose
This is a modern, responsive portfolio website for David Asaf, an AI Product Engineer specializing in generative AI and machine learning solutions. The site showcases his work, expertise, and thought leadership in the AI space.

## Key Features
- **Clean, Modern Design**: Orange-themed design system with beautiful gradients and animations
- **Neural Notes**: AI-focused blog section with multimedia content support
- **Project Showcase**: Detailed project portfolio with live demos and code links
- **File-Based Content Management**: Markdown + YAML frontmatter loaded from `/content` directory
- **Automatic Image Optimization**: WebP conversion and responsive sizing with vite-imagetools
- **Responsive Design**: Optimized for all devices and screen sizes
- **SEO Optimized**: Proper meta tags, structured data, and performance optimized

## Content Structure
### Content Management
- **Projects**: Located in `/content/projects/` as MDX files with YAML frontmatter
- **Neural Notes**: Located in `/content/neural-notes/` as MDX files with YAML frontmatter
- **Site Config**: YAML configuration in `/src/config/site.yaml`

### Site Sections
1. **Hero Section**: Introduction with call-to-actions
2. **About**: Skills, experience, and highlights
3. **Projects**: Featured work with live demos
4. **Neural Notes**: AI-focused blog with multimedia support
5. **Contact**: Multiple ways to get in touch

## Architecture
- **Frontend**: React with TypeScript
- **Routing**: React Router with lazy-loaded pages
- **Styling**: Tailwind CSS with custom design tokens
- **Content Processing**: MDX with remark plugins for enhanced markdown
- **Image Optimization**: vite-imagetools for automatic WebP conversion
- **Build Tool**: Vite with React SWC plugin
- **Deployment**: Static site deployment (Lovable)