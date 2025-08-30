import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { imagetools } from "vite-imagetools";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
    // Modern image optimization with vite-imagetools
    imagetools({
      defaultDirectives: (url) => {
        // Smart defaults for blog and content images
        if (url.pathname.includes('/blog/') || url.pathname.includes('/projects/')) {
          return new URLSearchParams({
            format: 'webp;jpg',
            w: '400;800;1200',
            quality: '80'
          });
        }
        // For other images, provide basic optimization
        return new URLSearchParams({
          format: 'webp',
          quality: '85'
        });
      }
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Support for importing markdown files
  assetsInclude: ['**/*.md'],
}));
