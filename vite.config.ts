import { defineConfig, lazyPlugins } from "vite-plus";
import { devtools } from "@tanstack/devtools-vite";

import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";

import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { varlockVitePlugin } from "@varlock/vite-integration";
import akstackLint from "akstack/lint";

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
    ...akstackLint,
  },
  test: {
    include: ["src/**/*.test.{ts,tsx}", "tooling/**/*.test.js"],
  },
  resolve: { tsconfigPaths: true },
  plugins: lazyPlugins(async () => {
    return [
      // Bake the resolved env into the SSR build (encrypted in production, see `@encryptInjectedEnv`),
      // so the server boots with plain `node` and no varlock CLI or secret provider access.
      varlockVitePlugin({ ssrInjectMode: "resolved-env" }),
      devtools(),
      tailwindcss(),
      tanstackStart(),
      // Nitro's dev server is unnecessary during Vitest and changes module loading.
      !process.env.VITEST && nitro({ preset: "node-server" }),
      viteReact(),
    ];
  }),
});
