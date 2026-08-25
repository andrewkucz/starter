import { createFileRoute } from "@tanstack/react-router";
import { PageHome } from "#/features/home/page-home";
export const Route = createFileRoute("/app/")({ component: PageHome });
