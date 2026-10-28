import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { expect, test } from "vite-plus/test";

const valid = [
  "const { data } = useQuery(options);",
  "const { data: collection, isPending: loading } = useQuery(options);",
  "const { mutate: save, isPending: saving } = useMutation(options);",
  "const { data } = ReactQuery.useQuery(options);",
  'import { useQuery as query } from "@tanstack/react-query"; const { data } = query(options);',
  "const client = useQueryClient();",
  "const results = useQueries(options);",
  "let data; ({ data } = useQuery(options));",
  'import { useQuery as query } from "@tanstack/react-query"; function other(query) { const value = query(); return value; }',
];

const invalid = [
  "const result = useQuery(options);",
  "const result = useMutation(options);",
  "let result = useQuery(options);",
  "const result = ReactQuery.useQuery(options);",
  'const result = ReactQuery["useMutation"](options);',
  'import { useQuery as query } from "@tanstack/react-query"; const result = query(options);',
  'import { useMutation as mutation } from "@tanstack/react-query"; const result = mutation(options);',
  "const result = useQuery(options) as unknown;",
  "const result = useQuery(options) satisfies unknown;",
  "const result = useQuery(options)!;",
  "let result; result = useMutation(options);",
  "const [result] = useQuery(options);",
];

test("vp check enforces hook destructuring, including aliases and TypeScript wrappers", () => {
  const root = fileURLToPath(new URL("../../", import.meta.url));
  // Keep temporary fixtures outside the repository so Git never sees them.
  const directory = mkdtempSync(join(tmpdir(), "starter-lint-fixtures-"));
  try {
    for (const { kind, cases } of [
      { kind: "valid", cases: valid },
      { kind: "invalid", cases: invalid },
    ]) {
      const paths = cases.map((code, index) => {
        const path = join(directory, `${kind}-${index}.ts`);
        // Fixtures exercise syntax only; application types are checked separately.
        writeFileSync(path, "// @ts-nocheck\nexport {};\n" + code);
        return path;
      });
      const result = spawnSync("vp", ["check", "--no-fmt", ...paths], {
        cwd: root,
        encoding: "utf8",
      });
      const output = result.stdout + result.stderr;
      expect(result.error).toBeUndefined();
      expect(result.status, output).toBe(kind === "valid" ? 0 : 1);
      expect(output.match(/Destructure the use(?:Query|Mutation) result/g) ?? []).toHaveLength(
        kind === "valid" ? 0 : invalid.length,
      );
      if (kind === "invalid") {
        for (let index = 0; index < invalid.length; index++) {
          expect(output).toContain(`invalid-${index}.ts`);
        }
      }
    }
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}, 30_000);
