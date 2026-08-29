import { createFileRoute } from "@tanstack/react-router";
import { getGenres } from "@/data/genres/server";
import { FormBookPage } from "@/features/manager/form-book-page";
export const Route = createFileRoute("/manager/books/new/")({
  loader: () => getGenres(),
  component: RouteComponent,
});

function RouteComponent() {
  return <FormBookPage genres={Route.useLoaderData()} />;
}
