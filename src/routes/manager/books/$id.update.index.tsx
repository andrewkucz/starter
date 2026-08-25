import { createFileRoute } from "@tanstack/react-router";
import { getBook } from "#/data/catalog";
import { FormBookPage } from "#/features/manager/form-book-page";
export const Route = createFileRoute("/manager/books/$id/update/")({ component: RouteComponent });
function RouteComponent() {
  return <FormBookPage book={getBook(Route.useParams().id)} />;
}
