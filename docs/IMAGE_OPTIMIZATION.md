# Image Optimization Guide

This project uses **vite-imagetools** for modern, automated image optimization during build time to ensure fast loading times and better SEO performance.

## 🚀 How It Works

### Automatic Processing with vite-imagetools
Images are automatically optimized when referenced in markdown files or imported with query parameters:
- **WebP conversion** for modern browsers
- **Quality optimization** (default 80%)
- **Responsive sizing** for different screen sizes
- **File size reduction** (typically 60-80% smaller)

### Smart Defaults Configuration
The vite.config.ts includes smart defaults for different image types:
- **Blog images** (`/blog/`): WebP format, quality 80, width 800px
- **Project images** (`/projects/`): WebP format, quality 80, multiple sizes
- **Other images**: WebP conversion with quality 85

## 📸 How to Add New Images

### 1. In Markdown Files (Neural Notes/Projects)
Simply reference images normally in your markdown:
```markdown
![AI Workflow Diagram](/src/assets/blog/my-workflow.png)
```

The `OptimizedMarkdownImage` component automatically processes these with:
- WebP conversion (`?format=webp&quality=80&w=800`)
- Lazy loading
- Proper alt text rendering
- Responsive styling

### 2. In React Components - Manual Import
Use direct imports with vite-imagetools directives:
```tsx
import heroImg from '@/assets/hero.jpg?format=webp&quality=80&w=800'
import heroImgFallback from '@/assets/hero.jpg'

<picture>
  <source srcSet={heroImg} type="image/webp" />
  <img src={heroImgFallback} alt="Hero image" />
</picture>
```

### 3. For Multiple Responsive Sizes
```tsx
import heroSrcset from '@/assets/hero.jpg?w=400;800;1200&format=webp'

<img src={heroSrcset} alt="Hero image" />
```

## 🎯 Image Guidelines

### File Size Limits
- **Max original size**: 5MB per image (vite-imagetools handles optimization)
- **Recommended dimensions**: Based on usage:
  - Profile photos: 600x600px
  - Hero images: 1200x800px
  - Blog images: 800x600px
  - Thumbnails: 400x300px

### File Formats
- **Preferred**: JPEG for photos, PNG for graphics/logos
- **Automatic**: WebP versions generated via query parameters
- **Avoid**: Extremely large uncompressed files

### SEO Best Practices
- **Always include descriptive alt text** in markdown
- **Include relevant keywords in alt text**
- **Use consistent naming convention**: `descriptive-name.jpg`

## 🛠️ Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server with hot reload |
| `npm run build` | Production build with full optimization |
| `npm run build:dev` | Development build with faster compilation |
| `npm run preview` | Preview production build locally |

## 📈 Performance Benefits

### Real Example from This Project
- **Original PNG**: `ai-workflow-example.png` (~200KB)
- **Optimized WebP**: `ai-workflow-example.png?format=webp&quality=80&w=800` (~45KB)
- **Savings**: ~77% file size reduction

### Browser Support
- **WebP**: Modern browsers (95%+ support)
- **Fallback**: Automatic fallback to original format for older browsers
- **Lazy loading**: Applied to all markdown images

## 🔧 Technical Implementation

### Vite Configuration
```typescript
import { imagetools } from "vite-imagetools";

export default defineConfig({
  plugins: [
    imagetools({
      defaultDirectives: (url) => {
        if (url.pathname.includes('/blog/') || url.pathname.includes('/projects/')) {
          return new URLSearchParams({
            format: 'webp',
            quality: '80',
            w: '800'
          });
        }
        return new URLSearchParams({
          format: 'webp',
          quality: '85'
        });
      }
    })
  ]
});
```

### Markdown Image Processing
The `OptimizedMarkdownImage` component in `NeuralNotes.tsx` automatically adds optimization parameters:
```tsx
const OptimizedMarkdownImage = ({ src, alt }) => {
  if (src?.startsWith('/src/assets/')) {
    imageSrc = src + '?format=webp&quality=80&w=800';
  }
  return <img src={imageSrc} alt={alt} loading="lazy" />;
};
```

## 🎨 Example Usage

### In Neural Notes Markdown
```markdown
---
title: "My AI Journey"
---

# My AI Journey

Here's my workflow diagram:
![AI Workflow Evolution](/src/assets/blog/ai-workflow-example.png)
```

### In React Components
```tsx
// For a hero image
import heroImg from '@/assets/hero.jpg?format=webp&quality=80&w=1200'

<img src={heroImg} alt="AI Engineer workspace" />
```

### For Responsive Images
```tsx
// Multiple sizes for different breakpoints
import projectImg from '@/assets/project.jpg?w=400;800;1200&format=webp'

<img 
  src={projectImg} 
  alt="Project screenshot"
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

## 🔧 Troubleshooting

### Images Not Optimizing
1. Check that images are in `src/assets/` directory
2. Ensure markdown images use the `/src/assets/` prefix
3. Verify vite-imagetools is installed and configured

### Build Issues
1. Check image file formats are supported (jpg, png, webp)
2. Ensure images exist at the specified paths
3. Check vite.config.ts has imagetools plugin configured

### Images Not Loading
1. Verify file paths are correct in markdown
2. Check that alt text is included
3. Ensure images are referenced with `/src/assets/` prefix

This system provides automatic optimization while maintaining simplicity for content creators! 🎉