import { Link, useNavigate } from "@tanstack/react-router";
import { PlusIcon, SearchIcon } from "lucide-react";

import { Page, PageContent, PageHeader, PageTitle } from "@/components/layout/page-layout";
import { buttonVariants } from "@/components/ui/button";
import { DataList, DataListCell, DataListRow } from "@/components/ui/data-list";
import { Input } from "@/components/ui/form-controls";
import type { Book } from "@/data/books/types";
import { BookCover } from "@/features/books/book-cover";
import { cn } from "@/lib/utils";

export function PageManagerBooks({
  books,
  searchTerm = "",
}: {
  books: Array<Book>;
  searchTerm?: string;
}) {
  const navigate = useNavigate();
  const items = books.filter((book) =>
    `${book.title} ${book.author} ${book.publisher}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );
  return (
    <Page>
      <PageHeader
        actions={
          <Link
            to="/manager/books/new"
            className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "no-underline")}
          >
            <PlusIcon />
            New book
          </Link>
        }
      >
        <div className="flex items-center gap-4">
          <PageTitle>Books</PageTitle>
          <label className="relative hidden w-full max-w-xs md:block">
            <span className="sr-only">Search books</span>
            <SearchIcon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="h-8 pl-9"
              type="search"
              value={searchTerm}
              onChange={(event) =>
                void navigate({
                  to: "/manager/books",
                  search: { searchTerm: event.target.value },
                  replace: true,
                })
              }
              placeholder="Search books…"
            />
          </label>
        </div>
      </PageHeader>
      <PageContent width="wide" className="py-6">
        <DataList>
          {items.length ? (
            items.map((book) => (
              <DataListRow key={book.id}>
                <DataListCell className="flex-none">
                  <BookCover book={book} tiny />
                </DataListCell>
                <DataListCell>
                  <Link
                    to="/manager/books/$id"
                    params={{ id: book.id }}
                    className="font-medium text-foreground no-underline after:absolute after:inset-0"
                  >
                    {book.title}
                  </Link>
                  <p className="text-xs text-muted-foreground">{book.author}</p>
                </DataListCell>
                <DataListCell className="hidden sm:block">
                  <p className="text-sm text-muted-foreground">{book.genre.name}</p>
                </DataListCell>
                <DataListCell className="hidden md:block">
                  <p className="text-sm text-muted-foreground">{book.publisher}</p>
                </DataListCell>
              </DataListRow>
            ))
          ) : (
            <div className="p-10 text-center text-sm text-muted-foreground">
              No books match “{searchTerm}”.
            </div>
          )}
        </DataList>
        <p className="mt-3 text-xs text-muted-foreground">
          Showing {items.length} of {books.length} books
        </p>
      </PageContent>
    </Page>
  );
}
