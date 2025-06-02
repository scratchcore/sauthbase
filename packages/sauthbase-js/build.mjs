import { build } from "esbuild";

// --- JavaScript build (esbuild) ---

// ESM
await build({
  entryPoints: ["src/**/*.ts"],
  outdir: "dist/esm",
  bundle: false,
  format: "esm",
  target: "es2020",
  sourcemap: false,
});

// CJS
await build({
  entryPoints: ["src/**/*.ts"],
  outdir: "dist/cjs",
  bundle: false,
  format: "cjs",
  target: "es2020",
  sourcemap: false,
});