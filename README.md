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
- **Image Optimization**: Automatic WebP conversion and responsive sizing
- **Deployment**: Lovable (or any static host)

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