import { defineConfig } from "tsup";

export default defineConfig((options) => ({
  entry: {
    "variants": "src/variants.ts",
    "tokens": "src/tokens.ts",
    "theme/index": "src/theme/index.ts",
    "components/icon/index": "src/components/icon/index.ts",
    "control": "src/components/utils/control/index.ts",
    "button": "src/components/button/index.ts",
    "logo": "src/components/logo/index.ts",
    "text-field": "src/components/text-field/index.ts",
    "text-area": "src/components/text-area/index.ts",
    "components/spinner/index": "src/components/spinner/index.ts",
    "float": "src/components/float/index.ts",
    "circle": "src/components/utils/circle/index.ts",
    "close-button": "src/components/close-button/index.ts",
    "avatar": "src/components/avatar/index.ts",
    "mode-switch": "src/components/mode-switch/index.ts"
  },
  format: ["cjs", "esm"],
  dts: true,
  external: ["react"],
  ...options,
}));
