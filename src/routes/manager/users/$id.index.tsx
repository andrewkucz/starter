import { createFileRoute } from "@tanstack/react-router";
import { getUser } from "@/data/users/server";
import { PageManagerUser } from "@/features/manager/page-manager-user";
export const Route = createFileRoute("/manager/users/$id/")({
  loader: ({ params }) => getUser({ data: { id: params.id } }),
  component: RouteComponent,
});
function RouteComponent() {
  return <PageManagerUser user={Route.useLoaderData()} />;
}
