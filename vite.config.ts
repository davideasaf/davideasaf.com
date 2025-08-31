import path from "node:path";
import mdx from "@mdx-js/rollup";
import react from "@vitejs/plugin-react-swc";
import { componentTagger } from "lovable-tagger";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { defineConfig } from "vite";
import { imagetools } from "vite-imagetools";
import remarkImageToMdx from "./tools/remark-image-to-mdx.js";

// Use the new remark transformer for optimized image handling

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    // MDX plugin for processing markdown files - must come before react plugin
    mdx({
      remarkPlugins: [
        remarkGfm,
        remarkImageToMdx,
        remarkFrontmatter,
        // Export YAML frontmatter as `export const frontmatter = {...}`
        [remarkMdxFrontmatter, { name: "frontmatter" }],
      ],
      providerImportSource: "@mdx-js/react",
    }),
    react(),
    mode === "development" && componentTagger(),
    // Modern image optimization with vite-imagetools
    imagetools({
      defaultDirectives: (url) => {
        // Smart defaults for blog and content images
        if (url.pathname.includes("/blog/") || url.pathname.includes("/projects/")) {
          return new URLSearchParams({
            format: "webp;jpg",
            w: "400;800;1200",
            quality: "80",
          });
        }
        // For other images, provide basic optimization
        return new URLSearchParams({
          format: "webp",
          quality: "85",
        });
      },
    }),
  ].filter(Boolean),
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          utils: ["clsx", "tailwind-merge", "js-yaml"],
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Treat plain markdown as assets; MDX is handled by the MDX plugin above
  assetsInclude: ["**/*.md"],
}));
