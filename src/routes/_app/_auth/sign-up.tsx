import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { SignUp } from "@/features/auth/pages/sign-up-page";

export const Route = createFileRoute("/_app/_auth/sign-up")({
  validateSearch: z.object({ redirect: z.string().optional() }),
  component: SignUp,
});
