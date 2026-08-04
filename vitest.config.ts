import path from "node:path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vitest/config";

// Unit-test config for this app. Two projects run in one command:
//   - "convex"   backend functions, run in the edge-runtime via convex-test
//   - "frontend" React components and logic, run in jsdom via Testing Library
//
// Keep tests hermetic: use convex-test and mocks instead of real deployments,
// network calls, or environment-dependent behavior.
export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    passWithNoTests: true,
    // Restore Vitest mocks before each test to reduce state leakage.
    restoreMocks: true,
    projects: [
      {
        extends: true,
        test: {
          environment: "edge-runtime",
        },
      },
      {
        extends: true,
        plugins: [react()],
        test: {
          name: "frontend",
          environment: "jsdom",
          include: ["src/**/*.test.{ts,tsx}"],
          setupFiles: ["./src/vitest.setup.ts"],
        },
      },
    ],
  },
});
