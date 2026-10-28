import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { AuthErrorPage } from "@/features/auth/pages/auth-error-page";

export const Route = createFileRoute("/_app/_auth/auth-error")({
  validateSearch: z.object({
    error: z.string().optional(),
    error_description: z.string().optional(),
  }),
  component: AuthErrorPage,
});
