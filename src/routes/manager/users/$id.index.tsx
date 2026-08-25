import { createFileRoute } from "@tanstack/react-router";
import { PageManagerUser } from "#/features/manager/page-manager-user";
export const Route = createFileRoute("/manager/users/$id/")({ component: RouteComponent });
function RouteComponent() {
  return <PageManagerUser id={Route.useParams().id} />;
}
