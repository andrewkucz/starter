import { createFileRoute } from "@tanstack/react-router";
import { getUser } from "#/data/catalog";
import { FormUserPage } from "#/features/manager/form-user-page";
export const Route = createFileRoute("/manager/users/$id/update/")({ component: RouteComponent });
function RouteComponent() {
  return <FormUserPage user={getUser(Route.useParams().id)} />;
}
