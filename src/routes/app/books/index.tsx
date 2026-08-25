import { createFileRoute } from "@tanstack/react-router";
import { PageBooks } from "#/features/books/page-books";
export const Route = createFileRoute("/app/books/")({ component: PageBooks });
