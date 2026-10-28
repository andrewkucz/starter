// @vitest-environment happy-dom
import { expect, it, vi } from "vite-plus/test";
import { getQueryClient } from "./client";
import { AppError } from "@/lib/server/app-error";

it.each([
  { status: 403, code: "SESSION_NOT_FRESH" },
  { status: 403, error: { code: "SESSION_NOT_FRESH" } },
  { status: 401 },
  { status: 400 },
  { status: 403 },
  { status: 404 },
  { code: "UNAUTHORIZED" },
  { status: 401, error: { code: "UNAUTHORIZED" } },
  new AppError({ code: "UNAUTHORIZED", message: "Sign in to continue." }),
])("does not retry a non-retryable error: %j", async (error) => {
  const client = getQueryClient();
  const queryFn = vi.fn().mockRejectedValue(error);

  try {
    await expect(
      client.fetchQuery({ queryKey: ["auth", "test"], queryFn, retryDelay: 0 }),
    ).rejects.toEqual(error);
    expect(queryFn).toHaveBeenCalledTimes(1);
  } finally {
    client.clear();
  }
});

it.each([undefined, 408, 429, 500, 502, 503, 504])(
  "retries transient failures with status %j three times",
  async (status) => {
    const client = getQueryClient();
    const error = Object.assign(new Error("Temporary failure"), { status });
    const queryFn = vi.fn().mockRejectedValue(error);

    try {
      await expect(
        client.fetchQuery({ queryKey: ["auth", "test"], queryFn, retryDelay: 0 }),
      ).rejects.toThrow("Temporary failure");
      expect(queryFn).toHaveBeenCalledTimes(4);
    } finally {
      client.clear();
    }
  },
);
