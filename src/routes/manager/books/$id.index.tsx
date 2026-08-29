import { createFileRoute } from "@tanstack/react-router";
import { getBook } from "@/data/books/server";
import { PageManagerBook } from "@/features/manager/page-manager-book";
export const Route = createFileRoute("/manager/books/$id/")({
  loader: ({ params }) => getBook({ data: { id: params.id } }),
  component: RouteComponent,
});
function RouteComponent() {
  return <PageManagerBook book={Route.useLoaderData()} />;
}
