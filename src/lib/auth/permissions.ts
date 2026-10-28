import { createAccessControl } from "better-auth/plugins/access";
import { adminAc, defaultStatements, userAc } from "better-auth/plugins/admin/access";

const statement = {
  ...defaultStatements,
} as const;

export const ac = createAccessControl(statement);

export const roles = {
  user: ac.newRole({ ...userAc.statements }),
  admin: ac.newRole({ ...adminAc.statements }),
};

export type RoleName = keyof typeof roles;
