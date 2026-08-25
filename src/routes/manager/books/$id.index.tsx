import { createFileRoute } from "@tanstack/react-router";
import { PageManagerBook } from "#/features/manager/page-manager-book";
export const Route = createFileRoute("/manager/books/$id/")({ component: RouteComponent });
function RouteComponent() {
  return <PageManagerBook id={Route.useParams().id} />;
}
