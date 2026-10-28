import { defineConfig, lazyPlugins } from "vite-plus";
import { devtools } from "@tanstack/devtools-vite";

import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";

import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { varlockVitePlugin } from "@varlock/vite-integration";

export default defineConfig({
  defaultPackage: ".",
  server: {
    strictPort: true,
    port: 3000,
  },
  staged: {
    "*": "vp check --fix",
  },
  fmt: {
    ignorePatterns: ["src/routeTree.gen.ts", "**/env.d.ts"],
  },
  lint: {
    jsPlugins: [
      { name: "vite-plus", specifier: "vite-plus/oxlint-plugin" },
      { name: "starter-custom-rules", specifier: "./tooling/lint/index.js" },
    ],
    rules: {
      "vite-plus/prefer-vite-plus-imports": "error",
      "starter-custom-rules/destructure-query-result": "error",
    },
    options: { typeAware: true, typeCheck: true },
  },
  test: {
    include: ["src/**/*.test.{ts,tsx}", "tooling/**/*.test.js"],
  },
  resolve: { tsconfigPaths: true },
  plugins: lazyPlugins(async () => {
    return [
      // Default `init-only` SSR injection: the production server is started via `varlock run`
      // (see the `start` script and Dockerfile), which resolves env before any SSR chunk evaluates.
      varlockVitePlugin(),
      devtools(),
      tailwindcss(),
      tanstackStart(),
      // Nitro's dev server is unnecessary during Vitest and changes module loading.
      !process.env.VITEST && nitro({ preset: "node-server" }),
      viteReact(),
    ];
  }),
});
