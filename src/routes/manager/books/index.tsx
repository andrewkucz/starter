import { createFileRoute } from "@tanstack/react-router";
import { getBooks } from "@/data/books/server";
import { PageManagerBooks } from "@/features/manager/page-manager-books";
export const Route = createFileRoute("/manager/books/")({
  validateSearch: (search: Record<string, unknown>): { searchTerm?: string } => ({
    searchTerm: typeof search.searchTerm === "string" ? search.searchTerm : undefined,
  }),
  loader: () => getBooks(),
  component: RouteComponent,
});
function RouteComponent() {
  return (
    <PageManagerBooks
      books={Route.useLoaderData()}
      searchTerm={Route.useSearch().searchTerm ?? ""}
    />
  );
}
