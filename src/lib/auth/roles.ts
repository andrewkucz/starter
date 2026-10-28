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

function isRoleName(role: string): role is RoleName {
  return Object.hasOwn(roles, role);
}

function singleRoleHasPermission(role: string, permissions: PermissionRequest) {
  return isRoleName(role) && roles[role].authorize(permissions).success;
}

/** Whether any of a user's comma-separated roles grants the requested permissions. */
export function roleHasPermission(role: RoleValue, permissions: PermissionRequest) {
  return parseRoles(role).some((item) => singleRoleHasPermission(item, permissions));
}
