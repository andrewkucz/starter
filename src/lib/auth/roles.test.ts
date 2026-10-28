import { describe, expect, it } from "vite-plus/test";
import { hasRole, roleHasPermission } from "./roles";

describe("hasRole", () => {
  it("recognizes Better Auth comma-separated roles", () => {
    expect(hasRole("user,admin", "admin")).toBe(true);
    expect(hasRole("user", "admin")).toBe(false);
  });

  it("handles role arrays and absent roles", () => {
    expect(hasRole(["user", "admin"], "admin")).toBe(true);
    expect(hasRole(null, "admin")).toBe(false);
  });
});

describe("roleHasPermission", () => {
  it("grants user management to admins only", () => {
    expect(roleHasPermission("admin", { user: ["list"] })).toBe(true);
    expect(roleHasPermission(" user , admin", { user: ["list"] })).toBe(true);
    expect(roleHasPermission("user", { user: ["list"] })).toBe(false);
    expect(roleHasPermission(null, { user: ["list"] })).toBe(false);
    expect(roleHasPermission("unknown", { user: ["list"] })).toBe(false);
  });
});
