import { renderToStaticMarkup } from "react-dom/server";
import { expect, it, vi } from "vite-plus/test";
import { ActiveSessions } from "./active-sessions";

const { useListSessions } = vi.hoisted(() => ({ useListSessions: vi.fn() }));
vi.mock("@better-auth-ui/react", () => ({
  useListSessions,
  useSession: () => ({ data: null }),
  useSignOut: () => ({ mutate: vi.fn(), isPending: false }),
}));
vi.mock("@/lib/auth/browser", () => ({ authClient: {} }));
vi.mock("@tanstack/react-router", () => ({ useNavigate: () => vi.fn() }));
vi.mock("./active-session", () => ({ ActiveSession: () => <div>Session device</div> }));

it.each([undefined, null, []])("shows an empty state for settled data %j", (data) => {
  useListSessions.mockReturnValue({ data, isPending: false, isError: false });
  expect(renderToStaticMarkup(<ActiveSessions />)).toContain("No active sessions");
});

it("shows loading feedback while the request is pending", () => {
  useListSessions.mockReturnValue({ isPending: true });
  const html = renderToStaticMarkup(<ActiveSessions />);
  expect(html).toContain('data-slot="skeleton"');
  expect(html).not.toContain("No active sessions");
});

it("shows a retry action when the request fails without data", () => {
  useListSessions.mockReturnValue({ isPending: false, isError: true });
  const html = renderToStaticMarkup(<ActiveSessions />);
  expect(html).toContain("Unable to load sessions");
  expect(html).toContain("Try again");
  expect(html).not.toContain("No active sessions");
});

it("renders available sessions", () => {
  useListSessions.mockReturnValue({ data: [{ id: "session-1" }], isPending: false });
  const html = renderToStaticMarkup(<ActiveSessions />);
  expect(html).toContain("Session device");
  expect(html).not.toContain("No active sessions");
});

it.each([{ code: "SESSION_NOT_FRESH" }, { error: { code: "SESSION_NOT_FRESH" } }])(
  "asks for sign-in when the session is not fresh: %j",
  (error) => {
    useListSessions.mockReturnValue({
      data: [{ id: "cached-session" }],
      isPending: false,
      isError: true,
      error,
    });
    const html = renderToStaticMarkup(<ActiveSessions />);
    expect(html).toContain("Sign in again to manage your sessions");
    expect(html).toContain(">Sign in again</button>");
    expect(html).not.toContain("Try again");
    expect(html).not.toContain("Session device");
  },
);

it("keeps the generic retry state for other forbidden errors", () => {
  useListSessions.mockReturnValue({
    isPending: false,
    isError: true,
    error: { status: 403, error: { code: "INVALID_ORIGIN" } },
  });
  const html = renderToStaticMarkup(<ActiveSessions />);
  expect(html).toContain("Unable to load sessions");
  expect(html).toContain("Try again");
  expect(html).not.toContain("Sign in again");
});
