import path from "node:path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
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
      // Target 70-80% coverage for critical paths (per issue requirements)
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 70,
        statements: 70,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
