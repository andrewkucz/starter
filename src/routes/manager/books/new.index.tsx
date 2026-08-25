import { createFileRoute } from "@tanstack/react-router";
import { FormBookPage } from "#/features/manager/form-book-page";
export const Route = createFileRoute("/manager/books/new/")({ component: FormBookPage });
