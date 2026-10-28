import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { SignIn } from "@/features/auth/pages/sign-in-page";

export const Route = createFileRoute("/_app/_auth/sign-in")({
  validateSearch: z.object({ redirect: z.string().optional() }),
  component: SignIn,
});
