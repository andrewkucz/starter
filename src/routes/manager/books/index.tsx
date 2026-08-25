import { createFileRoute } from "@tanstack/react-router";
import { PageManagerBooks } from "#/features/manager/page-manager-books";
export const Route = createFileRoute("/manager/books/")({
  validateSearch: (search: Record<string, unknown>): { searchTerm?: string } => ({
    searchTerm: typeof search.searchTerm === "string" ? search.searchTerm : undefined,
  }),
  component: RouteComponent,
});
function RouteComponent() {
  return <PageManagerBooks searchTerm={Route.useSearch().searchTerm ?? ""} />;
}
