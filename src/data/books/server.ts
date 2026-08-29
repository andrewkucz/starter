import { createServerFn } from "@tanstack/react-start";

import { db } from "@/db/index";

export const getBooks = createServerFn({ method: "GET" }).handler(async () => {
  return db.query.books.findMany({
    columns: {
      genreId: false,
      createdAt: false,
    },
    with: { genre: true },
    orderBy: { createdAt: "desc" },
  });
});

export const getBook = createServerFn({ method: "GET" })
  .validator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    return (
      (await db.query.books.findFirst({
        where: { id: data.id },
        columns: {
          genreId: false,
          createdAt: false,
        },
        with: { genre: true },
      })) ?? null
    );
  });
