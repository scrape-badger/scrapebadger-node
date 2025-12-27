import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/twitter/index.ts"],
  format: ["cjs", "esm"],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: false,
  outExtension(ctx) {
    const format = ctx.format;
    return {
      js: format === "cjs" ? ".js" : ".mjs",
      dts: format === "cjs" ? ".d.ts" : ".d.mts",
    };
  },
});
