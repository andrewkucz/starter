import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";
import { AdminUsersPage } from "@/features/users/pages/admin-users-page";
import { hasRole } from "@/lib/auth/roles";

export const Route = createFileRoute("/_authenticated/admin/users")({
  validateSearch: z.object({
    page: z.number().int().min(1).default(1).catch(1),
  }),
  beforeLoad: ({ context }) => {
    if (!hasRole(context.session.user.role, "admin")) {
      throw redirect({ to: "/403" });
    }
  },
  component: AdminUsersPage,
});
