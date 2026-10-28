import { createQueryKeys } from "@lukemorales/query-key-factory";
import { mutationOptions, useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth/browser";
import type { RoleName } from "@/lib/auth/permissions";
import type { auth } from "@/lib/auth/server-client";
import { getUserAccounts } from "./functions";

// The admin endpoints return every user field, but the client only types the admin plugin's.
type AdminUser = typeof auth.$Infer.Session.user;

export const USERS_PAGE_SIZE = 25;

export const adminUserQueries = createQueryKeys("adminUsers", {
  list: (page: number) => ({
    queryKey: [page],
    queryFn: async () => {
      const { data, error } = await authClient.admin.listUsers({
        query: {
          limit: USERS_PAGE_SIZE,
          offset: (page - 1) * USERS_PAGE_SIZE,
          sortBy: "createdAt",
          sortDirection: "desc",
        },
      });

      if (error) throw new Error(error.message ?? "Unable to load users.");

      // SAFETY: the admin endpoints return full user records (see `AdminUser`).
      return { ...data, users: data.users as AdminUser[] };
    },
  }),
  detail: (userId: string) => ({
    queryKey: [userId],
    queryFn: async () => {
      const [userResult, sessionsResult] = await Promise.all([
        authClient.admin.getUser({ query: { id: userId } }),
        authClient.admin.listUserSessions({ userId }),
      ]);

      if (userResult.error) throw new Error(userResult.error.message ?? "Unable to load user.");

      if (sessionsResult.error) {
        throw new Error(sessionsResult.error.message ?? "Unable to load sessions.");
      }

      const sessions = sessionsResult.data.sessions.sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );

      // SAFETY: the admin endpoints return full user records (see `AdminUser`).
      return { user: userResult.data as AdminUser, sessions };
    },
  }),
  accounts: (userId: string) => ({
    queryKey: [userId],
    queryFn: () => getUserAccounts({ data: { userId } }),
  }),
});

export function useAdminUserMutations() {
  const queryClient = useQueryClient();

  return {
    setRoles: mutationOptions({
      mutationKey: [...adminUserQueries._def, "setRoles"],
      mutationFn: async ({ userId, roles }: { userId: string; roles: RoleName[] }) => {
        const { data, error } = await authClient.admin.setRole({ userId, role: roles });

        if (error) throw new Error(error.message ?? "Unable to update roles.");

        return data;
      },
      onSettled: () => queryClient.invalidateQueries({ queryKey: adminUserQueries._def }),
    }),
  };
}
