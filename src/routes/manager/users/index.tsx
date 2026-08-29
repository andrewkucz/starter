import { createFileRoute } from "@tanstack/react-router";
import { getUsers } from "@/data/users/server";
import { PageManagerUsers } from "@/features/manager/page-manager-users";
export const Route = createFileRoute("/manager/users/")({
  validateSearch: (search: Record<string, unknown>): { searchTerm?: string } => ({
    searchTerm: typeof search.searchTerm === "string" ? search.searchTerm : undefined,
  }),
  loader: () => getUsers(),
  component: RouteComponent,
});
function RouteComponent() {
  return (
    <PageManagerUsers
      users={Route.useLoaderData()}
      searchTerm={Route.useSearch().searchTerm ?? ""}
    />
  );
}
