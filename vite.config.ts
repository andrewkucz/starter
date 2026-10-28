import { readFileSync } from "node:fs";

import { defineConfig, lazyPlugins } from "vite-plus";
import { devtools } from "@tanstack/devtools-vite";

import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { nitro } from "nitro/vite";

import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Release tags are cut from package.json by `bumpp`, so its version matches the latest tag
// (and `.git` is not available inside the Docker build).
const { version: appVersion } = JSON.parse(readFileSync("package.json", "utf8")) as {
  version: string;
};

export default defineConfig({
  defaultPackage: ".",
  define: {
    "import.meta.env.VITE_APP_VERSION": JSON.stringify(appVersion),
  },
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
    // Dynamic import: the varlock plugin resolves env (incl. Infisical) as soon as its module is
    // imported, so a static import would do that for metadata-only commands (lint, fmt, staged).
    const { varlockVitePlugin } = await import("@varlock/vite-integration");
    return [
      // `init-only`: the production server is started via `varlock run` (see the `start` script),
      // which resolves env before any SSR chunk evaluates.
      varlockVitePlugin({ ssrInjectMode: "init-only" }),
      devtools(),
      tailwindcss(),
      tanstackStart(),
      // Nitro's dev server is unnecessary during Vitest and changes module loading.
      !process.env.VITEST && nitro({ preset: "node-server" }),
      viteReact(),
    ];
  }),
});
