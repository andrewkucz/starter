import { createFileRoute } from "@tanstack/react-router";
import { getUser } from "@/data/users/server";
import { FormUserPage } from "@/features/manager/form-user-page";
export const Route = createFileRoute("/manager/users/$id/update/")({
  loader: ({ params }) => getUser({ data: { id: params.id } }),
  component: RouteComponent,
});
function RouteComponent() {
  return <FormUserPage user={Route.useLoaderData()} />;
}
