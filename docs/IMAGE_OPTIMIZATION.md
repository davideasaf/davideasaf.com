# Image Optimization Guide

This project uses vite-imagetools for build-time image optimization and a remark transformer to produce responsive, modern `<picture>` output from markdown.

## 🚀 How It Works

- Optimizes images at build time (smaller files, better LCP/CLS/SEO)
- Generates multiple widths and modern formats (AVIF/WebP/JPG)
- Emits `<picture>` tags with `srcset`/`sizes` so the browser picks the best variant

### Parameter precedence (who wins?)

For images in MDX/Markdown, settings resolve in this order:

1. Per‑image MDX title parameters you specify (e.g., `sizes`, `widths`, `formats`, `q`)
2. remark-image-to-mdx defaults: `widths=[320,640,960,1280]`, `formats=[avif,webp,jpg]`, `quality=82`, `sizes='100vw'`
3. Vite imagetools defaultDirectives (build defaults) only fill directives not already provided on the import. Because the MDX transformer emits explicit `w`, `format` and `quality` queries, build defaults typically apply to non‑MDX imports (manual component imports) or to any directives not set by MDX.

Note: `src/config/site.yaml` image values are legacy and not used by the MDX transformer. They only apply to legacy components that aren’t part of the current MDX flow.

## 📸 Using Images in Markdown (MDX)

Write a normal markdown image and use the title string to pass parameters:

```markdown
![AI Workflow Evolution](/src/assets/blog/ai-workflow-example.png "sizes=(min-width: 768px) 720px, 100vw; widths=400,800,1200; formats=avif,webp,jpg; q=85")
```

Supported per‑image parameters (in the title string):

- `sizes`: HTML `sizes` attribute for responsive selection
- `widths`: semicolon- or comma‑separated target widths (e.g., `400,800,1200`)
- `formats`: output formats (e.g., `avif,webp,jpg`)
- `q`: quality (1–100)

Under the hood, the remark transformer rewrites the image into an imagetools import like:

```
?w=400;800;1200&format=avif;webp;jpg&as=picture&quality=85
```

and renders it via `ResponsiveImage` → `Picture` as a `<picture>` element with multiple sources.

## 🔧 Build Defaults (vite-imagetools)

These defaults apply primarily to images imported directly in React components (non‑MDX), and only when the import lacks explicit directives:

```ts
import { imagetools } from "vite-imagetools";

export default defineConfig({
  plugins: [
    imagetools({
      defaultDirectives: (url) => {
        if (
          url.pathname.includes("/blog/") ||
          url.pathname.includes("/projects/")
        ) {
          return new URLSearchParams({
            format: "webp;jpg",
            w: "400;800;1200",
            quality: "80",
          });
        }
        return new URLSearchParams({
          format: "webp",
          quality: "85",
        });
      },
    }),
  ],
});
```

## 🧩 Using Images in React Components

### Simple (single size)

```tsx
import heroImg from "@/assets/hero.jpg?format=webp&quality=80&w=1200";

<img src={heroImg} alt="Hero image" />;
```

### Responsive `<picture>` via imagetools bundle

```tsx
import data from "@/assets/hero.jpg?w=400;800;1200&format=webp;jpg&as=picture";
import { ResponsiveImage } from "@/components/ResponsiveImage";

<ResponsiveImage
  data={data}
  alt="Hero image"
  sizes="(max-width: 768px) 100vw, 50vw"
/>;
```

## 🎯 Image Guidelines

### File Size Limits

- Max original size: ~5MB (optimization happens at build)
- Recommended dimensions by use:
  - Profile photos: 600×600
  - Hero images: 1200×800
  - Blog images: 800×600
  - Thumbnails: 400×300

### Formats

- Prefer JPEG for photos, PNG for graphics/logos
- Modern variants (AVIF/WebP) are generated automatically when requested

### SEO

- Always include descriptive alt text
- Use meaningful filenames (e.g., `ai-workflow-example.png`)

## 📈 Performance Example

- Original PNG: `ai-workflow-example.png` (~200KB)
- Optimized WebP (800w @ q=80): ~45KB (~77% reduction)

## 🧪 Commands

| Command             | Description                             |
| ------------------- | --------------------------------------- |
| `npm run dev`       | Development server with HMR             |
| `npm run build`     | Production build with full optimization |
| `npm run build:dev` | Development build                       |
| `npm run preview`   | Preview production build locally        |

## ❗ Troubleshooting

1. Images must live under `/src/assets/` for MDX processing
2. In MDX, use the title string syntax (not `{attr=value}`) for parameters
3. For component imports, ensure imagetools query params are present when you need specific sizes/formats
4. Verify `vite-imagetools` is installed and configured in `vite.config.ts`

This system provides automatic optimization while keeping authoring simple, while still allowing precise per‑image control when you need it.
