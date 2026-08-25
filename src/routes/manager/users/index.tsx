import { createFileRoute } from "@tanstack/react-router";
import { PageManagerUsers } from "#/features/manager/page-manager-users";
export const Route = createFileRoute("/manager/users/")({
  validateSearch: (search: Record<string, unknown>): { searchTerm?: string } => ({
    searchTerm: typeof search.searchTerm === "string" ? search.searchTerm : undefined,
  }),
  component: RouteComponent,
});
function RouteComponent() {
  return <PageManagerUsers searchTerm={Route.useSearch().searchTerm ?? ""} />;
}
