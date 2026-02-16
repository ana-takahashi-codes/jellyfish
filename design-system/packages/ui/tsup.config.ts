import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entryPoints: ["src/button.tsx", "src/components/icon/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  external: ["react"],
  ...options,
}));
