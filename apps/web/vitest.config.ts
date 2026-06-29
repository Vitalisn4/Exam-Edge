import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
      "@examedge/shared": path.resolve(__dirname, "../../packages/shared/src/index.ts"),
      "@examedge/db": path.resolve(__dirname, "../../packages/db/src/index.ts"),
      "@examedge/ai": path.resolve(__dirname, "../../packages/ai/src/index.ts"),
    },
  },
});
