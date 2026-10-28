import { roles, type RoleName } from "./permissions";

type RoleValue = string | string[] | null | undefined;
type PermissionRequest = Parameters<(typeof roles)[RoleName]["authorize"]>[0];

function parseRoles(role: RoleValue) {
  const items = Array.isArray(role) ? role : (role?.split(",") ?? []);
  return items.map((item) => item.trim()).filter(Boolean);
}

export function hasRole(role: RoleValue, expectedRole: string) {
  return parseRoles(role).some((item) => item === expectedRole);
}

function singleRoleHasPermission(role: string, permissions: PermissionRequest) {
  return roles[role as RoleName]?.authorize(permissions).success ?? false;
}

/** Whether any of a user's comma-separated roles grants the requested permissions. */
export function roleHasPermission(role: RoleValue, permissions: PermissionRequest) {
  return parseRoles(role).some((item) => singleRoleHasPermission(item, permissions));
}
