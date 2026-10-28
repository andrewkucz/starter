import { createFileRoute } from "@tanstack/react-router";
import { ForbiddenError } from "@/features/errors/pages/forbidden-error-page";
export const Route = createFileRoute("/403")({ component: ForbiddenError });
