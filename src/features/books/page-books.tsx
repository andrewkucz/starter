import { Link } from "@tanstack/react-router";

import { Page, PageContent, PageHeader, PageTitle } from "@/components/layout/page-layout";
import type { Book } from "@/data/books/types";
import { BookCover } from "@/features/books/book-cover";

export function PageBooks({ books }: { books: Array<Book> }) {
  return (
    <Page>
      <PageHeader>
        <PageTitle>Books</PageTitle>
      </PageHeader>
      <PageContent>
        <div className="grid grid-cols-2 gap-5 pb-8 sm:grid-cols-3 md:grid-cols-4">
          {books.map((book) => (
            <Link
              key={book.id}
              to="/app/books/$id"
              params={{ id: book.id }}
              className="group no-underline"
            >
              <BookCover
                book={book}
                className="transition duration-300 group-hover:-translate-y-2 group-hover:rotate-1 group-focus-visible:ring-2"
              />
              <div className="mt-3">
                <p className="truncate text-sm font-medium text-foreground">{book.title}</p>
                <p className="truncate text-xs text-muted-foreground">{book.author}</p>
              </div>
            </Link>
          ))}
        </div>
      </PageContent>
    </Page>
  );
}
