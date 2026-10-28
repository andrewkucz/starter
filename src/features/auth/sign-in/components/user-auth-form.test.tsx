// @vitest-environment happy-dom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { QueryClient, QueryClientProvider, queryOptions } from "@tanstack/react-query";
import { afterEach, beforeEach, expect, it, vi } from "vite-plus/test";
const mocks = vi.hoisted(() => ({
  providers: vi.fn(),
  signIn: vi.fn(),
  link: vi.fn(),
}));
vi.mock("@/lib/auth/providers", () => ({
  authProvidersQuery: queryOptions({ queryKey: ["auth", "providers"], queryFn: mocks.providers }),
}));
vi.mock("@/lib/auth/browser", () => ({ authClient: {} }));
vi.mock("@better-auth-ui/react", () => ({
  providerIcons: {},
  useSignInSocial: () => ({ mutate: mocks.signIn, isPending: false }),
  useListAccounts: () => ({ data: [], isPending: false }),
  useAccountInfo: () => ({ data: null, isPending: false }),
  useLinkSocial: () => ({ mutate: mocks.link, isPending: false }),
  useUnlinkAccount: () => ({ mutate: vi.fn(), isPending: false }),
}));
import { UserAuthForm } from "./user-auth-form";
import { LinkedAccounts } from "@/features/settings/account/linked-accounts";
let root: Root;
let container: HTMLDivElement;
let client: QueryClient;
beforeEach(() => {
  vi.clearAllMocks();
  Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
  client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
});
afterEach(async () => {
  await act(async () => root.unmount());
  client.clear();
  container.remove();
});
async function render(element: React.ReactNode) {
  await act(async () =>
    root.render(<QueryClientProvider client={client}>{element}</QueryClientProvider>),
  );
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 20));
  });
}
it("offers Google login and preserves the requested post-login destination", async () => {
  mocks.providers.mockResolvedValue([
    { id: "google", displayName: "Google" },
    { id: "discord", displayName: "Discord" },
  ]);
  await render(<UserAuthForm redirectTo="/tasks" />);
  const google = [...container.querySelectorAll("button")].find(
    (b) => b.textContent === "Continue with Google",
  )!;
  expect(google).toBeDefined();
  await act(async () => google.click());
  expect(mocks.signIn).toHaveBeenCalledWith({ provider: "google", callbackURL: "/tasks" });
});
it("does not offer an unconfigured Google provider", async () => {
  mocks.providers.mockResolvedValue([{ id: "discord", displayName: "Discord" }]);
  await render(<UserAuthForm />);
  expect(container.textContent).not.toContain("Google");
  expect(container.textContent).toContain("Continue with Discord");
});
it("renders nothing when no social providers are configured", async () => {
  mocks.providers.mockResolvedValue([]);
  await render(<UserAuthForm />);
  expect(container.innerHTML).toBe("");
});
it("lets existing users link Google and returns them to Account settings", async () => {
  mocks.providers.mockResolvedValue([{ id: "google", displayName: "Google" }]);
  await render(<LinkedAccounts />);
  const link = container.querySelector<HTMLButtonElement>(
    'button[aria-label="Link Google account"]',
  )!;
  expect(link).not.toBeNull();
  await act(async () => link.click());
  expect(mocks.link).toHaveBeenCalledWith({ provider: "google", callbackURL: "/account" });
});
