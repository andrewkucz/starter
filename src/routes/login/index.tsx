import { createFileRoute } from "@tanstack/react-router";
import { PageLogin } from "#/features/auth/page-login";
export const Route = createFileRoute("/login/")({ component: PageLogin });
