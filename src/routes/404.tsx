import { createFileRoute } from "@tanstack/react-router";
import { NotFoundError } from "@/features/errors/pages/not-found-error-page";
export const Route = createFileRoute("/404")({ component: NotFoundError });
