import { createFileRoute } from "@tanstack/react-router";
import { getBook } from "@/data/books/server";
import { PageBook } from "@/features/books/page-book";
export const Route = createFileRoute("/app/books/$id/")({
  loader: ({ params }) => getBook({ data: { id: params.id } }),
  component: RouteComponent,
});
function RouteComponent() {
  return <PageBook book={Route.useLoaderData()} />;
}
