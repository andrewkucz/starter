import { createFileRoute } from "@tanstack/react-router";
import { getBook } from "@/data/books/server";
import { getGenres } from "@/data/genres/server";
import { FormBookPage } from "@/features/manager/form-book-page";
export const Route = createFileRoute("/manager/books/$id/update/")({
  loader: async ({ params }) => {
    const [book, genres] = await Promise.all([getBook({ data: { id: params.id } }), getGenres()]);
    return { book, genres };
  },
  component: RouteComponent,
});
function RouteComponent() {
  return <FormBookPage {...Route.useLoaderData()} />;
}
