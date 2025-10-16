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
