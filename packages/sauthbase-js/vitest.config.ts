import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    passWithNoTests: true,
    coverage: {
      reporter: ["text", "lcov", "html"], // ← lcov が重要
      include: ["src"], // <- 対象ファイル
      exclude: ["**/test/**", "**/*.test.ts"], // 必要に応じて調整
      reportsDirectory: "./coverage",
    },
  },
});
