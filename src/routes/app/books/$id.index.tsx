import { createFileRoute } from "@tanstack/react-router";
import { PageBook } from "#/features/books/page-book";
export const Route = createFileRoute("/app/books/$id/")({ component: RouteComponent });
function RouteComponent() {
  return <PageBook id={Route.useParams().id} />;
}
