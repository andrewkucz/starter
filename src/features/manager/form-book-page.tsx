import { useForm } from "@tanstack/react-form";
import { Link } from "@tanstack/react-router";
import { ArrowLeftIcon, CheckIcon } from "lucide-react";
import { useState } from "react";
import { z } from "zod";

import { Page, PageContent, PageHeader, PageTitle } from "@/components/layout/page-layout";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldError, Input, Label, Select, Textarea } from "@/components/ui/form-controls";
import type { Book } from "@/data/books/types";
import type { Genre } from "@/data/genres/types";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  genreId: z.string().min(1),
  publisher: z.string(),
  publishedAt: z.string(),
  description: z.string(),
});

function ErrorFor({ errors }: { errors: Array<unknown> }) {
  const first = errors[0];
  if (!first) return null;
  return (
    <FieldError>
      {String(typeof first === "object" && first && "message" in first ? first.message : first)}
    </FieldError>
  );
}

export function FormBookPage({ book, genres }: { book?: Book | null; genres: Array<Genre> }) {
  const [saved, setSaved] = useState(false);
  const form = useForm({
    defaultValues: {
      title: book?.title ?? "",
      author: book?.author ?? "",
      genreId: book?.genre.id ?? genres[0]?.id ?? "",
      publisher: book?.publisher ?? "",
      publishedAt: book?.publishedAt ?? "",
      description: book?.description ?? "",
    },
    validators: { onBlur: schema },
    onSubmit: () => {
      setSaved(true);
    },
  });
  return (
    <form
      className="flex flex-1 flex-col"
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        void form.handleSubmit();
      }}
    >
      <Page>
        <PageHeader
          before={
            <Link
              to={book ? "/manager/books/$id" : "/manager/books"}
              params={book ? { id: book.id } : undefined}
              className={buttonVariants({ variant: "ghost", size: "icon" })}
              aria-label="Back"
            >
              <ArrowLeftIcon />
            </Link>
          }
          actions={
            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting] as const}>
              {([canSubmit, isSubmitting]) => (
                <Button type="submit" size="sm" disabled={!canSubmit || isSubmitting}>
                  {saved ? <CheckIcon /> : null}
                  {saved ? "Saved" : book ? "Save" : "Create"}
                </Button>
              )}
            </form.Subscribe>
          }
        >
          <PageTitle>{book ? book.title : "New book"}</PageTitle>
        </PageHeader>
        <PageContent width="narrow" className="gap-4 py-6">
          {saved ? (
            <div
              role="status"
              className="rounded-md border border-positive-300 bg-positive-50 p-3 text-sm text-positive-800 dark:border-positive-800 dark:bg-positive-950 dark:text-positive-200"
            >
              Changes are staged in this UI scaffold. Connect this submit handler to a
              Drizzle-backed server function when your domain schema is ready.
            </div>
          ) : null}
          <Card>
            <CardContent className="grid gap-5 p-6">
              <form.Field name="title">
                {(field) => (
                  <Field>
                    <Label htmlFor={field.name}>Title</Label>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) => {
                        setSaved(false);
                        field.handleChange(event.target.value);
                      }}
                      autoFocus
                    />
                    <ErrorFor errors={field.state.meta.errors} />
                  </Field>
                )}
              </form.Field>
              <form.Field name="author">
                {(field) => (
                  <Field>
                    <Label htmlFor={field.name}>Author</Label>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(event) => {
                        setSaved(false);
                        field.handleChange(event.target.value);
                      }}
                    />
                    <ErrorFor errors={field.state.meta.errors} />
                  </Field>
                )}
              </form.Field>
              <div className="grid gap-5 sm:grid-cols-2">
                <form.Field name="genreId">
                  {(field) => (
                    <Field>
                      <Label htmlFor={field.name}>Genre</Label>
                      <Select
                        id={field.name}
                        value={field.state.value}
                        onChange={(event) => {
                          setSaved(false);
                          field.handleChange(event.target.value);
                        }}
                      >
                        {genres.map((genre) => (
                          <option key={genre.id} value={genre.id}>
                            {genre.name}
                          </option>
                        ))}
                      </Select>
                    </Field>
                  )}
                </form.Field>
                <form.Field name="publishedAt">
                  {(field) => (
                    <Field>
                      <Label htmlFor={field.name}>Publication year</Label>
                      <Input
                        id={field.name}
                        inputMode="numeric"
                        value={field.state.value}
                        onChange={(event) => {
                          setSaved(false);
                          field.handleChange(event.target.value);
                        }}
                      />
                    </Field>
                  )}
                </form.Field>
              </div>
              <form.Field name="publisher">
                {(field) => (
                  <Field>
                    <Label htmlFor={field.name}>Publisher</Label>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      onChange={(event) => {
                        setSaved(false);
                        field.handleChange(event.target.value);
                      }}
                    />
                  </Field>
                )}
              </form.Field>
              <form.Field name="description">
                {(field) => (
                  <Field>
                    <Label htmlFor={field.name}>Description</Label>
                    <Textarea
                      id={field.name}
                      value={field.state.value}
                      onChange={(event) => {
                        setSaved(false);
                        field.handleChange(event.target.value);
                      }}
                    />
                  </Field>
                )}
              </form.Field>
            </CardContent>
          </Card>
        </PageContent>
      </Page>
    </form>
  );
}
