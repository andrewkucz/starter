import { createFileRoute } from "@tanstack/react-router";
import { getBooks } from "@/data/books/server";
import { PageBooks } from "@/features/books/page-books";
export const Route = createFileRoute("/app/books/")({
  loader: () => getBooks(),
  component: RouteComponent,
});

function RouteComponent() {
  return <PageBooks books={Route.useLoaderData()} />;
}
