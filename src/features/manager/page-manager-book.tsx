import { Link } from "@tanstack/react-router";
import { ArrowLeftIcon, PencilIcon } from "lucide-react";

import { Page, PageContent, PageHeader, PageTitle } from "@/components/layout/page-layout";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Book } from "@/data/books/types";
import { BookCover } from "@/features/books/book-cover";
import { cn } from "@/lib/utils";

export function PageManagerBook({ book }: { book: Book | null }) {
  if (!book)
    return (
      <Page>
        <PageHeader>
          <PageTitle>Book not found</PageTitle>
        </PageHeader>
        <PageContent>
          <p className="text-sm text-muted-foreground">That book is not in this scaffold.</p>
        </PageContent>
      </Page>
    );
  return (
    <Page>
      <PageHeader
        before={
          <Link
            to="/manager/books"
            className={buttonVariants({ variant: "ghost", size: "icon" })}
            aria-label="Back to books"
          >
            <ArrowLeftIcon />
          </Link>
        }
        actions={
          <Link
            to="/manager/books/$id/update"
            params={{ id: book.id }}
            className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "no-underline")}
          >
            <PencilIcon />
            Edit
          </Link>
        }
      >
        <PageTitle>{book.title}</PageTitle>
      </PageHeader>
      <PageContent width="narrow" className="py-6">
        <Card>
          <CardContent className="grid gap-6 p-6 sm:grid-cols-[10rem_1fr]">
            <BookCover book={book} />
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {book.genre.name}
              </p>
              <h1 className="mt-2 text-xl font-bold">{book.title}</h1>
              <p className="mt-1 text-sm text-muted-foreground">{book.author}</p>
              <p className="mt-5 text-sm leading-7 text-muted-foreground">{book.description}</p>
              <dl className="mt-5 divide-y border-y text-sm">
                <div className="flex justify-between py-3">
                  <dt className="text-muted-foreground">Publisher</dt>
                  <dd className="font-medium">{book.publisher}</dd>
                </div>
                <div className="flex justify-between py-3">
                  <dt className="text-muted-foreground">Published</dt>
                  <dd className="font-medium">{book.publishedAt}</dd>
                </div>
              </dl>
            </div>
          </CardContent>
        </Card>
      </PageContent>
    </Page>
  );
}
