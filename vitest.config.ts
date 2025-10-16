import path from "node:path";
import mdx from "@mdx-js/rollup";
import react from "@vitejs/plugin-react-swc";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { defineConfig } from "vitest/config";
import remarkImageToMdx from "./tools/remark-image-to-mdx.js";

export default defineConfig({
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
  ],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "json-summary", "html", "lcov"],
      exclude: [
        "node_modules/**",
        "src/test/**",
        "**/*.d.ts",
        "**/*.config.*",
        "**/mockData/**",
        "dist/**",
        ".{idea,git,cache,output,temp}/**",
        // Exclude build tools and configs
        "tools/**",
        "vite.config.ts",
        "tailwind.config.js",
        "postcss.config.js",
        // Exclude simple UI components initially (focus on logic)
        "src/components/ui/**",
      ],
      // Note: Thresholds will be added gradually as test coverage increases
      // Target 70-80% coverage for critical paths (per issue #38 requirements)
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
