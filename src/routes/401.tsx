import { createFileRoute } from "@tanstack/react-router";
import { UnauthorisedError } from "@/features/errors/pages/unauthorized-error-page";

export const Route = createFileRoute("/401")({ component: UnauthorisedError });
