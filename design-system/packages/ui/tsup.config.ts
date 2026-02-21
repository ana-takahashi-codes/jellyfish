import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entry: {
    "variants": "src/variants.ts",
    "tokens": "src/tokens.ts",
    "theme/index": "src/theme/index.ts",
    "components/icon/index": "src/components/icon/index.ts",
    "control": "src/components/utils/control/index.ts"
  },
  format: ["cjs", "esm"],
  dts: true,
  external: ["react"],
  ...options,
}));
