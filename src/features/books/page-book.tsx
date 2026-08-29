import { Link } from "@tanstack/react-router";
import { ArrowLeftIcon } from "lucide-react";

import { Page, PageContent, PageHeader, PageTitle } from "@/components/layout/page-layout";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Book } from "@/data/books/types";
import { BookCover } from "@/features/books/book-cover";

export function PageBook({ book }: { book: Book | null }) {
  if (!book)
    return (
      <Page>
        <PageHeader>
          <PageTitle>Book not found</PageTitle>
        </PageHeader>
        <PageContent>
          <p className="text-sm text-muted-foreground">That book is not in the catalog.</p>
        </PageContent>
      </Page>
    );
  return (
    <Page>
      <PageHeader
        before={
          <Link
            to="/app/books"
            aria-label="Back to books"
            className={buttonVariants({ variant: "ghost", size: "icon" })}
          >
            <ArrowLeftIcon />
          </Link>
        }
      >
        <PageTitle>{book.title}</PageTitle>
      </PageHeader>
      <PageContent className="justify-center py-8" width="narrow">
        <Card>
          <CardContent className="grid gap-7 p-6 sm:grid-cols-[12rem_1fr]">
            <BookCover book={book} />
            <div className="flex flex-col justify-center">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {book.genre.name}
              </p>
              <h1 className="mt-2 text-2xl font-bold tracking-tight">{book.title}</h1>
              <p className="mt-1 text-sm text-muted-foreground">by {book.author}</p>
              <p className="mt-5 text-sm leading-7 text-muted-foreground">{book.description}</p>
              <dl className="mt-6 grid grid-cols-2 gap-4 border-t pt-4 text-sm">
                <div>
                  <dt className="text-xs text-muted-foreground">Publisher</dt>
                  <dd className="mt-1 font-medium">{book.publisher}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Published</dt>
                  <dd className="mt-1 font-medium">{book.publishedAt}</dd>
                </div>
              </dl>
            </div>
          </CardContent>
        </Card>
      </PageContent>
    </Page>
  );
}
