import { index, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const genres = pgTable("genres", {
  id: text().primaryKey(),
  name: text().notNull().unique(),
  color: text().notNull(),
});

export const books = pgTable(
  "books",
  {
    id: text().primaryKey(),
    title: text().notNull(),
    author: text().notNull(),
    publisher: text().notNull(),
    publishedAt: text("published_at").notNull(),
    description: text().notNull(),
    genreId: text("genre_id")
      .notNull()
      .references(() => genres.id),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("books_genre_id_idx").on(table.genreId)],
);
